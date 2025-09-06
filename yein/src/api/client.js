// src/api/client.js
import axios from "axios";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "https://yein.duckdns.org";

export const api = axios.create({
  baseURL: API_BASE.replace(/\/$/, ""),
  timeout: 15000,
});

// ────────────────────────────────
// 토큰 헬퍼
export function setAccessToken(token) {
  if (token) localStorage.setItem("access_token", token);
}
export function getAccessToken() {
  return localStorage.getItem("access_token") || "";
}
export function clearAccessToken() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token"); // 혹시 남아 있으면 정리
}

// ────────────────────────────────
// 요청 인터셉터: 무조건 access_token 붙이기
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.Accept = config.headers.Accept || "application/json";
  }
  return config;
});

// ────────────────────────────────
// 응답 인터셉터: 인증 에러 로깅
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || "";
    const data = err?.response?.data;

    if (status === 401) {
      console.error("[AUTH 401 Unauthorized]", url, data);
    }
    if (status === 403) {
      console.error("[AUTH 403 Forbidden]", url, data);
    }

    return Promise.reject(err);
  }
);
