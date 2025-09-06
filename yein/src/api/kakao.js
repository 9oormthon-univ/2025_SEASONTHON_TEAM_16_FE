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
  return axios.post(
    `${API_BASE}/auth/login`,
    {}, // body 없음
    {
      headers: {
        id_token: idToken,   // 서버가 요구하는 헤더
      },
      withCredentials: true, // 세션 쿠키 쓴다면 필요
    }
  ).then(res => res.data);
}