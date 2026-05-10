import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import TimelineIcon from '@mui/icons-material/Timeline';
import EqualizerIcon from '@mui/icons-material/Equalizer';

type MetricCardProps = {
  title: string;
  formula: string;
  description: string;
  color: string;
  icon: React.ReactNode;
  badges: { label: string; color: string }[];
};

function MetricCard({ title, formula, description, color, icon, badges }: MetricCardProps) {
  return (
    <Box
      sx={{
        backdropFilter: 'blur(20px)',
        bgcolor: 'rgba(13,27,52,0.65)',
        border: `1px solid ${color}25`,
        borderRadius: 4,
        p: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: `1px solid ${color}60`,
          boxShadow: `0 0 40px ${color}15`,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            bgcolor: `${color}15`,
            border: `1px solid ${color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            fontSize: 22,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.5,
          mb: 2,
          borderRadius: 2,
          bgcolor: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.06)',
          fontFamily: '"Courier New", monospace',
          fontSize: '0.8rem',
          color: color,
          lineHeight: 1.6,
          wordBreak: 'break-word',
        }}
      >
        {formula}
      </Box>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
        {description}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {badges.map((b) => (
          <Chip
            key={b.label}
            label={b.label}
            size="small"
            sx={{
              bgcolor: `${b.color}18`,
              border: `1px solid ${b.color}40`,
              color: b.color,
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

type BaselineRowProps = {
  name: string;
  kge: string;
  nse: string;
  highlight?: boolean;
  color?: string;
};

function BaselineRow({ name, kge, nse, highlight, color }: BaselineRowProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        px: 3,
        py: 2,
        borderRadius: 2,
        bgcolor: highlight ? `${color ?? theme.palette.primary.main}12` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${highlight ? (color ?? theme.palette.primary.main) + '30' : 'rgba(255,255,255,0.05)'}`,
        mb: 1,
        transition: 'all 0.2s',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.04)' },
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: highlight ? 700 : 400, color: highlight ? color ?? 'primary.main' : 'text.primary' }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', fontFamily: 'monospace' }}>
        {kge}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', fontFamily: 'monospace' }}>
        {nse}
      </Typography>
    </Box>
  );
}

export default function MetricsInfo() {
  const theme = useTheme();

  const metrics: MetricCardProps[] = [
    {
      title: 'Kling-Gupta Efficiency (KGE)',
      formula: 'KGE = 1 − √[(r−1)² + (α−1)² + (β−1)²]\nwhere α = σs/σo, β = μs/μo',
      description: 'Primary metric. Penalises errors in timing (r), variability (α), and volume (β) simultaneously. Perfect score = 1.0.',
      color: theme.palette.primary.main,
      icon: <AssessmentIcon />,
      badges: [
        { label: 'KGE ≥ 0.75 → Good', color: '#06d6a0' },
        { label: 'KGE ≥ 0.50 → Satisfactory', color: '#48cae4' },
        { label: 'KGE < 0.0 → Worse than mean', color: '#ef233c' },
      ],
    },
    {
      title: 'Nash-Sutcliffe Efficiency (NSE)',
      formula: 'NSE = 1 − Σ(Qo−Qs)² / Σ(Qo−Q̄o)²',
      description: 'Secondary indicator. Standard benchmark in operational hydrology. NSE = 1 is perfect; NSE < 0 means the mean is a better predictor.',
      color: '#06d6a0',
      icon: <TimelineIcon />,
      badges: [
        { label: 'NSE = 1 → Perfect', color: '#06d6a0' },
        { label: 'NSE > 0.5 → Satisfactory', color: '#48cae4' },
        { label: 'NSE < 0 → Poor', color: '#ef233c' },
      ],
    },
    {
      title: 'Pearson Correlation (r)',
      formula: 'r = Cov(Qo, Qs) / (σo × σs)',
      description: 'Measures the linear timing agreement between observed and predicted streamflow. Part of KGE — captures whether peaks and troughs align.',
      color: '#fcbf49',
      icon: <SpeedIcon />,
      badges: [
        { label: 'r = 1 → Perfect timing', color: '#06d6a0' },
        { label: 'r < 0.5 → Poor timing', color: '#ef233c' },
      ],
    },
    {
      title: 'Persistence Baseline',
      formula: 'Q̂(t+1) = Q(t)\n"Tomorrow = Today\'s flow"',
      description: 'The deceptively strong baseline. Rivers change slowly, so predicting today\'s flow as tomorrow\'s achieves KGE = 0.9978. Any useful model must beat this threshold.',
      color: '#f77f00',
      icon: <EqualizerIcon />,
      badges: [
        { label: 'Baseline KGE: 0.9978', color: '#f77f00' },
        { label: 'Baseline NSE: 0.9955', color: '#f77f00' },
      ],
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        bgcolor: 'background.default',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(6,214,160,0.4), transparent)',
        },
      }}
    >
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            label="Evaluation Metrics"
            size="small"
            sx={{
              mb: 2,
              bgcolor: 'rgba(6,214,160,0.12)',
              border: '1px solid #06d6a040',
              color: '#06d6a0',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              fontSize: '0.7rem',
            }}
          />
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Model Performance Metrics
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto' }}>
            Hydrologically-rigorous evaluation designed to catch models that look good on average but fail at flood peaks.
          </Typography>
        </Box>

        {/* Metric cards */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {metrics.map((m) => (
            <Grid size={{ xs: 12, sm: 6 }} key={m.title}>
              <MetricCard {...m} />
            </Grid>
          ))}
        </Grid>

        {/* Baselines table */}
        <Box
          sx={{
            backdropFilter: 'blur(20px)',
            bgcolor: 'rgba(13,27,52,0.65)',
            border: '1px solid rgba(0,180,216,0.15)',
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <EqualizerIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Baselines to Beat
            </Typography>
          </Box>

          {/* Table header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              px: 3,
              py: 1.5,
              mb: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
              Baseline
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, textAlign: 'center' }}>
              KGE
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, textAlign: 'center' }}>
              NSE
            </Typography>
          </Box>

          <BaselineRow name="Naive Median (predict mean)" kge="-0.5338" nse="-0.1092" />
          <BaselineRow name="Persistence (tomorrow = today)" kge="0.9978" nse="0.9955" highlight color="#f77f00" />
          <BaselineRow name="Target: Beat Persistence" kge="> 0.9978" nse="> 0.9955" highlight color={theme.palette.primary.main} />

          <Box
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: 3,
              bgcolor: 'rgba(247,127,0,0.08)',
              border: '1px solid rgba(247,127,0,0.25)',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              <strong style={{ color: '#fcbf49' }}>Note:</strong> The persistence baseline (KGE = 0.9978) is deceptively strong — rivers change slowly overnight. A model scoring below this threshold has learned nothing beyond "rivers don't change." The real competition begins above KGE = 0.9978.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
