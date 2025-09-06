import axios from "axios";
import {
  REDIRECT_URI,
  KAKAO_REST_API_KEY,
  KAKAO_CLIENT_SECRET,
  API_BASE,
} from "../config/env";

export async function fetchKakaoIdToken(code, returnedState) {
  if (!KAKAO_REST_API_KEY) throw new Error("Kakao REST API Key 없음");

  const savedState = sessionStorage.getItem("kakao_oauth_state");
  if (savedState && returnedState && savedState !== returnedState) {
    throw new Error("state 불일치 (CSRF 보호 실패)");
  }

  const form = new URLSearchParams();
  form.set("grant_type", "authorization_code");
  form.set("client_id", KAKAO_REST_API_KEY);
  form.set("redirect_uri", REDIRECT_URI);
  form.set("code", code);

  if (KAKAO_CLIENT_SECRET) form.set("client_secret", KAKAO_CLIENT_SECRET);

  const res = await axios.post("https://kauth.kakao.com/oauth/token", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    timeout: 15000,
  });

  const idToken = res.data?.id_token;
  if (!idToken) throw new Error("id_token 없음 (scope=openid 확인 필요)");
  return idToken;
}

export async function loginWithIdToken(idToken) {
  const res = await fetch(`${API_BASE.replace(/\/$/,"")}/auth/kakao/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ idToken }), // 서버 사양에 따라 { id_token } 등 필드명 확인
    credentials: "include", // 서버가 세션도 세팅한다면 유지, 아니면 제거해도 됨
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LOGIN HTTP ${res.status}: ${text}`);
  }
  return res.json(); // { success, data:{ accessToken, refreshToken?, user } }
}