import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
  };

  const handleProfile = () => {
    handleClose();
  };

  if (!user) return null;

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: "white", color: "text.primary" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <img
            src="/src/assets/favicon/favicon.ico"
            alt="VeloForm Logo"
            width={40}
            height={40}
          />
          <Typography variant="h6" fontWeight={700} color="primary">
            VeloForm
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" } }}>
            Bienvenido, {user.name || user.email}
          </Typography>
          
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {getInitials(user.name)}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 3,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
              mt: 1.5,
              minWidth: 200,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {user.name || "Usuario"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
              {user.email}
            </Typography>
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Mi perfil
          </MenuItem>
          
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <ListItemIcon>
              <Logout fontSize="small" color="error" />
            </ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
