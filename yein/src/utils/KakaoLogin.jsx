import '../css/KakaoLogin.css';
import logo from '../assets/kakaotalk-seeklogo.png';
import React from "react";

export default function KakaoLogin() {
  const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const REDIRECT_URI =
    window.location.hostname.endsWith("vercel.app")
      ? "https://2025-seasonthon-team-16-fe.vercel.app/oidc-callback"
      : (window.location.port === "5173"
          ? "http://localhost:5173/oidc-callback"
          : "http://localhost:3000/oidc-callback");
  const link = `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code`;
    return (
        <button type="button" className="kakao-icon-btn" onClick={() => (window.location.href = link)} style={{backgroundImage: `url(${logo})`}}/>
    );
};
