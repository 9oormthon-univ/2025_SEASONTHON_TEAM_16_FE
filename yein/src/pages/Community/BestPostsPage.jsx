import { useEffect, useState } from "react";
import styles from "./BestPostsPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getPosts } from "../../api/post";

const BestPostsPage = () => {
  const [bestPosts, setBestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPosts({
          sortBy: "view",
          page: 0,
          size: 10,
        });
        setBestPosts(data.content || []);
      } catch (err) {
        console.error("주간 베스트 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: "url(/assets/images/bg_home.svg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Header />
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>커뮤니티</h2>
        <p className={styles.subtitlCard}>주간 Best</p>
        <ul className={styles.postList}>
          {bestPosts.map((post, index) => (
            <li key={post.id} className={styles.postCard}>
              <span className={styles.rank}>{index + 1}위</span>
              <div className={styles.top_info}>
                <p className={styles.title}>{post.title}</p>
                <p className={styles.info}>
                  {post.bookTitle} / {post.author}
                </p>
              </div>
              <p className={styles.quote}>{post.quote}</p>
              <div className={styles.bottom}>
                <span className={styles.like}>
                  <img src="/assets/icons/heart.svg" alt="하트" />
                  {post.likeCount || 0}
                </span>
                <span>{post.createdByNickname}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default BestPostsPage;
