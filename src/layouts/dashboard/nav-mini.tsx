import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { hideScroll } from 'src/theme/css';

import { NAV } from 'src/components/config-layout';
import MainLogo from 'src/components/logo/MainLogo';
import { NavSectionMini } from 'src/components/nav-section';

import { useNavData } from './config-navigation';
import NavToggleButton from './nav-toggle-button';

// ----------------------------------------------------------------------

export default function NavMini() {
  const navData = useNavData();

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_MINI,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...hideScroll.x,
        }}
      >
        <MainLogo sx={{ mx: 'auto', my: 2 }} />

        <NavSectionMini
          data={navData}
        />
      </Stack>
    </Box>
  );
}
