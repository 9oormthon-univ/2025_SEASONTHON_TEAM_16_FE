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
  const LOGIN_ENDPOINT = `${API_BASE}/auth/login`;

  const res = await axios.post(
    LOGIN_ENDPOINT,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        id_token: idToken,
      },
      timeout: 15000,
      withCredentials: false,
    }
  );

  return res.data;
}
