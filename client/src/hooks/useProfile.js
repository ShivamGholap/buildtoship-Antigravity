import { useState, useEffect, useCallback } from "react";
import api from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/profile");
      setProfile(res.data.data);
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to load profile";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put("/profile", profileData);
      setProfile(res.data.data);
      toast.success("Profile updated successfully");
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to update profile";
      toast.error(msg);
      throw err;
    }
  };

  const deleteUserData = async () => {
    try {
      await api.delete("/profile/data");
      toast.success("All personal farm and advisory data deleted");
      return true;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to delete user data";
      toast.error(msg);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    refreshProfile: fetchProfile,
    updateProfile,
    deleteUserData,
  };
}
