import { useState } from "react";
import styles from "./Signup.module.css";
import { genRandomString } from "../../utils/random";
import KakaoButton from "../../components/KakaoButton/KakaoButton";
import { KAKAO_REST_API_KEY, REDIRECT_URI } from "../../config/env";

export default function Signup() {
  const [loading, setLoading] = useState(false);

  const onKakao = () => {
    if (!KAKAO_REST_API_KEY) {
      alert("Kakao REST API 키 없음");
      return;
    }

    // state, nonce 생성 + 저장
    const state = genRandomString(32);
    const nonce = genRandomString(32);
    sessionStorage.setItem("kakao_oauth_state", state);
    sessionStorage.setItem("kakao_oauth_nonce", nonce);

    const scope = "openid profile_nickname profile_image account_email";
    const params = new URLSearchParams({
      client_id: KAKAO_REST_API_KEY,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      state,
      nonce,
      scope,
    });

    setLoading(true);
    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`;
  };

  return (
    <div className={styles.signup} style={{ backgroundImage: "url(/assets/images/bg_home.svg)" }}>
        <div className={styles.title}>禮仁</div>
        <div className={styles.headline}>
          필사의 첫걸음을 내딛어 볼까요?
        </div>

        <img className={styles.logo} src="/assets/Clip.png" />

        <div className={styles.mentBlock}>
          당신의 손끝에서 태어난 기록이
          <br />
          작은 펫의 성장이 되고,
          <br />
          당신의 하루를 더 단단하게 만들어줍니다.
        </div>

        <div className={styles.socials}>
          <KakaoButton
            onClick={onKakao}
            disabled={loading || !KAKAO_REST_API_KEY}
            loading={loading}
          />
          {!KAKAO_REST_API_KEY && (
            <small className={styles.error}>
              환경변수(REACT_APP_KAKAO_REST_API_KEY)를 설정하세요.
            </small>
          )}
        </div>
      </div>
  );
}
