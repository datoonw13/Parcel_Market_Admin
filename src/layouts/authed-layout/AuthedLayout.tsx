import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

import Box from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSettingsContext } from 'src/components/settings';

import Main from './main';
import Header from './header';
import NavMini from './nav-mini';
import NavVertical from './nav-vertical';
import NavHorizontal from './nav-horizontal';
import { useNavData } from './config-navigation';

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
    const settings = useSettingsContext();
    const [open, setOpen] = useState(false)
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const navData = useNavData()

    const lgUp = useResponsive('up', 'lg');


    const isHorizontal = settings.themeLayout === 'horizontal';

    const isMini = settings.themeLayout === 'mini';

    const renderNavMini = <NavMini />;

    const renderHorizontal = <NavHorizontal />;

    const renderNavVertical = <NavVertical openNav={open} onCloseNav={() => setOpen(false)} />;

    useEffect(() => {
        if (pathname === '/') {
            navigate(navData[0].items[0].path)
        }
    }, [navData, navigate, pathname])

    if (isHorizontal) {
        return (
            <>
                <Header onOpenNav={() => setOpen(true)} />

                {lgUp ? renderHorizontal : renderNavVertical}
                    
                <Main>{children}</Main>
            </>
        );
    }

    if (isMini) {
        return (
            <>
                <Header onOpenNav={() => setOpen(true)} />

                <Box
                    sx={{
                        minHeight: 1,
                        display: 'flex',
                        flexDirection: { xs: 'column', lg: 'row' },
                    }}
                >
                    {lgUp ? renderNavMini : renderNavVertical}

                    <Main>{children}</Main>
                </Box>
            </>
        );
    }



    return (
        <>
            <Header onOpenNav={() => setOpen(true)} />
            <Box
                sx={{
                    minHeight: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                }}
            >
                {renderNavVertical}
                    
                <Main>{children}</Main>
            </Box>
        </>
    );
}
