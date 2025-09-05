import styles from "./BestPostCard.module.css";

const BestPostCard = ({ title = "게시글 제목" }) => (
  <button className={styles.postCard} type="button">
    <div className={styles.postThumb}>
      <span className={styles.imgPlaceholder}>🖼️</span>
    </div>
    <div className={styles.postTitle}>{title}</div>
  </button>
);

export default BestPostCard;
