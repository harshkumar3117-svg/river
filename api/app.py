import os
import gc
import numpy as np
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf

# Set environment variables for memory and CPU control BEFORE anything else
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_NUM_INTRAOP_THREADS'] = '1'
os.environ['TF_NUM_INTEROP_THREADS'] = '1'

# Optimize for low-memory environments
tf.config.threading.set_intra_op_parallelism_threads(1)
tf.config.threading.set_inter_op_parallelism_threads(1)

app = Flask(__name__)
# Allow all origins
CORS(app, supports_credentials=True)

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "River Streamflow Prediction API is running",
        "model_loaded": model is not None
    })

# Load the model and scalers
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model_epoch_10_direct.keras")
X_SCALER_PATH = os.path.join(BASE_DIR, "x_scaler.pkl")
Y_SCALER_PATH = os.path.join(BASE_DIR, "y_scaler.pkl")

print(f"DEBUG: Starting application in {BASE_DIR}")

if os.path.exists(MODEL_PATH):
    print(f"DEBUG: Loading model from {MODEL_PATH}...")
    try:
        model = tf.keras.models.load_model(MODEL_PATH, compile=False, safe_mode=False)
        print("DEBUG: Model loaded successfully.")
        # Force garbage collection to free up RAM used during loading
        gc.collect()
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
else:
    print(f"Model file not found at {MODEL_PATH}")
    model = None

try:
    x_scaler = joblib.load(X_SCALER_PATH)
    print("DEBUG: X Scaler loaded successfully.")
    gc.collect()
except Exception as e:
    print(f"Error loading X scaler: {e}")
    x_scaler = None

try:
    y_scaler = joblib.load(Y_SCALER_PATH)
    print("DEBUG: Y Scaler loaded successfully.")
    gc.collect()
except Exception as e:
    print(f"Error loading Y scaler: {e}")
    y_scaler = None

# Feature order (must match exactly what the model expects)
FEATURE_KEYS = [
    'month', 'day_of_year', 'streamflow_today_cumecs', 'streamflow_anomaly_zscore',
    'flow_rate_of_change', 'flow_velocity_km_per_day', 'antecedent_rain_3d_sum',
    'antecedent_rain_7d_sum', 'antecedent_rain_15d_sum', 'antecedent_rain_30d_sum',
    'antecedent_rain_60d', 'antecedent_rain_ewm', 'rainfall_anomaly_zscore',
    'upstream_rain_mean_scaled', 'upstream_rain_weighted_scaled', 'upstream_rain_lagged_dist_sink',
    'soil_saturation_score', 'antecedent_saturation_interaction', 'is_post_monsoon_saturated',
    'monsoon_intensity', 'monsoon_cumulative_rain', 'dist_to_outlet_scaled', 'upstream_area_scaled',
    'slope_scaled', 'slope_uav_scaled', 'forest_cover_scaled', 'urban_cover_scaled',
    'rain_soilmoisture_interaction', 'rain_urban_interaction', 'rain_slope_interaction',
    'rain_basinsize_interaction', 'uparea_rain_interaction'
]

@app.route('/predict', methods=['POST'])
def predict():
    print("DEBUG: Received prediction request")
    if model is None or x_scaler is None or y_scaler is None:
        return jsonify({'error': 'Model or Scalers not loaded on the server.'}), 500
    
    data = request.json
    if not data:
        return jsonify({'error': 'No input data provided.'}), 400
    
    try:
        # Extract all 32 features in the correct order for the model
        features = []
        for key in FEATURE_KEYS:
            if key not in data:
                return jsonify({'error': f'Missing feature: {key}'}), 400
            features.append(float(data[key]))
        
        # The 11 features that the scaler expects, in the exact order it was trained on
        SCALED_KEYS = [
            'streamflow_today_cumecs', 'flow_rate_of_change', 'flow_velocity_km_per_day',
            'antecedent_rain_3d_sum', 'antecedent_rain_7d_sum', 'antecedent_rain_15d_sum',
            'antecedent_rain_30d_sum', 'antecedent_rain_60d', 'antecedent_rain_ewm',
            'monsoon_cumulative_rain', 'monsoon_intensity'
        ]
        
        # Extract the 11 features to scale
        features_to_scale = [float(data[k]) for k in SCALED_KEYS]
        scaled_sub_array = x_scaler.transform(np.array(features_to_scale).reshape(1, -1))[0]
        
        # Put the scaled values back into the full 32-feature array
        input_data = np.array(features, dtype=np.float32)
        for i, key in enumerate(SCALED_KEYS):
            # Find the index of this key in the full FEATURE_KEYS
            full_idx = FEATURE_KEYS.index(key)
            input_data[full_idx] = scaled_sub_array[i]
            
        # Reshape to (1, 32)
        input_data = input_data.reshape(1, -1)
        
        # Run prediction using direct call (more memory efficient than .predict())
        # We use training=False to ensure dropout/batchnorm are in inference mode
        scaled_prediction = model(input_data, training=False).numpy()
        print(f"DEBUG: Raw model prediction (scaled): {scaled_prediction}")
        
        # Inverse transform the prediction
        predicted_value_array = y_scaler.inverse_transform(scaled_prediction)
        
        # Predicted value from model is the "Delta" (change in flow)
        predicted_delta = float(predicted_value_array[0][0]) if len(predicted_value_array.shape) > 1 else float(predicted_value_array[0])
        print(f"DEBUG: Predicted delta (change): {predicted_delta}")
        
        # Final Prediction = Today's Flow + Predicted Delta
        final_prediction = float(data['streamflow_today_cumecs']) + predicted_delta
        
        # Cap at 0 if negative
        final_prediction = max(0.0, final_prediction)
        print(f"DEBUG: Final predicted flow: {final_prediction}")
        
        return jsonify({
            'value': final_prediction,
            'delta': predicted_delta
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port=int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)