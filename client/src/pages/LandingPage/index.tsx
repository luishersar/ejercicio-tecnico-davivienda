import { Box, Typography, Button, Grid, Paper, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LandingPage() {
  const { user, loading } = useAuth();

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
      }}
    >
      <Grid
        size={{ xs: 12, sm: 10, md: 6 }}
        sx={{
          margin: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'} gap={'10px'} mb={2}>
            <img src="/src/assets/favicon/favicon.ico" alt="VeloForm Logo" width={50} height={50} />
             <Divider  orientation="vertical" variant="middle" flexItem/>
            <Typography variant="h3" fontWeight={700} mb={2}>
              Bienvenido a VeloForm
            </Typography>
          </Box>
          <Typography variant="body1" mb={4}>
            Crea encuestas inteligentes y personalizadas en segundos. Con VeloForm, tus ideas llegan a tus usuarios más rápido que nunca.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {!loading && !user && (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                sx={{ px: 4, py: 1.5 }}
              >
                Iniciar Sesión
              </Button>
            )}

            <Button
              component={RouterLink}
              to="/dashboard"
              variant="outlined"
              color="primary"
              sx={{ px: 4, py: 1.5 }}
            >
              Ir al Dashboard
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}