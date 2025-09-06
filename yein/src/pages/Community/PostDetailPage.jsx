import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetailPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getPostDetail } from "../../api/post";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPostDetail(postId);
        setPost(data);
      } catch (err) {
        console.error("게시글 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  if (loading) return <p>불러오는 중...</p>;
  if (!post) return <p>데이터 없음</p>;

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.info}>
          {post.bookTitle} / {post.author}
        </p>
        <p className={styles.quote}>{post.quote}</p>

        <div className={styles.meta}>
          <span>작성자: {post.createdByNickname}</span>
          <span>❤️ {post.likeCount}</span>
          <span>조회수 {post.viewCount}</span>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostDetailPage;
