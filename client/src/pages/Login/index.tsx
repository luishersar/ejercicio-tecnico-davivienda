import { useState } from "react";
import { Box, TextField, Button, Typography, Link, Divider, InputAdornment, IconButton } from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import PublicLayout from "../../layouts/PublicLayout";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";  
import { FormDataLogIn, validationSchemaLogIn } from "../../schemas/login.schema";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = 
    useForm<{ email: string; password: string }>({
    resolver: yupResolver(validationSchemaLogIn),
  });

  const onSubmit = async (data: FormDataLogIn) => {
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error en login");
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
            Login
          </Typography>
      </Box>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
          />
          <TextField
            label="Password"
            fullWidth
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
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
         >
           Inicia Sesion
         </Button>
        </Box>
        
        <Box textAlign="center" mt={1}>
          <Link href="signup" underline="hover" color="primary">
            ¿Necesitas gestionar tus formularios? Registrate
          </Link>
        </Box>

        <Box textAlign="center" mt={1}>
          <Link href="/" underline="hover" color="primary">
            Ya tengo un codigo de encuesta
          </Link>
        </Box>
    </PublicLayout>
  );
}