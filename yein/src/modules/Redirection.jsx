import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchKakaoIdToken, loginWithIdToken } from "../api/kakao";
import { API_BASE, REDIRECT_URI } from "../config/env";

export default function Redirection() {
  const nav = useNavigate();
  const once = useRef(false);
  const [msg, setMsg] = useState("로그인 처리 중…");
  const [debug, setDebug] = useState({});

  // 쿼리 파라미터
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const returnedState = params.get("state");

  useEffect(() => {
    if (once.current) return;
    once.current = true;

    (async () => {
      try {
        if (!code) {
          setMsg("인가 코드 없음. 다시 로그인해주세요.");
          setTimeout(() => nav("/login", { replace: true }), 1200);
          return;
        }

        setMsg("카카오 토큰 교환 중…");
        const idToken = await fetchKakaoIdToken(code, returnedState);

        setMsg("서버 로그인 중…");
        const apiRes = await loginWithIdToken(idToken);

        const { success, message, data } = apiRes || {};
        if (!success) throw new Error(message || "로그인 실패");

        if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

        setDebug({ API_BASE, REDIRECT_URI, code: "(수신됨)" });
        setMsg("로그인 성공! 메인으로 이동합니다…");
        setTimeout(() => nav("/home", { replace: true }), 1000);
      } catch (err) {
        const status = err?.response?.status;
        const body = err?.response?.data;
        console.error("[LOGIN ERR]", status, body ?? err?.message);

        setMsg(body?.message || err?.message || "로그인 실패");
        setDebug({ API_BASE, REDIRECT_URI, status, serverBody: body ?? null });
        setTimeout(() => nav("/login", { replace: true }), 1800);
      }
    })();
  }, [code, returnedState, nav]);

  return (
    <div style={{ padding: "2rem", lineHeight: 1.6 }}>
      <h3>카카오 로그인 처리 중…</h3>
      <pre>{msg}</pre>
      <details>
        <summary>디버그</summary>
        <pre>
          {JSON.stringify(
            { ...debug, location: window.location.href },
            null,
            2
          )}
        </pre>
      </details>
    </div>
  );
}
