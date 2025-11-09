import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/index";
import Dashboard from "./pages/Dashboard/index";
import { PrivateRoute } from "./components/PrivateRoute";
import { GuestRoute } from "./context/GuestRoute";
import PublicSurvey from "./pages/PublicSurvey";
import SurveyEditPage from "./pages/SurveyEditPage";
import LandingPage from "./pages/LandingPage";
import SurveyBuilder from "./pages/SurveyBuilder";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
      <Routes>

         <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={
           <GuestRoute>
              <Login />
          </GuestRoute>
          } />


        <Route
          path="/surveys/new"
          element={
            <PrivateRoute>
              <SurveyBuilder/>
            </PrivateRoute>
          }
        />

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

        <Route path="/signup" element={
           <GuestRoute>
              <SignUp />
          </GuestRoute>
          } />

      </Routes>
  );
}
