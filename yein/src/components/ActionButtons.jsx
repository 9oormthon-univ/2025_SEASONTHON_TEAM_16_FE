import React from "react";
import styles from "./Buttons.module.css";

export default function ActionButtons({ onRetry, onComplete }) {
  return (
    <div className={styles.wrapper}>
      <button className={`${styles.btn} ${styles.retry}`} onClick={onRetry}>
        재도전
      </button>
      <button className={`${styles.btn} ${styles.complete}`} onClick={onComplete}>
        완료하기
      </button>
    </div>
  );
}
