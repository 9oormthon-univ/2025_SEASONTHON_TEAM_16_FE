import styles from "./BestPostCard.module.css";

const BestPostCard = ({ title = "게시글 제목", thumbnail, author, likes, onClick }) => (
  <button className={styles.postCard} type="button" onClick={onClick}>
    <div className={styles.postThumb}>
      {thumbnail ? <img src={thumbnail} alt={title} className={styles.img} /> : <span className={styles.imgPlaceholder} />}
    </div>
    <div className={styles.postTitle}>{title}</div>
    {(author || likes !== undefined) && (
      <div className={styles.postMeta}>
        <span className={styles.author}>{author}</span>
        {likes !== undefined && <span className={styles.likes}>❤️ {likes}</span>}
      </div>
    )}
  </button>
);

export default BestPostCard;