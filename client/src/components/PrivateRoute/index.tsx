import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import { JSX } from "react";
import { CircularProgress } from "@mui/material";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();


  if (loading) return <CircularProgress/>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
