import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { JSX } from "react";

export default function GuestGuard({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
