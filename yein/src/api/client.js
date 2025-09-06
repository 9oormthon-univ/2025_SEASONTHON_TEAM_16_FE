import axios from "axios";
import { API_BASE } from "../config/env";

export const api = axios.create({
  baseURL: API_BASE.replace(/\/$/, ""),
  withCredentials: false, // 토큰 방식이므로 쿠키 미사용
});

// 요청 인터셉터: 토큰 자동 부착
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // 서버가 준 accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
