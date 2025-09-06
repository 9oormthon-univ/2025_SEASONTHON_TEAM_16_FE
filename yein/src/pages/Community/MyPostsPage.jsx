import { useEffect, useState } from "react";
import styles from "./MyPostsPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getMyPosts } from "../../api/post";

const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyPosts({ page: 0, size: 10 });
        setPosts(data.content || []);
      } catch (err) {
        console.error("내 게시글 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>내가 쓴 글</h2>
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post.id} className={styles.postCard}>
              <h4>{post.title}</h4>
              <p>{post.quote}</p>
              <span>
                {post.bookTitle} / {post.author}
              </span>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default MyPostsPage;
