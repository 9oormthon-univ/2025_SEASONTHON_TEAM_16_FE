import { useState, useEffect } from "react";
import styles from "./GalleryPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getMyPosts } from "../../api/getpost";
import { useNavigate } from "react-router-dom";

const GalleryPage = () => {
  const [selected, setSelected] = useState("week");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyPosts();
        setPosts(data.data.content);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    })();
  }, []);

  return (
    <div
      className={styles.container}
      style={{
        backgroundImage: "url(/assets/images/bg_home.svg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />
      <main className={styles.mainContent}>
        <p className={styles.pageTitle}>내 필사 갤러리</p>

        {/* 이번주/오늘 버튼 */}
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${
              selected === "week" ? styles.active : ""
            }`}
            onClick={() => setSelected("week")}
          >
            이번주
          </button>
          <button
            className={`${styles.button} ${
              selected === "today" ? styles.active : ""
            }`}
            onClick={() => setSelected("today")}
          >
            오늘
          </button>
        </div>

        {/* 게시글 목록 */}
        <div className={styles.grid}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className={styles.card}
                onClick={() => navigate(`/detail/${post.id}`)} // ✅ 클릭 시 상세 페이지 이동
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className={styles.image}
                />
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>아직 업로드한 필사가 없습니다.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
