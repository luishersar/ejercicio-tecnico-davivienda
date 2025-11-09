import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Paper, Grid } from "@mui/material";
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
      <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
          Login
        </Typography>
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
        <Box textAlign="center" mt={2}>
          <Link href="#" underline="hover" color="primary">
            Forgot your password?
          </Link>
        </Box>
        <Box textAlign="center" mt={1}>
          <Link href="signup" underline="hover" color="primary">
            Don't have an account? Sign up
          </Link>
        </Box>
    </PublicLayout>
  );
}
