import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile.js";
import { Spinner } from "../ui/Spinner.jsx";

export function OnboardingGate({ children }) {
  const { profile, loading } = useProfile();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" message="Loading profile..." />
      </div>
    );
  }

  // If user profile is not marked onboarded and not currently on /profile, redirect to /profile
  if (profile && !profile.onboarded && location.pathname !== "/profile") {
    return <Navigate to="/profile?onboarding=true" replace />;
  }

  return children;
}
