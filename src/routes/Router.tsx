import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import UsersList from 'src/pages/UsersList';
import AuthGuard from 'src/guards/AuthGuard';
import GuestGuard from 'src/guards/GuestGuard';
import GuestLayout from 'src/layouts/GuestLayout';
import PropertyAssessments from 'src/pages/PropertyAssessments';
import AuthedLayout from 'src/layouts/authed-layout/AuthedLayout';
import PropertiesSearchList from 'src/pages/PropertiesSearchList';

import SplashLoading from 'src/components/loading/SplashLoading';


const SignIn = lazy(() => import('src/components/auth/SignIn'));


export default function Router({ getUser, getUserLoading }: { getUser: () => void, getUserLoading: boolean }) {
    return useRoutes([
        {
            path: '/',
            element: <Suspense fallback={<SplashLoading />}>
                {/* <Navigate to="users" replace /> */}
                <AuthGuard getUserLoading={getUserLoading}>
                    <AuthedLayout>
                        <Outlet />
                    </AuthedLayout>
                </AuthGuard>
            </Suspense>,
            children: [
                {
                    path: 'users',
                    element: <UsersList />,
                },
                {
                    path: 'properties-search',
                    element: <PropertiesSearchList />,
                },
                {
                    path: 'properties-assessments',
                    element: <PropertyAssessments />,
                },
            ]
        },
        {
            path: 'auth',
            element: <Suspense fallback={<SplashLoading />}>
                <Navigate to="sign-in" replace />
                <GuestGuard getUserLoading={getUserLoading}>
                    <GuestLayout>
                        <Outlet />
                    </GuestLayout>
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