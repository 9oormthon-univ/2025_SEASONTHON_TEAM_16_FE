// src/modules/Redirection.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchKakaoIdToken } from "../api/kakao";
import { API_BASE } from "../config/env";

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

        // (선택) state 검증
        const saved = sessionStorage.getItem("kakao_oauth_state") || sessionStorage.getItem("oidc_state_kakao");
        if (saved && state && saved !== state) throw new Error("state 불일치");

        // 1) code -> id_token
        setMsg("카카오 토큰 교환 중…");
        const idToken = await fetchKakaoIdToken(code, redirectUri);

        // 2) 헤더 id_token 으로 서버 로그인
        setMsg("서버 로그인 중…");
        const loginRes = await axios.post(
          `${API_BASE.replace(/\/$/, "")}/auth/login`,
          {},
          { headers: { id_token: idToken } } // ✅ 핵심
        );

        const { success, data, message } = loginRes.data || {};
        if (!success || !data?.accessToken) throw new Error(message || "로그인 실패");

        // 앱 토큰 저장 (서버 스펙에 맞게 필드명 사용)
        localStorage.setItem("access_token", data.accessToken);
        if (data.refreshToken) localStorage.setItem("refresh_token", data.refreshToken);

        setMsg("로그인 성공! 메인으로 이동합니다…");
        cleanup();
        nav("/home", { replace: true });
      } catch (e) {
        const status = e?.response?.status ?? 0;
        const body = e?.response?.data ?? null;
        console.error("[LOGIN ERR]", status, body ?? e?.message);

        // 카카오 표준 에러 핸들링 (있을 경우)
        const code = body?.error_code || body?.error;
        if (code === "KOE237") {
          setMsg("코드가 이미 사용되었습니다. 다시 로그인해주세요.");
          cleanup();
          return nav("/login?error=code_used", { replace: true });
        }
        if (code === "KOE320") {
          setMsg("코드가 유효하지 않거나 redirect URI가 일치하지 않습니다.");
          cleanup();
          return nav("/login?error=invalid_grant", { replace: true });
        }

        setMsg("로그인 실패. 다시 시도해 주세요.");
        cleanup();
        nav("/login?error=callback_failed", { replace: true });
      }
    })();
  }, [nav]);

  return (
    <div style={{ padding: "2rem", lineHeight: 1.6 }}>
      <h3>카카오 로그인 처리 중…</h3>
      <pre>{msg}</pre>
    </div>
  );
}
