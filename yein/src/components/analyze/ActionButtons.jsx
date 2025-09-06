import React, { useState } from "react";
import styles from "./ActionButtons.module.css";

export default function ActionButtons({ onRetry, onComplete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRetryClick = () => {
    setShowConfirm(true); 
  };

  const confirmRetry = () => {
    setShowConfirm(false);
    onRetry && onRetry(); 
  };

  const cancelRetry = () => {
    setShowConfirm(false);
  };

  return (
    <div className={styles.wrapper}>
      <button className={`${styles.btn} ${styles.retry}`} onClick={handleRetryClick}>
        재도전
      </button>
      <button className={`${styles.btn} ${styles.complete}`} onClick={onComplete}>
        완료하기
      </button>

      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p className={styles.retryAsk}>재도전하시겠습니까?</p><br />
            <p className={styles.retryComment}>이전에 작성한 필사 기록은 저장됩니다. <br />새로운 필사로 다시 시도할 수 있어요.</p><br />
            <div className={styles.modalActions}>
              <button onClick={cancelRetry} className={styles.cancel}>
                취소
              </button>
              <button onClick={confirmRetry} className={styles.confirm}>
                재도전
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
