// src/config/env.js
export const API_BASE =
  process.env.REACT_APP_API_BASE ??
  (window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://your-prod-api.example.com');

export const REDIRECT_URI = `${window.location.origin}/oidc-callback`;
