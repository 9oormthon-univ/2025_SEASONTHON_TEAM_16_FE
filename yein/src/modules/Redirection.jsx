// src/pages/Redirection.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Redirection() {
  const nav = useNavigate();
  const [msg, setMsg] = useState("로그인 처리 중…");
  const [debug, setDebug] = useState({});
  const once = useRef(false); // 중복 실행 방지(StrictMode 대비)

  // ====== 환경/엔드포인트 ======
  const USE_VERCEL_PROXY = false; // vercel.json rewrites 사용 시 true
  const API_BASE = (process.env.REACT_APP_API_BASE || "").replace(/\/$/, "") || "http://localhost:4000";
  const LOGIN_ENDPOINT = USE_VERCEL_PROXY ? "/api/auth/login" : `${API_BASE}/auth/login`;

  // 현재 호스트에 따라 redirect_uri 자동 분기
  const REDIRECT_URI = (() => {
    const host = window.location.hostname;
    const port = window.location.port;
    if (host.endsWith("vercel.app")) {
      return "https://2025-seasonthon-team-16-fe.vercel.app/oidc-callback";
    }
    if (host === "localhost") {
      if (port === "5173") return "http://localhost:5173/oidc-callback";
      return "http://localhost:3000/oidc-callback"; // CRA 기본 포트
    }
    // 기타 환경: 현재 origin 기준
    return `${window.location.origin}/oidc-callback`;
  })();

  // 쿼리 파라미터
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const returnedState = params.get("state");

  // ====== 1) 카카오 토큰 교환 → id_token 확보 ======
  async function fetchKakaoIdToken(authCode) {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
    if (!REST_API_KEY) throw new Error("REACT_APP_KAKAO_REST_API_KEY 누락");

    // (선택) state/nonce 검증
    const savedState = sessionStorage.getItem("kakao_oauth_state");
    const savedNonce = sessionStorage.getItem("kakao_oauth_nonce");
    if (savedState && returnedState && savedState !== returnedState) {
      throw new Error("state 불일치 (CSRF 보호 실패)");
    }

    const form = new URLSearchParams();
    form.set("grant_type", "authorization_code");
    form.set("client_id", REST_API_KEY);
    form.set("redirect_uri", REDIRECT_URI); // authorize 때와 완전히 동일해야 함
    form.set("code", authCode);

    // 카카오 콘솔에서 Client Secret "사용"이면 필수
    const CS = process.env.REACT_APP_KAKAO_CLIENT_SECRET;
    if (CS && CS.trim()) form.set("client_secret", CS.trim());

    const r = await axios.post("https://kauth.kakao.com/oauth/token", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 15000,
    });

    const idToken = r.data?.id_token;
    if (!idToken) throw new Error("카카오 응답에 id_token 없음 (authorize에 scope=openid 포함 확인)");
    return idToken;
  }

  // ====== 2) 우리 서버 로그인 (id_token 헤더로 전송) ======
  async function loginWithIdToken(idToken) {
    const res = await axios.post(
      LOGIN_ENDPOINT,
      {}, // 보디 필요 없으면 빈 객체
      {
        headers: {
          "Content-Type": "application/json",
          "id_token": idToken, 
        },
        timeout: 15000,
        withCredentials: false,
      }
    );
    return res.data;
  }

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    (async () => {
      try {
        // 기본 점검
        if (!code) {
          setMsg("인가 코드가 없습니다. 다시 로그인 해주세요.");
          setTimeout(() => nav("/login", { replace: true }), 1200);
          return;
        }

        setMsg("카카오 토큰 교환 중…");
        const idToken = await fetchKakaoIdToken(code);
        console.debug("[id_token]", idToken?.slice(0, 16), "...");

        setMsg("서버 로그인 중…");
        const apiRes = await loginWithIdToken(idToken);

        // 서버 응답 포맷 예: { success, code, message, data: { accessToken, refreshToken, ... } }
        const { success, message, data } = apiRes || {};
        if (!success) {
          throw new Error(message || "로그인 실패");
        }

        // 토큰/유저 저장
        if (data?.accessToken) localStorage.setItem("access_token", data.accessToken);
        if (data?.refreshToken) localStorage.setItem("refresh_token", data.refreshToken);
        if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

        setDebug({
          API_BASE,
          LOGIN_ENDPOINT,
          REDIRECT_URI,
          code: code ? "(수신됨)" : "(없음)",
        });

        setMsg("로그인 성공! 메인으로 이동합니다…");
        
      } catch (err) {
        const status = err?.response?.status;
        const body = err?.response?.data;
        console.error("[LOGIN ERR]", status, body ?? err?.message);

        const hint =
          body?.message ||
          body?.error_description ||
          err?.message ||
          "로그인 실패 (자세한 내용은 콘솔/네트워크 탭 참고)";

        setMsg(hint);
        setDebug({
          API_BASE,
          LOGIN_ENDPOINT,
          REDIRECT_URI,
          status: status ?? "?",
          serverBody: body ?? null,
        });

        // 실패 시 로그인 페이지로 복귀
        setTimeout(() => nav("/login", { replace: true }), 1800);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "2rem", lineHeight: 1.6 }}>
      <h3>카카오 로그인 처리 중…</h3>
      <pre style={{ whiteSpace: "pre-wrap" }}>{msg}</pre>

      {/* 디버깅 정보 (필요 시만 열어보세요) */}
      <details style={{ marginTop: "1rem" }}>
        <summary>디버그</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(
            {
              ...debug,
              location: window.location.href,
              origin: window.location.origin,
            },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  );
}
