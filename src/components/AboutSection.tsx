import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import WaterIcon from '@mui/icons-material/Water';
import WarningIcon from '@mui/icons-material/Warning';
import PeopleIcon from '@mui/icons-material/People';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';
import ScienceIcon from '@mui/icons-material/Science';

type StatProps = { value: string; label: string; color: string; icon: React.ReactNode };

function StatCard({ value, label, color, icon }: StatProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        backdropFilter: 'blur(20px)',
        bgcolor: 'rgba(13,27,52,0.65)',
        border: `1px solid ${color}25`,
        textAlign: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: `1px solid ${color}50`,
          boxShadow: `0 0 30px ${color}15`,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box sx={{ color, mb: 1, display: 'flex', justifyContent: 'center', fontSize: 28 }}>
        {icon}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color, mb: 0.5, lineHeight: 1 }}>
        {value}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
  );
}

type FeatureStepProps = { num: number; title: string; desc: string; color: string };

function FeatureStep({ num, title, desc, color }: FeatureStepProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: `${color}18`,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          fontWeight: 800,
          fontSize: '0.9rem',
          flexShrink: 0,
        }}
      >
        {num}
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          {desc}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AboutSection() {
  const theme = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (sectionRef.current) {
      setSectionTop(sectionRef.current.offsetTop);
    }
  }, []);

  const parallax = (scrollY - sectionTop) * 0.15;

  const stats: StatProps[] = [
    { value: '~1B', label: 'People at Risk', color: '#ef233c', icon: <PeopleIcon fontSize="inherit" /> },
    { value: '5M+', label: 'Hectares Threatened', color: '#f77f00', icon: <AgricultureIcon fontSize="inherit" /> },
    { value: '6H–72H', label: 'Warning Lead Time', color: '#06d6a0', icon: <AccessTimeIcon fontSize="inherit" /> },
    { value: '32', label: 'Input Features', color: theme.palette.primary.main, icon: <ScienceIcon fontSize="inherit" /> },
  ];

  const steps: FeatureStepProps[] = [
    {
      num: 1, color: theme.palette.primary.main,
      title: 'Observe Hydro-Meteorological Conditions',
      desc: 'Collect daily streamflow, rainfall, soil saturation, and upstream signals from gauge stations.',
    },
    {
      num: 2, color: '#06d6a0',
      title: 'Feature Engineering',
      desc: '32 pre-engineered features capture temporal memory, basin geometry, seasonal dynamics, and nonlinear interactions.',
    },
    {
      num: 3, color: '#fcbf49',
      title: 'ML Prediction Engine',
      desc: 'Physics-informed model predicts next-day streamflow (T+1) in m³/s, evaluated by KGE and NSE.',
    },
    {
      num: 4, color: '#ef233c',
      title: 'Flood Risk Classification',
      desc: 'Output is classified into 5 risk tiers from Low Flow to Severe Flood for actionable early warning.',
    },
  ];

  return (
    <Box
      id="about"
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 4 },
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '30%',
          right: '30%',
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(247,127,0,0.4), transparent)`,
        },
      }}
    >
      {/* Parallax background orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0,119,182,0.08) 0%, transparent 70%)`,
          transform: `translateY(${parallax}px)`,
          pointerEvents: 'none',
          transition: 'transform 0.1s linear',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          right: '-5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(239,35,60,0.06) 0%, transparent 70%)`,
          transform: `translateY(${-parallax * 0.7}px)`,
          pointerEvents: 'none',
          transition: 'transform 0.1s linear',
        }}
      />

      <Box sx={{ maxWidth: 1100, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            label="About the Challenge"
            size="small"
            sx={{
              mb: 2,
              bgcolor: 'rgba(247,127,0,0.12)',
              border: '1px solid rgba(247,127,0,0.4)',
              color: '#fcbf49',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              fontSize: '0.7rem',
            }}
          />
          <Typography variant="h2" sx={{ mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Flood Streamflow Prediction Challenge
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 680, mx: 'auto', lineHeight: 1.8 }}>
            In the Ganga-Brahmaputra basin — one of the most flood-prone river networks on Earth — thousands of lives and millions of hectares of farmland are threatened every monsoon season. Traditional rule-based systems struggle with nonlinear, memory-dependent river dynamics. This challenge harnesses machine learning to change that.
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 8 }}>
          {stats.map((s) => (
            <Grid size={{ xs: 6, md: 3 }} key={s.label}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        {/* Two-column: how it works + signals */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                bgcolor: 'rgba(13,27,52,0.65)',
                border: '1px solid rgba(0,180,216,0.15)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <PsychologyIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  How It Works
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {steps.map((s) => (
                  <FeatureStep key={s.num} {...s} />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                backdropFilter: 'blur(20px)',
                bgcolor: 'rgba(13,27,52,0.65)',
                border: '1px solid rgba(0,180,216,0.15)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <WarningIcon sx={{ color: '#f77f00' }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Signal Categories
                </Typography>
              </Box>
              {[
                { label: 'Streamflow Signals', count: 4, color: '#06d6a0', desc: 'Today\'s flow, anomaly z-score, rate of change, velocity' },
                { label: 'Rainfall Signals', count: 7, color: theme.palette.primary.main, desc: '3d, 7d, 15d, 30d, 60d sums + EWM + anomaly' },
                { label: 'Upstream Signals', count: 3, color: '#48cae4', desc: 'Mean, weighted, lagged travel-time contributions' },
                { label: 'Soil & Saturation', count: 3, color: '#fcbf49', desc: 'Saturation score, interaction, post-monsoon flag' },
                { label: 'Seasonal Signals', count: 2, color: '#f77f00', desc: 'Monsoon intensity and cumulative rainfall' },
                { label: 'Basin Properties', count: 6, color: '#ef233c', desc: 'Area, slope, forest/urban cover, outlet distance' },
                { label: 'Interaction Features', count: 5, color: '#90caf9', desc: 'Cross-product nonlinear rainfall × basin terms' },
              ].map((cat) => (
                <Box
                  key={cat.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    py: 1.5,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      bgcolor: `${cat.color}18`,
                      border: `1px solid ${cat.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cat.color,
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      flexShrink: 0,
                    }}
                  >
                    {cat.count}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: cat.color, lineHeight: 1.2 }}>
                      {cat.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {cat.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            backdropFilter: 'blur(20px)',
            bgcolor: 'rgba(13,27,52,0.65)',
            border: '1px solid rgba(0,180,216,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 200 }}>
            <PublicIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Ganga-Brahmaputra Basin
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                India — Single river basin, monsoon-driven hydrology
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {[
              { label: 'T+1 Prediction', color: theme.palette.primary.main },
              { label: 'KGE Primary Metric', color: '#06d6a0' },
              { label: 'Daily Resolution', color: '#fcbf49' },
              { label: '32 Features', color: '#90caf9' },
            ].map((b) => (
              <Chip
                key={b.label}
                label={b.label}
                size="small"
                sx={{
                  bgcolor: `${b.color}15`,
                  border: `1px solid ${b.color}40`,
                  color: b.color,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Footer branding */}
        <Box sx={{ textAlign: 'center', mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <WaterIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Flood Streamflow Prediction Challenge
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Ganga-Brahmaputra Basin · ML for Hydrology · KGE / NSE Evaluation
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
