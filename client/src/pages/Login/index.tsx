import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Divider } from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import PublicLayout from "../../layouts/PublicLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
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
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button
           fullWidth
           variant="contained"
           sx={{ mt: 3, py: 1.4, fontWeight: 600 }}
           type="submit"
         >
           Sign In
         </Button>
        </Box>
        
        <Box textAlign="center" mt={1}>
          <Link href="signup" underline="hover" color="primary">
            Don't have an account? Sign up
          </Link>
        </Box>
    </PublicLayout>
  );
}
