/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// ----------------------------------------------------------------------


import useScrollToTop from 'src/hooks/use-scroll-to-top';

import ThemeProvider from 'src/theme';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import { GlobalStyles } from '@mui/material';
import Router from './routes/Router';

// ----------------------------------------------------------------------

export default function App() {

  useScrollToTop();

  return (

    <SettingsProvider
      defaultSettings={{
        themeMode: 'light', // 'light' | 'dark'
        themeDirection: 'ltr', //  'rtl' | 'ltr'
        themeContrast: 'default', // 'default' | 'bold'
        themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
        themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
        themeStretch: false,
      }}
    >
      <GlobalStyles styles={{
        '@keyframes mui-auto-fill': { '100%': { display: 'none' } },
        '@keyframes mui-auto-fill-cancel': { '100%': { display: 'none' } },
      }} />
      <ThemeProvider>

        <MotionLazy>
          <SettingsDrawer />
          <ProgressBar />
          <Router />
        </MotionLazy>
      </ThemeProvider>
    </SettingsProvider>
  );
}
