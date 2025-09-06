// src/config/env.js

export const API_BASE =
  process.env.REACT_APP_API_BASE ??
  (window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://your-prod-api.example.com");

export const REDIRECT_URI = `${window.location.origin}/oidc-callback`;

export const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;

export const KAKAO_CLIENT_SECRET =
  process.env.REACT_APP_KAKAO_CLIENT_SECRET || "";
