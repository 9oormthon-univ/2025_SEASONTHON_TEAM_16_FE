import styles from "./KakaoButton.module.css";

export default function KakaoButton({ onClick, disabled, loading }) {
  return (
    <button
      className={styles.kakao}
      onClick={onClick}
      disabled={disabled}
      aria-label="카카오로 시작하기"
    >
      <img src="/assets/kakao.png" alt="kakao" className={styles.icon} />
      {loading ? "카카오로 이동 중…" : "카카오톡으로 시작하기"}
    </button>
  );
}
