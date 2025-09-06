// src/modules/Redirection.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchKakaoIdToken } from "../api/kakao";
import { API_BASE } from "../config/env";
import LoaderShapes from "../components/common/Loader"; 

export default function Redirection() {
  const nav = useNavigate();
  const once = useRef(false);
  const [msg, setMsg] = useState("로그인 처리 중…");
  

  const cleanup = () => {
    const clean = window.location.origin + window.location.pathname;
    window.history.replaceState(null, "", clean);
    ["kakao_oauth_state","oidc_state_kakao","oidc_nonce_kakao","oidc_verifier_kakao","oidc_provider"]
      .forEach((k) => sessionStorage.removeItem(k));
  };

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const redirectUri = `${window.location.origin}/oidc-callback`;

        if (!code) throw new Error("인가 코드 없음");

        const saved =
          sessionStorage.getItem("kakao_oauth_state") ||
          sessionStorage.getItem("oidc_state_kakao");
        if (saved && state && saved !== state) throw new Error("state 불일치");

        setMsg("카카오 토큰 교환 중…");
        const idToken = await fetchKakaoIdToken(code, redirectUri);

        setMsg("서버 로그인 중…");
        const loginRes = await axios.post(
          `${API_BASE.replace(/\/$/, "")}/auth/login`,
          {},
          { headers: { id_token: idToken } }
        );

        const { success, data, message } = loginRes.data || {};
        if (!success || !data?.accessToken)
          throw new Error(message || "로그인 실패");

        localStorage.setItem("access_token", data.accessToken);
        if (data.refreshToken) localStorage.setItem("refresh_token", data.refreshToken);

        setMsg("로그인 성공! 이동 중…");
        cleanup();
        nav("/home", { replace: true });
      } catch (e) {
        console.error("[LOGIN ERR]", e?.response || e);

        setMsg("로그인 실패. 다시 시도해 주세요.");
        cleanup();
        nav("/login?error=callback_failed", { replace: true });
      }
    })();
  }, [nav]);

  return (
    <div>
      <LoaderShapes fullscreen />
      <div
        style={{
          position: "fixed",
          bottom: "20%",
          width: "100%",
          textAlign: "center",
          fontFamily: "Cafe24SsurroundAir, sans-serif",
          fontSize: "16px",
          color: "#414A56",
        }}
      >
      </div>
    </div>
  );
}
