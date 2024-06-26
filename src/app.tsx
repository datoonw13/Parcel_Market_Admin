/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// ----------------------------------------------------------------------


import useScrollToTop from 'src/hooks/use-scroll-to-top';

import ThemeProvider from 'src/theme';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';
import { SnackbarProvider } from 'notistack';
import Router from './routes/Router';
import SplashLoading from './components/loading/SplashLoading';
import useAuthCheck from './hooks/useAuthCheck';
import { SnackbarUtilsConfigurator } from './utils/snackbar';
// ----------------------------------------------------------------------

export default function App() {
  const { loading, getUser, getUserLoading } = useAuthCheck()

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
      <ThemeProvider>
        <MotionLazy>
          <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
            <SnackbarUtilsConfigurator />
            <SettingsDrawer />
            <ProgressBar />
            {loading && <SplashLoading />}
            <Router getUser={getUser} getUserLoading={getUserLoading || loading} />
          </SnackbarProvider>

        </MotionLazy>
      </ThemeProvider>
    </SettingsProvider>
  );
}
