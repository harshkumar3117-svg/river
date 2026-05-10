import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import WaterIcon from '@mui/icons-material/Water';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ScienceIcon from '@mui/icons-material/Science';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const STATS = [
  { icon: <WaterIcon />, label: 'River Basin', value: 'Ganga-Brahmaputra' },
  { icon: <TrendingUpIcon />, label: 'Prediction Horizon', value: 'T+1 Day' },
  { icon: <ScienceIcon />, label: 'Metric', value: 'KGE / NSE' },
];

export default function HeroSection() {
  const theme = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.4;

  return (
    <Box
      ref={heroRef}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Parallax background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${parallaxOffset}px)`,
          backgroundImage: 'url(/flood-hero.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35) saturate(1.2)',
          willChange: 'transform',
          top: '-20%',
          height: '140%',
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(
            180deg,
            rgba(2,9,23,0.3) 0%,
            rgba(2,9,23,0.1) 40%,
            rgba(2,9,23,0.6) 75%,
            rgba(2,9,23,1) 100%
          )`,
        }}
      />

      {/* Animated water ripple SVG */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
          opacity: 0.3,
          overflow: 'hidden',
        }}
      >
        <svg viewBox="0 0 1440 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity="0.8" />
              <stop offset="100%" stopColor={theme.palette.primary.dark} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,160 L0,160 Z" fill="url(#waveGrad)">
            <animate attributeName="d" dur="6s" repeatCount="indefinite"
              values="
                M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,160 L0,160 Z;
                M0,40 C240,80 480,120 720,60 C960,0 1200,100 1440,50 L1440,160 L0,160 Z;
                M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,160 L0,160 Z
              "
            />
          </path>
        </svg>
      </Box>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 4 + (i % 3) * 3,
            height: 4 + (i % 3) * 3,
            borderRadius: '50%',
            bgcolor: i % 2 === 0 ? 'primary.main' : 'secondary.main',
            opacity: 0.4,
            left: `${10 + i * 11}%`,
            top: `${20 + (i % 4) * 15}%`,
            animation: `float${i % 3} ${3 + i * 0.7}s ease-in-out infinite`,
            '@keyframes float0': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-20px)' },
            },
            '@keyframes float1': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-14px)' },
            },
            '@keyframes float2': {
              '0%, 100%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-24px)' },
            },
          }}
        />
      ))}

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          px: { xs: 3, md: 6 },
          maxWidth: 900,
        }}
      >
        <Chip
          label="Ganga-Brahmaputra Basin System"
          size="small"
          sx={{
            mb: 3,
            bgcolor: 'rgba(0,180,216,0.15)',
            border: '1px solid',
            borderColor: 'primary.main',
            color: 'primary.light',
            backdropFilter: 'blur(8px)',
            fontWeight: 600,
            letterSpacing: 1,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            fontWeight: 800,
            lineHeight: 1.1,
            mb: 2,
            background: `linear-gradient(135deg, #e8f4fd 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Flood Streamflow
          <br />
          Prediction
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            mb: 5,
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: 620,
            mx: 'auto',
            fontSize: { xs: '1rem', md: '1.2rem' },
          }}
        >
          Rivers don't flood without warning — they whisper first. Feed hydro-meteorological features and get next-day streamflow predictions in m³/s.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 7 }}>
          <Button
            variant="contained"
            size="large"
            href="#predict"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: `0 0 30px rgba(0,180,216,0.4)`,
              '&:hover': {
                boxShadow: `0 0 50px rgba(0,180,216,0.6)`,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Start Predicting
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="#about"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              borderColor: 'primary.main',
              color: 'primary.light',
              backdropFilter: 'blur(8px)',
              bgcolor: 'rgba(0,180,216,0.05)',
              '&:hover': {
                bgcolor: 'rgba(0,180,216,0.12)',
                borderColor: 'primary.light',
              },
            }}
          >
            Learn More
          </Button>
        </Box>

        {/* Stats row */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2, md: 4 },
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {STATS.map((stat) => (
            <Box
              key={stat.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2.5,
                py: 1.5,
                borderRadius: 3,
                bgcolor: 'rgba(13,27,52,0.6)',
                border: '1px solid rgba(0,180,216,0.2)',
                backdropFilter: 'blur(16px)',
                color: 'text.secondary',
              }}
            >
              <Box sx={{ color: 'primary.main', display: 'flex' }}>{stat.icon}</Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>
                  {stat.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          animation: 'bounce 2s ease-in-out infinite',
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
            '50%': { transform: 'translateX(-50%) translateY(8px)' },
          },
        }}
      >
        <KeyboardArrowDownIcon sx={{ color: 'primary.main', fontSize: 32 }} />
      </Box>
    </Box>
  );
}
