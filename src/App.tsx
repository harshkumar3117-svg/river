import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HeroSection from './components/HeroSection';
import PredictionForm from './components/PredictionForm';
import MetricsInfo from './components/MetricsInfo';
import AboutSection from './components/AboutSection';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HeroSection />
      <PredictionForm />
      <MetricsInfo />
      <AboutSection />
    </ThemeProvider>
  );
}

export default App;
