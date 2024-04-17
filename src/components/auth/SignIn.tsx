import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Stack, IconButton, Typography, InputAdornment } from '@mui/material';

import Iconify from '../iconify/iconify';
import { RHFTextField } from '../hook-form';
import FormProvider from '../hook-form/FormProvider';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false)
    const ForgotPasswordSchema = Yup.object().shape({
        email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    });

    const defaultValues = {
        email: '',
        password: ""
    };

    const methods = useForm({
        resolver: yupResolver(ForgotPasswordSchema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.info('DATA', data);
        } catch (error) {
            console.error(error);
        }
    });

    console.log(methods.getValues());

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
                    color="inherit"
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                    sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
                >
                    Login
                </LoadingButton>
            </Stack>
        </FormProvider>
    )

}

export default SignIn