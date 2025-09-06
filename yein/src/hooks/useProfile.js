import { useEffect, useState } from "react";
import { api } from "../api/client";
import { API_BASE } from "../config/env";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { setLoading(false); return; }

    api.get(`${API_BASE.replace(/\/$/, "")}/auth/me`)
      .then((res) => setProfile(res?.data?.data ?? null))
      .catch((e) => setErr(e))
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading, err };
}
