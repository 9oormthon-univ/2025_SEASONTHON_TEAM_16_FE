import axios from "axios";

function getEnv(keyVite, keyCra) {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[keyVite]) {
    return import.meta.env[keyVite];
  }
  return process.env?.[keyCra];
}

export async function fetchKakaoIdToken(code, redirectUri) {
  const REST_API_KEY = getEnv("VITE_KAKAO_REST_API_KEY", "REACT_APP_KAKAO_REST_API_KEY");
  if (!REST_API_KEY) throw new Error("Kakao REST API Key 미설정");

  const res = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: REST_API_KEY,
      redirect_uri: redirectUri, // 인가 때와 '완전히 동일'해야 함
      code,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const idToken = res.data?.id_token;
  if (!idToken) throw new Error("카카오 id_token을 받지 못했습니다.");
  return idToken;
}
