import { useState, useEffect } from "react";
import api from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

let cachedOptions = null;

export function useMeta() {
  const { user } = useAuth();
  const [options, setOptions] = useState(cachedOptions);
  const [loading, setLoading] = useState(!cachedOptions);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedOptions || !user) {
      if (cachedOptions) setLoading(false);
      return;
    }

    let isMounted = true;
    api
      .get("/meta/options")
      .then((res) => {
        if (isMounted) {
          cachedOptions = res.data.data;
          setOptions(res.data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.error?.message || "Failed to load meta options");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { options, loading, error };
}
