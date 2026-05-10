export type InputFeatures = {
  month: number;
  day_of_year: number;
  streamflow_today_cumecs: number;
  streamflow_anomaly_zscore: number;
  flow_rate_of_change: number;
  flow_velocity_km_per_day: number;
  antecedent_rain_3d_sum: number;
  antecedent_rain_7d_sum: number;
  antecedent_rain_15d_sum: number;
  antecedent_rain_30d_sum: number;
  antecedent_rain_60d: number;
  antecedent_rain_ewm: number;
  rainfall_anomaly_zscore: number;
  upstream_rain_mean_scaled: number;
  upstream_rain_weighted_scaled: number;
  upstream_rain_lagged_dist_sink: number;
  soil_saturation_score: number;
  antecedent_saturation_interaction: number;
  is_post_monsoon_saturated: number;
  monsoon_intensity: number;
  monsoon_cumulative_rain: number;
  dist_to_outlet_scaled: number;
  upstream_area_scaled: number;
  slope_scaled: number;
  slope_uav_scaled: number;
  forest_cover_scaled: number;
  urban_cover_scaled: number;
  rain_soilmoisture_interaction: number;
  rain_urban_interaction: number;
  rain_slope_interaction: number;
  rain_basinsize_interaction: number;
  uparea_rain_interaction: number;
};

export type PredictionResult = {
  value: number;
  delta: number;
  confidence: string;
  category: string;
};

export async function predictStreamflow(f: InputFeatures): Promise<PredictionResult> {
  let value = 0;
  try {
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(f),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server error:', errorData);
      throw new Error(errorData.error || 'Failed to fetch prediction from server');
    }

    const data = await response.json();
    value = data.value;
    const delta = data.delta;
    
    // Classify flood risk
    let category: string;
    let confidence: string;

    if (value < 300) {
      category = 'Low Flow';
      confidence = 'Normal';
    } else if (value < 800) {
      category = 'Moderate Flow';
      confidence = 'Watch';
    } else if (value < 2000) {
      category = 'High Flow';
      confidence = 'Warning';
    } else if (value < 5000) {
      category = 'Flood Risk';
      confidence = 'Alert';
    } else {
      category = 'Severe Flood';
      confidence = 'Critical';
    }

    return { 
      value: Math.round(value * 10) / 10, 
      delta: Math.round(delta * 100) / 100,
      confidence, 
      category 
    };
  } catch (error) {
    console.error('Prediction API error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to connect to the prediction server. Is the Python backend running?');
  }
}

export function computeKGE(observed: number[], simulated: number[]): number {
  if (observed.length !== simulated.length || observed.length === 0) return -Infinity;

  const n = observed.length;
  const meanObs = observed.reduce((a, b) => a + b, 0) / n;
  const meanSim = simulated.reduce((a, b) => a + b, 0) / n;

  const stdObs = Math.sqrt(observed.reduce((a, b) => a + Math.pow(b - meanObs, 2), 0) / n);
  const stdSim = Math.sqrt(simulated.reduce((a, b) => a + Math.pow(b - meanSim, 2), 0) / n);

  let cov = 0;
  for (let i = 0; i < n; i++) {
    cov += (observed[i] - meanObs) * (simulated[i] - meanSim);
  }
  cov /= n;

  const r = stdObs * stdSim > 0 ? cov / (stdObs * stdSim) : 0;
  const alpha = stdObs > 0 ? stdSim / stdObs : 1;
  const beta = meanObs > 0 ? meanSim / meanObs : 1;

  return 1 - Math.sqrt(Math.pow(r - 1, 2) + Math.pow(alpha - 1, 2) + Math.pow(beta - 1, 2));
}

export function computeNSE(observed: number[], simulated: number[]): number {
  if (observed.length !== simulated.length || observed.length === 0) return -Infinity;

  const meanObs = observed.reduce((a, b) => a + b, 0) / observed.length;

  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < observed.length; i++) {
    ssRes += Math.pow(observed[i] - simulated[i], 2);
    ssTot += Math.pow(observed[i] - meanObs, 2);
  }

  return ssTot > 0 ? 1 - ssRes / ssTot : 1;
}
