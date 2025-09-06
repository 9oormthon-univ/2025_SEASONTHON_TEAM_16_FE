import "../css/KakaoLogin.css";
import logo from "../assets/kakaotalk-seeklogo.png";

export default function KakaoLogin() {
  const REST_API_KEY =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_KAKAO_REST_API_KEY) ||
    process.env.REACT_APP_KAKAO_REST_API_KEY;

  const REDIRECT_URI = window.location.hostname.endsWith("vercel.app")
    ? "https://2025-seasonthon-team-16-fe.vercel.app/oidc-callback"
    : window.location.port === "5173"
    ? "http://localhost:5173/oidc-callback"
    : "http://localhost:3000/oidc-callback";

  // CSRF 방지용 state
  const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
  sessionStorage.setItem("kakao_oauth_state", state);

  // 이메일/프로필 접근용 scope (백엔드에서 필요 시)
  const scope = encodeURIComponent("openid profile account_email");

  const link =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${REST_API_KEY}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&state=${state}` +
    `&scope=${scope}`;

  return (
    <button
      type="button"
      className="kakao-icon-btn"
      onClick={() => (window.location.href = link)}
      style={{ backgroundImage: `url(${logo})` }}
      aria-label="카카오로 로그인"
    />
  );
}
