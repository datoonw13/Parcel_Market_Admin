import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import AuthGuard from 'src/guards/AuthGuard';
import GuestGuard from 'src/guards/GuestGuard';
import AuthLayout from 'src/layouts/AuthLayout';

import SplashLoading from 'src/components/loading/SplashLoading';


const SignIn = lazy(() => import('src/components/auth/SignIn'));


export default function Router({ getUser, getUserLoading }: { getUser: () => void, getUserLoading: boolean }) {
    return useRoutes([
        {
            path: '/',
            element: <Suspense fallback={<SplashLoading />}>
                <Navigate to="dashboard" replace />
                <AuthGuard getUserLoading={getUserLoading}>
                    <Outlet />
                </AuthGuard>
            </Suspense>,
            children: [
                {
                    path: 'dashboard',
                    element: <p>qwdqwd</p>,
                },
            ]
        },

        {
            path: 'auth',
            element: <Suspense fallback={<SplashLoading />}>
                <Navigate to="sign-in" replace />
                <GuestGuard getUserLoading={getUserLoading}>
                    <AuthLayout>
                        <Outlet />
                    </AuthLayout>
                </GuestGuard>
            </Suspense>,
            children: [
                {
                    path: 'sign-in',
                    element: <SignIn getUser={getUser} getUserLoading={getUserLoading} />
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