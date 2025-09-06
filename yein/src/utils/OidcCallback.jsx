import { useEffect, useState } from "react";
import { api } from "../api/client";
import { API_BASE } from "../utils/env";

export default function OidcCallback() {
  const [msg, setMsg] = useState("카카오 로그인 처리 중…");

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const returnedState = url.searchParams.get("state");
        const savedState = sessionStorage.getItem("kakao_oauth_state");
        const redirectUri = `${window.location.origin}/oidc-callback`;

        if (!code) throw new Error("code 없음");
        if (!returnedState) throw new Error("state 없음");
        if (returnedState !== savedState) throw new Error("state 불일치");

        // 백엔드에서 카카오 토큰 교환 → 우리 서버 accessToken 발급
        const { data } = await api.post(`${API_BASE.replace(/\/$/, "")}/auth/kakao/token`, {
          code,
          redirectUri,
        });

        if (!data?.accessToken) {
          console.error("login resp:", data);
          throw new Error("accessToken 미응답");
        }

        localStorage.setItem("access_token", data.accessToken); // ✅ 우리 서버 토큰 저장
        setMsg("로그인 성공! 이동 중…");
        window.location.replace("/home"); // 필요 경로로 이동
      } catch (e) {
        console.error("로그인 실패:", e);
        setMsg("로그인 실패");
      }
    })();
  }, []);

  return <div style={{ padding: 24 }}>{msg}</div>;
}