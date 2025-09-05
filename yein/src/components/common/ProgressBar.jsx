import styles from "./ProgressBar.module.css";

const ProgressBar = ({ value = 62 }) => {
  return (
    <div className={styles.progressWrap} aria-label="경험치 바">
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${value}%` }} />
        <span className={styles.tick} style={{ left: "25%" }} />
        <span className={styles.tick} style={{ left: "50%" }} />
        <span className={styles.tick} style={{ left: "75%" }} />
      </div>
      <p className={styles.progressHint}>
        레벨 업까지 앞으로 50 경험치가 남았어요!
      </p>
    </div>
  );
};

export default ProgressBar;
