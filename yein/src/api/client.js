// src/api/client.js
import axios from "axios";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  process.env.REACT_APP_API_BASE ||
  "https://yein.duckdns.org";

export const api = axios.create({
  baseURL: API_BASE.replace(/\/$/, ""),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // ✅ 한 키로 통일
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// src/api/client.js (위 파일에 이어서)
let notified = false;

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || "";
    if (status === 401 && !notified) {
      notified = true;
      // 일단 콘솔로 최초 401 발생 지점을 확인
      console.error("[AUTH 401]", url, err?.response?.data);
      // 여기서 바로 redirect하지 말고, 화면에서 제어하도록 둡니다.
      // window.location.replace("/login?error=unauthorized");
    }
    return Promise.reject(err);
  }
);
