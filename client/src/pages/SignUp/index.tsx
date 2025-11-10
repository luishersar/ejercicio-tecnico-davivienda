import { useState } from 'react'
import PublicLayout from '../../layouts/PublicLayout'
import { Box, Button, Divider, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material'
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormDataSignUp, validationSchemaSignUp } from '../../schemas/signup.schema';
 
const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp } = useAuth();

  const { register, handleSubmit, formState: { errors } } = 
    useForm<{ email: string; password: string, name: string }>({
    resolver: yupResolver(validationSchemaSignUp),
  });

  const onSubmit = async (data: FormDataSignUp) => {
    try {
      setIsLoading(true);
      await signUp(data.email, data.password, data.name);
      toast.success("User created successfully");
      setIsLoading(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error en registro");
      setIsLoading(false);
    }
  };

  return (
   <PublicLayout>
     <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'} gap={'10px'}>
        <img src="/src/assets/favicon/favicon.ico" alt="VeloForm Logo" width={50} height={50} />
        <Typography variant="h4" fontWeight={700} textAlign="center" >
            VeloForm
          </Typography>
          <Divider  orientation="vertical" variant="middle" flexItem/>
        <Typography variant="h4" fontWeight={200} textAlign="center" >
            SignUp
          </Typography>
      </Box>
     <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
              disabled={isLoading}
            />
 
            <TextField
              label="Email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
              disabled={isLoading}
            />
 
            <TextField
              label="Password"
              fullWidth
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              margin="normal"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
 
            <Button
             fullWidth
             variant="contained"
             sx={{ mt: 3, py: 1.4, fontWeight: 600 }}
             type="submit"
             disabled={isLoading}
           >
             Sign Up
           </Button>
          </Box>
 
          <Box textAlign="center" mt={2}>
            <Link href="login" underline="hover" color="primary">
              ¿Ya tienes un usuario? Inicia Sesión
            </Link>
          </Box>
   </PublicLayout>
  )
}
 
export default SignUp