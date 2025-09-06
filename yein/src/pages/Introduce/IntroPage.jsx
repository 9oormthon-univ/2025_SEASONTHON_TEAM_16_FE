import { useState } from "react";
import styles from "./IntroPage.module.css";
import { genRandomString } from "../../utils/random";
import KakaoButton from "../../components/KakaoButton/KakaoButton";
import { KAKAO_REST_API_KEY, REDIRECT_URI } from "../../config/env";
import StartButton from "../../components/StartButton";

export default function Intro() {

  return (
    <div className={styles.signup} style={{ backgroundImage: "url(/assets/images/bg_home.svg)" }}>
        <div className={styles.title}>禮仁</div>
        <div className={styles.headline}>
            글을 쓰며 마음을 다스리는 필사,
            <br />
            지금 시작해 보세요.
        </div>

        <img className={styles.logo} src="/assets/Clip.png" />
        <div className={styles.grid}>
            <div className={styles.itemLeft}>
                <div className={`${styles.circle} ${styles.gray}`}>
                    <img src="/assets/icons/screen_search_desktop.svg" />
                </div>
                <span>AI 분석</span>
            </div>
            <div className={styles.itemRight}>
                <div className={`${styles.circle} ${styles.pink}`}>
                    <img src="/assets/icons/cruelty_free.svg" />
                </div>
                <span>펫 키우기</span>
            </div>
            <div className={styles.itemLeft}>
                <div className={`${styles.circle} ${styles.purple}`}>
                    <img src="/assets/icons/Activity.svg" />
                </div>
                <span>갤러리</span>
            </div>
            <div className={styles.itemRight}>
                <div className={`${styles.circle} ${styles.blue}`}>
                    <img src="/assets/icons/chat_paste_go_2.svg" />
                </div>
                <span>공유하기</span>
            </div>
        </div>
        <StartButton />
      </div>
  );
}
