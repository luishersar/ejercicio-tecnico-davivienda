import { ReactNode, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { CircularProgress } from "@mui/material";

export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <CircularProgress/>;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
