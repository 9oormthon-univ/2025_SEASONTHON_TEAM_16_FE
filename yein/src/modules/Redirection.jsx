import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Redirection() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const code = new URL(window.location.href).searchParams.get("code");
        if (!code) {
          navigate("/login?error=no_code");
          return;
        }

        // 1) 카카오 토큰 교환
        const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY; // .env에 보관
        const redirectUri =
          window.location.hostname === "localhost"
            ? "http://localhost:5173/oidc-callback"
            : "https://yein-frontend.vercel.app/oidc-callback";

        const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: redirectUri,
            code,
            // client_secret: process.env.REACT_APP_KAKAO_CLIENT_SECRET ?? ""  // ← 콘솔에서 시크릿을 사용 중이면 필수 (프론트에서 못 씀)
          }).toString(),
        });

        const tokenJson = await tokenRes.json();
        if (!tokenRes.ok) throw new Error(`kakao_token_failed: ${JSON.stringify(tokenJson)}`);

        const { id_token } = tokenJson;
        if (!id_token) throw new Error("no_id_token_from_kakao");

        // 2) 우리 서버 로그인 (id_token 헤더 필수)
        const apiBase = process.env.REACT_APP_URL;
        const loginUrl = new URL("/auth/login", apiBase).toString();

        const res = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "id_token": id_token,            // ✅ 서버 요구 헤더
          },
          credentials: "include",
          body: JSON.stringify({ provider: "KAKAO" }), // 필요 없으면 제거
        });

        const text = await res.text();
        if (!res.ok) throw new Error(`login_failed: ${res.status} ${text}`);

        // 성공 처리
        const data = text ? JSON.parse(text) : {};
        localStorage.setItem("name", data.user_name ?? "");
        navigate("/loginSuccess");
      } catch (e) {
        console.error(e);
        navigate("/login?error=failed");
      }
    })();
  }, [navigate]);

  return <div style={{ padding: 32 }}>🔁 카카오 로그인 처리 중…</div>;
}
