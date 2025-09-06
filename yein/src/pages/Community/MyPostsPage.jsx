import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyPostsPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getMyPosts } from "../../api/post";

const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <p className={styles.subtitleCard}>내가 쓴 글</p>
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li
              key={post.id}
              className={styles.postCard}
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <div className={styles.postTop}>
                <span className={styles.title}>{post.title}</span>
              </div>
              <p className={styles.author}>
                {post.bookTitle} / {post.author}
              </p>
              <p className={styles.quote}>{post.quote}</p>
              <div className={styles.bottom}>
                <span className={styles.like}>
                  <img src="/assets/icons/heart.svg" alt="좋아요" />
                  {post.likeCount || 0}
                </span>
                <span>{post.createdAt.slice(0, 10)}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default MyPostsPage;
