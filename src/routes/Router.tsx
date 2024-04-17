import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import AuthGuard from 'src/guards/AuthGuard';
import GuestGuard from 'src/guards/GuestGuard';
import AuthLayout from 'src/layouts/AuthLayout';

import SplashLoading from 'src/components/loading/SplashLoading';


const SignIn = lazy(() => import('src/components/auth/SignIn'));


export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <Suspense fallback={<SplashLoading />}>
                <Navigate to="dashboard" replace />
                <AuthGuard>
                    <Outlet />
                </AuthGuard>
            </Suspense>,
        },
        {
            path: 'dashboard',
            element: <p>qwdqwd</p>,
        },
        {
            path: 'auth',
            element: <Suspense fallback={<SplashLoading />}>
                <Navigate to="sign-in" replace />
                <GuestGuard>
                    <AuthLayout>
                        <Outlet />
                    </AuthLayout>
                </GuestGuard>
            </Suspense>,
            children: [
                {
                    path: 'sign-in',
                    element: <SignIn />
                },
                {
                    path: '*',
                    element: <Navigate to="sign-in" replace />
                }
            ]
        },

        // No match 404
        { path: '*', element: <Navigate to="/404" replace /> },
    ]);
}