import { useState } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useAppDispatch, useAppSelector } from 'src/lib/hooks';
import authApi, { selectAuthedUser } from 'src/lib/features/apis/authApi';

import CustomPopover from 'src/components/custom-popover/custom-popover';


export default function AccountPopover() {
  const authedUser = useAppSelector(selectAuthedUser)
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState<HTMLElement | null>(null)


  const handleLogout = async () => {
    dispatch(authApi.util.resetApiState())
    localStorage.removeItem('token')
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        onClick={(e) => setOpen(e.currentTarget)}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          // src={user?.photoURL}
          // alt={user?.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {authedUser?.name[0]}
        </Avatar>
      </IconButton>

      <CustomPopover open={open} onClose={() => setOpen(null)} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {authedUser?.name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {authedUser?.role}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Stack sx={{ p: 1 }}>
          <MenuItem>
            label
          </MenuItem>
        </Stack> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
