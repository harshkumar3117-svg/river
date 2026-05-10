import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WaterIcon from '@mui/icons-material/Water';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import PublicIcon from '@mui/icons-material/Public';
import NatureIcon from '@mui/icons-material/Nature';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TuneIcon from '@mui/icons-material/Tune';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { predictStreamflow, type InputFeatures } from '../utils/prediction';
import ResultCard from './ResultCard';

type FieldDef = {
  key: keyof InputFeatures;
  label: string;
  tooltip: string;
  step?: number;
  min?: number;
  max?: number;
};

const TEMPORAL_FIELDS: FieldDef[] = [
  { key: 'month', label: 'Month', tooltip: 'Calendar month (1=Jan, 12=Dec)', step: 1, min: 1, max: 12 },
  { key: 'day_of_year', label: 'Day of Year', tooltip: 'Day of the year (1–365)', step: 1, min: 1, max: 365 },
];

const STREAMFLOW_FIELDS: FieldDef[] = [
  { key: 'streamflow_today_cumecs', label: "Today's Streamflow (m³/s)", tooltip: "Yesterday's observed raw streamflow — strongest feature", step: 0.1, min: 0 },
  { key: 'streamflow_anomaly_zscore', label: 'Streamflow Anomaly Z-Score', tooltip: "Today's streamflow as z-score relative to historical climatology", step: 0.01 },
  { key: 'flow_rate_of_change', label: 'Flow Rate of Change (m³/s/day)', tooltip: 'Difference between today and yesterday streamflow', step: 0.1 },
  { key: 'flow_velocity_km_per_day', label: 'Flow Velocity (km/day)', tooltip: 'Scaled flow velocity through the river reach', step: 0.01 },
];

const RAINFALL_FIELDS: FieldDef[] = [
  { key: 'antecedent_rain_3d_sum', label: '3-Day Rain Sum (norm)', tooltip: 'Total rainfall over past 3 days, normalised', step: 0.001 },
  { key: 'antecedent_rain_7d_sum', label: '7-Day Rain Sum (norm)', tooltip: 'Total rainfall over past 7 days, normalised', step: 0.001 },
  { key: 'antecedent_rain_15d_sum', label: '15-Day Rain Sum (norm)', tooltip: 'Total rainfall over past 15 days, normalised', step: 0.001 },
  { key: 'antecedent_rain_30d_sum', label: '30-Day Rain Sum (norm)', tooltip: 'Total rainfall over past 30 days, normalised', step: 0.001 },
  { key: 'antecedent_rain_60d', label: '60-Day Rain (norm)', tooltip: 'Total rainfall over past 60 days, normalised', step: 0.001 },
  { key: 'antecedent_rain_ewm', label: 'Rainfall EWM', tooltip: 'Exponentially weighted mean — recent days weighted higher', step: 0.001 },
  { key: 'rainfall_anomaly_zscore', label: 'Rainfall Anomaly Z-Score', tooltip: "Today's rainfall as z-score vs historical climatology", step: 0.01 },
];

const UPSTREAM_FIELDS: FieldDef[] = [
  { key: 'upstream_rain_mean_scaled', label: 'Upstream Rain Mean (scaled)', tooltip: 'Mean rainfall across upstream sub-basins', step: 0.001 },
  { key: 'upstream_rain_weighted_scaled', label: 'Upstream Rain Weighted (scaled)', tooltip: 'Upstream rainfall weighted by sub-basin area', step: 0.001 },
  { key: 'upstream_rain_lagged_dist_sink', label: 'Upstream Rain Lagged', tooltip: 'Upstream rainfall lagged by travel time to gauge', step: 0.001 },
];

const SOIL_FIELDS: FieldDef[] = [
  { key: 'soil_saturation_score', label: 'Soil Saturation Score (0–1)', tooltip: '0 = dry, 1 = fully saturated', step: 0.01, min: 0, max: 1 },
  { key: 'antecedent_saturation_interaction', label: 'Saturation Interaction', tooltip: 'Interaction between antecedent rainfall and soil saturation', step: 0.001 },
  { key: 'is_post_monsoon_saturated', label: 'Post-Monsoon Saturated (0/1)', tooltip: 'Binary: 1 = post-monsoon with high residual soil moisture', step: 1, min: 0, max: 1 },
];

const SEASONAL_FIELDS: FieldDef[] = [
  { key: 'monsoon_intensity', label: 'Monsoon Intensity (0=off-season)', tooltip: 'Categorical intensity of current monsoon phase', step: 1, min: 0 },
  { key: 'monsoon_cumulative_rain', label: 'Monsoon Cumulative Rain (norm)', tooltip: 'Total rainfall since monsoon onset this year', step: 0.001 },
];

const BASIN_FIELDS: FieldDef[] = [
  { key: 'dist_to_outlet_scaled', label: 'Distance to Outlet (scaled)', tooltip: 'Distance from gauge to basin outlet', step: 0.001 },
  { key: 'upstream_area_scaled', label: 'Upstream Area (scaled)', tooltip: 'Upstream catchment area in km²', step: 0.001 },
  { key: 'slope_scaled', label: 'Slope (scaled)', tooltip: 'Mean terrain slope of the basin', step: 0.001 },
  { key: 'slope_uav_scaled', label: 'Slope Variability (scaled)', tooltip: 'Slope variability index across the basin', step: 0.001 },
  { key: 'forest_cover_scaled', label: 'Forest Cover (scaled)', tooltip: 'Percentage of basin covered by forest', step: 0.001 },
  { key: 'urban_cover_scaled', label: 'Urban Cover (scaled)', tooltip: 'Percentage of basin covered by urban land use', step: 0.001 },
];

const INTERACTION_FIELDS: FieldDef[] = [
  { key: 'rain_soilmoisture_interaction', label: 'Rain × Soil Moisture', tooltip: 'Rainfall × monthly soil water content', step: 0.001 },
  { key: 'rain_urban_interaction', label: 'Rain × Urban Cover', tooltip: 'Rainfall × urban cover fraction', step: 0.001 },
  { key: 'rain_slope_interaction', label: 'Rain × Slope', tooltip: 'Rainfall × terrain slope', step: 0.001 },
  { key: 'rain_basinsize_interaction', label: 'Rain × Basin Size', tooltip: 'Rainfall × upstream area', step: 0.001 },
  { key: 'uparea_rain_interaction', label: 'Upstream Area × Rain', tooltip: 'Upstream area × upstream rainfall', step: 0.001 },
];

const ALL_FIELDS = [
  ...TEMPORAL_FIELDS, ...STREAMFLOW_FIELDS, ...RAINFALL_FIELDS,
  ...UPSTREAM_FIELDS, ...SOIL_FIELDS, ...SEASONAL_FIELDS,
  ...BASIN_FIELDS, ...INTERACTION_FIELDS
];

const EXAMPLE_VALUES: InputFeatures = {
  month: 8,
  day_of_year: 220,
  streamflow_today_cumecs: 1850,
  streamflow_anomaly_zscore: 1.2,
  flow_rate_of_change: 120,
  flow_velocity_km_per_day: 0.85,
  antecedent_rain_3d_sum: 0.42,
  antecedent_rain_7d_sum: 0.68,
  antecedent_rain_15d_sum: 0.91,
  antecedent_rain_30d_sum: 1.15,
  antecedent_rain_60d: 1.87,
  antecedent_rain_ewm: 0.38,
  rainfall_anomaly_zscore: 0.9,
  upstream_rain_mean_scaled: 0.55,
  upstream_rain_weighted_scaled: 0.62,
  upstream_rain_lagged_dist_sink: 0.48,
  soil_saturation_score: 0.78,
  antecedent_saturation_interaction: 0.71,
  is_post_monsoon_saturated: 0,
  monsoon_intensity: 3,
  monsoon_cumulative_rain: 0.74,
  dist_to_outlet_scaled: 0.34,
  upstream_area_scaled: 0.81,
  slope_scaled: 0.22,
  slope_uav_scaled: 0.18,
  forest_cover_scaled: 0.41,
  urban_cover_scaled: 0.09,
  rain_soilmoisture_interaction: 0.33,
  rain_urban_interaction: 0.04,
  rain_slope_interaction: 0.09,
  rain_basinsize_interaction: 0.51,
  uparea_rain_interaction: 0.50,
};

type Section = {
  title: string;
  icon: React.ReactNode;
  fields: FieldDef[];
  color: string;
};

export default function PredictionForm() {
  const theme = useTheme();
  const [features, setFeatures] = useState<Record<string, string>>(
    Object.fromEntries(Object.keys(EXAMPLE_VALUES).map((k) => [k, '']))
  );
  const [result, setResult] = useState<{ value: number; delta: number; confidence: string; category: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    let finalValue = value;
    if (value !== '') {
      const fieldDef = ALL_FIELDS.find(f => f.key === key);
      if (fieldDef) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          if (fieldDef.max !== undefined && num > fieldDef.max) {
            finalValue = String(fieldDef.max);
          } else if (fieldDef.min !== undefined && num < fieldDef.min) {
            finalValue = String(fieldDef.min);
          }
        }
      }
    }

    setFeatures((prev) => ({ ...prev, [key]: finalValue }));
    setResult(null);
    setError(null);
  };

  const loadExample = () => {
    setFeatures(Object.fromEntries(Object.entries(EXAMPLE_VALUES).map(([k, v]) => [k, String(v)])));
    setResult(null);
    setError(null);
  };

  const clearAll = () => {
    setFeatures(Object.fromEntries(Object.keys(EXAMPLE_VALUES).map((k) => [k, ''])));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    const missing = Object.entries(features).filter(([, v]) => v === '').map(([k]) => k);
    if (missing.length > 0) {
      setError(`Please fill in all fields. Missing: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ` and ${missing.length - 3} more` : ''}.`);
      return;
    }

    const parsed = Object.fromEntries(
      Object.entries(features).map(([k, v]) => [k, parseFloat(v)])
    ) as InputFeatures;

    const invalidFields = Object.entries(parsed).filter(([, v]) => isNaN(v));
    if (invalidFields.length > 0) {
      setError(`Invalid numeric values in: ${invalidFields.map(([k]) => k).join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const prediction = await predictStreamflow(parsed);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed.');
    } finally {
      setLoading(false);
    }

    setTimeout(() => {
      document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const sections: Section[] = [
    { title: 'Temporal Features', icon: <WaterIcon />, fields: TEMPORAL_FIELDS, color: theme.palette.primary.main },
    { title: 'Streamflow Signals', icon: <TrendingUpIcon />, fields: STREAMFLOW_FIELDS, color: '#06d6a0' },
    { title: 'Rainfall Signals', icon: <ThunderstormIcon />, fields: RAINFALL_FIELDS, color: '#48cae4' },
    { title: 'Upstream Signals', icon: <PublicIcon />, fields: UPSTREAM_FIELDS, color: '#fcbf49' },
    { title: 'Soil & Saturation', icon: <NatureIcon />, fields: SOIL_FIELDS, color: '#f77f00' },
    { title: 'Seasonal Signals', icon: <WaterIcon />, fields: SEASONAL_FIELDS, color: '#90caf9' },
    { title: 'Basin Properties', icon: <PublicIcon />, fields: BASIN_FIELDS, color: '#ef233c' },
    { title: 'Interaction Features', icon: <TuneIcon />, fields: INTERACTION_FIELDS, color: '#d62828' },
  ];

  const glassSx = {
    backdropFilter: 'blur(20px)',
    bgcolor: 'rgba(13,27,52,0.65)',
    border: '1px solid rgba(0,180,216,0.15)',
    borderRadius: 4,
  };

  return (
    <Box
      id="predict"
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        bgcolor: 'background.default',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,180,216,0.4), transparent)',
        },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        {/* Section header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            label="ML Prediction Engine"
            size="small"
            sx={{
              mb: 2,
              bgcolor: 'rgba(0,180,216,0.12)',
              border: '1px solid',
              borderColor: 'primary.main',
              color: 'primary.light',
              fontWeight: 600,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              fontSize: '0.7rem',
            }}
          />
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Enter Hydro-Meteorological Features
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto' }}>
            Provide daily observations to receive a next-day streamflow prediction using physics-informed ML.
          </Typography>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={loadExample}
            sx={{
              borderColor: 'rgba(0,180,216,0.4)',
              color: 'primary.light',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0,180,216,0.08)' },
            }}
          >
            Load Example Data
          </Button>
          <Button
            variant="text"
            onClick={clearAll}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
          >
            Clear All
          </Button>
        </Box>

        {/* Form sections */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          {sections.map((section, si) => (
            <Accordion
              key={section.title}
              defaultExpanded={si < 2}
              sx={{
                ...glassSx,
                '&.MuiAccordion-root': { ...glassSx },
                '&::before': { display: 'none' },
                mb: 0,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: section.color }} />}
                sx={{
                  px: 3,
                  '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5 },
                }}
              >
                <Box sx={{ color: section.color, display: 'flex', alignItems: 'center' }}>
                  {section.icon}
                </Box>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                  {section.title}
                </Typography>
                <Chip
                  label={`${section.fields.length} fields`}
                  size="small"
                  sx={{
                    ml: 'auto',
                    bgcolor: 'rgba(255,255,255,0.06)',
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                <Divider sx={{ mb: 3, borderColor: `${section.color}30` }} />
                <Grid container spacing={2.5}>
                  {section.fields.map((field) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field.key}>
                      <Box sx={{ position: 'relative' }}>
                        <TextField
                          fullWidth
                          label={field.label}
                          type="number"
                          value={features[field.key]}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          inputProps={{
                            step: field.step ?? 0.01,
                            min: field.min,
                            max: field.max,
                          }}
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(255,255,255,0.03)',
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                              '&:hover fieldset': { borderColor: `${section.color}60` },
                              '&.Mui-focused fieldset': { borderColor: section.color },
                            },
                            '& .MuiInputLabel-root.Mui-focused': { color: section.color },
                            '& .MuiInputLabel-root': { fontSize: '1rem', fontWeight: 500, top: '-2px' },
                            '& .MuiOutlinedInput-input': { fontSize: '1.1rem', py: 1.5 },
                          }}
                        />
                        <Tooltip title={field.tooltip} arrow placement="top">
                          <InfoOutlinedIcon
                            sx={{
                              position: 'absolute',
                              right: 8,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              fontSize: 14,
                              color: 'rgba(255,255,255,0.2)',
                              cursor: 'help',
                              '&:hover': { color: section.color },
                              zIndex: 1,
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(247,127,0,0.1)', border: '1px solid rgba(247,127,0,0.3)' }}>
            {error}
          </Alert>
        )}

        {/* Submit */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <WaterIcon />}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: `0 0 40px rgba(0,180,216,0.35)`,
              '&:hover': {
                boxShadow: `0 0 60px rgba(0,180,216,0.55)`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.25s ease',
              '&:disabled': { opacity: 0.7 },
            }}
          >
            {loading ? 'Computing...' : 'Predict Streamflow'}
          </Button>
        </Box>

        {/* Result */}
        {result && (
          <Box id="result-card">
            <ResultCard value={result.value} delta={result.delta} confidence={result.confidence} category={result.category} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
