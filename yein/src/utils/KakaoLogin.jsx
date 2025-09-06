import "../css/KakaoLogin.css";
import logo from "../assets/kakaotalk-seeklogo.png";

export default function KakaoLogin() {
  const REST_API_KEY =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_KAKAO_REST_API_KEY) ||
    process.env.REACT_APP_KAKAO_REST_API_KEY;

  // 현재 오리진으로 고정 (시작/교환 모두 동일 값 사용)
  const REDIRECT_URI = `${window.location.origin}/oidc-callback`;

  // CSRF 방지용 state
  const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
  sessionStorage.setItem("kakao_oauth_state", state);

  // 요청 스코프(백엔드 필요 시)
  const scope = encodeURIComponent("openid profile account_email");

  const link =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${encodeURIComponent(REST_API_KEY)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&state=${encodeURIComponent(state)}` +
    `&scope=${scope}`;

  const handleClick = () => {
    if (!REST_API_KEY) {
      alert("Kakao REST API Key가 설정되지 않았습니다.");
      return;
    }
    window.location.href = link;
  };

  return (
    <button
      type="button"
      className="kakao-icon-btn"
      onClick={handleClick}
      style={{ backgroundImage: `url(${logo})` }}
      aria-label="카카오로 로그인"
      title="카카오로 로그인"
    />
  );
}
