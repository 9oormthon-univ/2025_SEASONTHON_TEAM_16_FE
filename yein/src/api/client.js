// client.js
import axios from "axios";
import { API_BASE } from "../config/env";

export const api = axios.create({
  baseURL: API_BASE.replace(/\/$/, ""),
  withCredentials: false,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터 (refresh)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken || !accessToken) throw new Error("저장된 토큰 없음");

        // 🚨 여기서는 /auth/reissue (앞에 /api 붙이지 않음)
        const refreshRes = await axios.post(
          `${API_BASE}/auth/reissue`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              RefreshToken: refreshToken,
            },
          }
        );

        const newAccessToken = refreshRes.data.data.accessToken;
        const newRefreshToken = refreshRes.data.data.refreshToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("🔴 토큰 재발급 실패:", err);
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
