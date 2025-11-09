import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/index";
import Dashboard from "./pages/Dashboard/index";
import { PrivateRoute } from "./components/PrivateRoute";
import { GuestRoute } from "./context/GuestRoute";
import PublicSurvey from "./pages/PublicSurvey";
import SurveyEditPage from "./pages/SurveyEditPage";

export default function App() {
  return (
      <Routes>
        <Route path="/login" element={
           <GuestRoute>
              <Login />
          </GuestRoute>
          } />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/surveys/:id"
          element={
              <PublicSurvey  />
          }
        />

        <Route
          path="/surveys/:id/edit"
          element={
            <PrivateRoute>
              <SurveyEditPage />
            </PrivateRoute>
          }
        />
      </Routes>
  );
}
