import { useState, useEffect, useCallback } from "react";
import api from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export function useFarms() {
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarms = useCallback(async () => {
    if (!user) {
      setFarms([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/farms");
      setFarms(res.data.data || []);
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to load farms";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  const createFarm = async (farmData) => {
    try {
      const res = await api.post("/farms", farmData);
      setFarms((prev) => [res.data.data, ...prev]);
      toast.success("Farm added successfully!");
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to create farm";
      toast.error(msg);
      throw err;
    }
  };

  const updateFarm = async (id, farmData) => {
    try {
      const res = await api.put(`/farms/${id}`, farmData);
      setFarms((prev) => prev.map((f) => (f.id === id ? res.data.data : f)));
      toast.success("Farm updated successfully!");
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to update farm";
      toast.error(msg);
      throw err;
    }
  };

  const deleteFarm = async (id) => {
    try {
      await api.delete(`/farms/${id}`);
      setFarms((prev) => prev.filter((f) => f.id !== id));
      toast.success("Farm deleted successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to delete farm";
      toast.error(msg);
      throw err;
    }
  };

  const getFarm = async (id) => {
    try {
      const res = await api.get(`/farms/${id}`);
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to retrieve farm";
      toast.error(msg);
      throw err;
    }
  };

  return {
    farms,
    loading,
    error,
    refreshFarms: fetchFarms,
    createFarm,
    updateFarm,
    deleteFarm,
    getFarm,
  };
}
