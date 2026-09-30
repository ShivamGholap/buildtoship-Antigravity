import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./components/layout/ProtectedRoute.jsx";
import { PublicOnlyRoute } from "./components/layout/PublicOnlyRoute.jsx";
import { OnboardingGate } from "./components/layout/OnboardingGate.jsx";
import { AppLayout } from "./components/layout/AppLayout.jsx";
import { PublicLayout } from "./components/layout/PublicLayout.jsx";

// Pages
import { Landing } from "./pages/Landing.jsx";
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";
import { ForgotPassword } from "./pages/ForgotPassword.jsx";
import { ResetPassword } from "./pages/ResetPassword.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Farms } from "./pages/Farms.jsx";
import { FarmEditor } from "./pages/FarmEditor.jsx";
import { AdvisoryNew } from "./pages/AdvisoryNew.jsx";
import { AdvisoryForm } from "./pages/AdvisoryForm.jsx";
import { AdvisoryHistory } from "./pages/AdvisoryHistory.jsx";
import { AdvisoryDetail } from "./pages/AdvisoryDetail.jsx";
import { Profile } from "./pages/Profile.jsx";
import { NotFound } from "./pages/NotFound.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1c1917",
              color: "#fafaf9",
              fontSize: "14px",
              borderRadius: "10px",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <Signup />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPassword />
                </PublicOnlyRoute>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          {/* Protected authenticated routes with AppLayout and OnboardingGate */}
          <Route
            element={
              <ProtectedRoute>
                <OnboardingGate>
                  <AppLayout />
                </OnboardingGate>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/farms/new" element={<FarmEditor />} />
            <Route path="/farms/:farmId/edit" element={<FarmEditor />} />

            <Route path="/advisory/new" element={<AdvisoryNew />} />
            <Route path="/advisory/crop-recommendation" element={<AdvisoryForm />} />
            <Route path="/advisory/disease-diagnosis" element={<AdvisoryForm />} />
            <Route path="/advisory/fertilizer-plan" element={<AdvisoryForm />} />
            <Route path="/advisory/irrigation-plan" element={<AdvisoryForm />} />
            <Route path="/advisory/seasonal-calendar" element={<AdvisoryForm />} />

            <Route path="/advisories" element={<AdvisoryHistory />} />
            <Route path="/advisories/:id" element={<AdvisoryDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
