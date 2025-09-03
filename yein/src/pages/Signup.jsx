import React, { useState, useMemo } from "react";
import "../css/Signup.css";

// 랜덤 문자열 생성
function genRandomString(len = 32) {
  const bytes = new Uint8Array(len);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, b => ("0" + b.toString(16)).slice(-2)).join("");
}

export default function Signup() {
  const [loading, setLoading] = useState(false);

  const REST_API_KEY =
    process.env.REACT_APP_KAKAO_REST_API_KEY ||
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_KAKAO_REST_API_KEY) ||
    "";

  // redirect_uri 자동 계산 (개발/배포 구분)
  const REDIRECT_URI = useMemo(() => {
    const { hostname, port } = window.location;
    if (hostname.endsWith("vercel.app")) {
      return "https://2025-seasonthon-team-16-fe.vercel.app/oidc-callback";
    }
    if (port === "5173") return "http://localhost:5173/oidc-callback";
    return "http://localhost:3000/oidc-callback";
  }, []);

  // 로그인 버튼 클릭 핸들러
  const onKakao = () => {
    if (!REST_API_KEY) {
      alert("Kakao REST API 키 없음");
      return;
    }

    // 1) 클릭 순간 state/nonce 생성 + 저장
    const state = genRandomString(32);
    const nonce = genRandomString(32);
    sessionStorage.setItem("kakao_oauth_state", state);
    sessionStorage.setItem("kakao_oauth_nonce", nonce);

    // 2) 스코프 설정
    const scope = "openid profile_nickname profile_image account_email";

    // 3) authorize URL 구성
    const params = new URLSearchParams({
      client_id: REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      state,
      nonce,
      scope,
    });

    const url = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
    console.log("[Kakao Auth URL]", url);

    setLoading(true);
    window.location.href = url;
  };

  return (
    <div className="signup">
      <div className="card">
        <h1 className="title">회원가입</h1>

        <h2 className="headline">
          필사의 첫걸음을
          <br />
          내딛어 볼까요?
        </h2>

        <p className="sub">로그인이 필요합니다</p>

        <div className="divider">
          <span>간편 로그인</span>
        </div>

        <div className="socials">
          <button
            className="social"
            onClick={onKakao}
            aria-label="카카오로 시작하기"
            disabled={loading || !REST_API_KEY}
          >
            <span className="icon kakao" aria-hidden />
            {loading ? "카카오로 이동 중…" : "카카오톡으로 시작하기"}
          </button>
          {!REST_API_KEY && (
            <small style={{ display: "block", marginTop: 8, color: "#c00" }}>
              환경변수(REACT_APP_KAKAO_REST_API_KEY 또는 VITE_KAKAO_REST_API_KEY)를 설정하세요.
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
