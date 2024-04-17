import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Stack, IconButton, Typography, InputAdornment } from '@mui/material';

import { ISignIn } from 'src/@types/auth';
import { signInSchema } from 'src/validations/auth-validations';
import { useSignInMutation } from 'src/lib/features/apis/authApi';

import Iconify from '../iconify/iconify';
import { RHFTextField } from '../hook-form';
import FormProvider from '../hook-form/FormProvider';

const SignIn = ({ getUser, getUserLoading }: { getUser: () => void, getUserLoading: boolean }) => {
    const [signIn] = useSignInMutation()
    const [showPassword, setShowPassword] = useState(false)

    const methods = useForm<ISignIn>({
        resolver: yupResolver(signInSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await signIn(data).unwrap()
            localStorage.setItem('token', res.data.access_token)
            getUser()
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Stack spacing={2} sx={{ mb: 5 }}>
                <Typography variant="h4">Sign in to ParcelMarket</Typography>
            </Stack>
            <Stack spacing={2.5}>
                <RHFTextField name="email" label="Email address" />
                <RHFTextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting || getUserLoading}
                >
                    Login
                </LoadingButton>
            </Stack>
        </FormProvider>
    )

}

export default SignIn