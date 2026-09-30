import { useState, useCallback } from "react";
import api from "../lib/api.js";
import toast from "react-hot-toast";

export function useAdvisories() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdvisories = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/advisories", { params });
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to load advisories";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAdvisory = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/advisories/${id}`);
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to load advisory details";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAdvisory = useCallback(async (id) => {
    try {
      await api.delete(`/advisories/${id}`);
      toast.success("Advisory deleted successfully");
      return true;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to delete advisory";
      toast.error(msg);
      throw err;
    }
  }, []);

  const generateAdvisory = useCallback(async ({ type, data, file, signal }) => {
    try {
      setLoading(true);
      setError(null);

      let payload = data;
      let headers = {};

      if (type === "disease_diagnosis" && file) {
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (Array.isArray(v)) {
            formData.append(k, JSON.stringify(v));
          } else if (v !== null && v !== undefined) {
            formData.append(k, v);
          }
        });
        formData.append("image", file);
        payload = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      const res = await api.post(`/advisories/${type.replace(/_/g, "-")}`, payload, {
        headers,
        signal,
      });

      toast.success("Advisory generated successfully!");
      return res.data.data;
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        toast("Generation cancelled");
        throw err;
      }
      const msg = err.response?.data?.error?.message || "Failed to generate advisory";
      toast.error(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendFollowUpMessage = useCallback(async (advisoryId, message) => {
    try {
      const res = await api.post(`/advisories/${advisoryId}/messages`, { message });
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to send follow-up message";
      toast.error(msg);
      throw err;
    }
  }, []);

  const submitFeedback = useCallback(async (advisoryId, feedbackData) => {
    try {
      const res = await api.put(`/advisories/${advisoryId}/feedback`, feedbackData);
      toast.success("Thank you for your feedback!");
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to submit feedback";
      toast.error(msg);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    fetchAdvisories,
    getAdvisory,
    deleteAdvisory,
    generateAdvisory,
    sendFollowUpMessage,
    submitFeedback,
  };
}
