import React, { useState } from 'react'
import PublicLayout from '../../layouts/PublicLayout'
import { Box, Button, Link, TextField, Typography } from '@mui/material'
import { signUp } from '../../http/auth';
import toast from 'react-hot-toast';
 
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading,setIsLoading] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      await signUp({email, password, name});
      toast.success("User created successfully");
      setIsLoading(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error en login");
      setIsLoading(false)
    }
  };
  return (
   <PublicLayout>
     <Typography variant="h4" fontWeight={700} textAlign="center" mb={3}>
            SignUp
     </Typography>
     <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
 
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
 
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              disabled={isLoading}
            />
 
            <Button
             fullWidth
             variant="contained"
             sx={{ mt: 3, py: 1.4, fontWeight: 600 }}
             type="submit"
              disabled={isLoading}
           >
             Sign In
           </Button>
          </Box>
 
          <Box textAlign="center" mt={2}>
            <Link href="login" underline="hover" color="primary">
              Already an user? Login
            </Link>
          </Box>
   </PublicLayout>
  )
}
 
export default SignUp