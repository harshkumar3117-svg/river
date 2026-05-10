import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import WaterIcon from '@mui/icons-material/Water';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DangerousIcon from '@mui/icons-material/Dangerous';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type Props = {
  value: number;
  delta: number;
  confidence: string;
  category: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  'Low Flow': '#06d6a0',
  'Moderate Flow': '#48cae4',
  'High Flow': '#fcbf49',
  'Flood Risk': '#f77f00',
  'Severe Flood': '#ef233c',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Low Flow': <CheckCircleOutlineIcon />,
  'Moderate Flow': <InfoOutlinedIcon />,
  'High Flow': <WaterIcon />,
  'Flood Risk': <WarningAmberIcon />,
  'Severe Flood': <DangerousIcon />,
};

const RISK_THRESHOLDS = [
  { label: 'Low', max: 300, color: '#06d6a0' },
  { label: 'Moderate', max: 800, color: '#48cae4' },
  { label: 'High', max: 2000, color: '#fcbf49' },
  { label: 'Flood', max: 5000, color: '#f77f00' },
  { label: 'Severe', max: Infinity, color: '#ef233c' },
];

function AnimatedNumber({ target }: { target: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1200;
    const raf = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * target * 10) / 10);
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target]);

  return <>{displayed.toLocaleString()}</>;
}

export default function ResultCard({ value, delta, confidence, category }: Props) {
  const theme = useTheme();
  const color = CATEGORY_COLORS[category] ?? theme.palette.primary.main;
  const icon = CATEGORY_ICONS[category];

  const maxScale = 10000;
  const progress = Math.min((value / maxScale) * 100, 100);

  const glassSx = {
    backdropFilter: 'blur(24px)',
    bgcolor: 'rgba(13,27,52,0.75)',
    border: `1px solid ${color}40`,
    borderRadius: 4,
    boxShadow: `0 0 60px ${color}20, inset 0 1px 0 rgba(255,255,255,0.05)`,
  };

  return (
    <Box sx={{ ...glassSx, p: { xs: 3, md: 4 }, overflow: 'hidden', position: 'relative' }}>
      {/* Glow background */}
      <Box
        sx={{
          position: 'absolute',
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: `${color}20`,
            border: `1px solid ${color}50`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary', lineHeight: 1, display: 'block', letterSpacing: 1.5 }}>
            Prediction Result
          </Typography>
          <Typography variant="h6" sx={{ color, fontWeight: 700, lineHeight: 1.2 }}>
            {category}
          </Typography>
        </Box>
        <Chip
          label={confidence}
          size="small"
          sx={{
            ml: 'auto',
            bgcolor: `${color}20`,
            border: `1px solid ${color}50`,
            color,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 1,
            fontSize: '0.7rem',
          }}
        />
      </Box>

      <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* Main value */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography
          component="div"
          sx={{
            fontSize: { xs: '3.5rem', md: '5rem' },
            fontWeight: 800,
            lineHeight: 1,
            color,
            textShadow: `0 0 40px ${color}60`,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <AnimatedNumber target={value} />
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mt: 1, fontWeight: 400 }}>
          m³/s (cumecs) — T+1 Prediction
        </Typography>
      </Box>

      {/* Delta Display */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: 1.5,
          mb: 4,
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.1)'
        }}
      >
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Predicted Delta:
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            color: delta >= 0 ? '#ff4d4d' : '#00e676', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {delta >= 0 ? '+' : ''}{delta.toFixed(2)} m³/s
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          (Change from Today)
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Flow Scale (0 – 10,000 m³/s)
          </Typography>
          <Typography variant="caption" sx={{ color }}>
            {progress.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.06)',
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${color})`,
              borderRadius: 4,
              boxShadow: `0 0 12px ${color}60`,
            },
          }}
        />
      </Box>

      {/* Threshold markers */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {RISK_THRESHOLDS.map((t, i) => {
          const isActive = category === ['Low Flow', 'Moderate Flow', 'High Flow', 'Flood Risk', 'Severe Flood'][i];
          return (
            <Box
              key={t.label}
              sx={{
                flex: '1 1 auto',
                py: 1,
                px: 1.5,
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: isActive ? `${t.color}20` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${isActive ? t.color + '60' : 'rgba(255,255,255,0.06)'}`,
                transition: 'all 0.3s ease',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: isActive ? t.color : 'text.secondary',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: '0.7rem',
                  display: 'block',
                }}
              >
                {t.label}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>
                {t.max === Infinity ? '>5000' : `<${t.max}`}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Info footer */}
      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          gap: 1,
          alignItems: 'flex-start',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 16, color: 'text.secondary', mt: 0.2, flexShrink: 0 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
          Prediction is made using a physics-informed ensemble model trained on Ganga-Brahmaputra hydro-meteorological data. KGE ≥ 0.75 indicates a good model. Persistence baseline: KGE = 0.9978.
        </Typography>
      </Box>
    </Box>
  );
}
