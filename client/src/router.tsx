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
import { AppLayout } from "./layouts";
import SurveyStatistics from "./pages/Statistics";

export default function App() {
  return (
      <Routes>
         <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={
           <GuestRoute>
              <Login />
          </GuestRoute>
          } />

        <Route path="/signup" element={
           <GuestRoute>
              <SignUp />
          </GuestRoute>
          } />
          
        <Route path="/surveys/:id" element={<PublicSurvey />} />

        <Route element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }>
          <Route path="/surveys/:surveyId/stats" element={<SurveyStatistics />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/surveys/new" element={<SurveyBuilder />} />
          <Route path="/surveys/:id/edit" element={<SurveyEditPage />} />
        </Route>
      </Routes>
  );
}
