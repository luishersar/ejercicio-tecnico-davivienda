import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Outlet, Link, useNavigate } from "react-router-dom";

export function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}
          >
            FormForge
          </Typography>

          <Stack direction="row" spacing={3} alignItems="center">
            <Button component={Link} to="/dashboard" color="inherit">
              Dashboard
            </Button>
            <Button component={Link} to="/surveys" color="inherit">
              Mis Encuestas
            </Button>
            <Button component={Link} to="/templates" color="inherit">
              Templates
            </Button>
            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <main>
        <Outlet />
      </main>
    </>
  );
}
