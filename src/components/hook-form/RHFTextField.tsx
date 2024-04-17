import { Controller, useFormContext } from 'react-hook-form';

import TextField, { TextFieldProps } from '@mui/material/TextField';

// ----------------------------------------------------------------------

type Props = TextFieldProps & {
  name: string;
};

export default function RHFTextField({ name, helperText, type, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, ...restField }, fieldState: { error } }) => (
        <TextField
          {...restField}
          fullWidth
          type={type}
          defaultValue={value}
          onChange={(event) => {
            if (type === 'number') {
              restField.onChange(Number(event.target.value));
            } else {
              restField.onChange(event.target.value);
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
