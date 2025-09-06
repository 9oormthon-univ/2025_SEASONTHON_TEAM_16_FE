import { useEffect, useState } from "react";
import Footer from "../../components/common/Footer";
import styles from "./HomePage.module.css";
import ProgressBar from "../../components/common/ProgressBar";
import BestPostCard from "../../components/home/BestPostCard";
import Header from "../../components/common/Header";
import { getTodayRecommendation } from "../../api/recommend";
import { getPosts } from "../../api/community";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bestPosts, setBestPosts] = useState([]);
  const [bestLoading, setBestLoading] = useState(true);
  const [bestError, setBestError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const sentence = await getTodayRecommendation();
        setQuote(sentence ? `“${sentence}”` : "추천 문구 없음");
      } catch (err) {
        console.error("추천문구 불러오기 실패:", err);
        setError("추천 문구를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPosts({ sortBy: "best", page: 0, size: 6 });
        const items = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
        setBestPosts(items);
      } catch (e) {
        console.error("BEST 게시글 불러오기 실패:", e);
        setBestError("게시글을 불러오지 못했습니다.");
      } finally {
        setBestLoading(false);
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

      <section className={styles.petSection}>
        <div className={styles.pet_wrapper}>
          <img className={styles.petCircle} src="/assets/images/bg_pet.svg" alt="배경" />
          <img className={styles.petImg} src="/assets/images/puppy3.svg" alt="펫" />
        </div>
        <div className={styles.levelText}>나의 펫 (Lv. 4)</div>
        <ProgressBar value={65} />
        <button className={styles.primaryBtn} onClick={() => navigate("/pet")}>
          마이펫 보러가기
        </button>
      </section>

      <section className={styles.quoteSection}>
        <div className={styles.sectionLabel}>오늘의 문구 추천</div>
        {loading ? (
          <p className={styles.quote}>불러오는 중…</p>
        ) : error ? (
          <p className={styles.quote}>{error}</p>
        ) : (
          <p className={styles.quote}>{quote}</p>
        )}
        <button
          className={styles.secondaryBtn}
          onClick={() => navigate("/transcription")}
        >
          오늘의 문구 필사하기
        </button>
      </section>

      <section className={styles.bestSection}>
        <div className={styles.sectionLabel}>BEST 필사</div>

        {bestLoading ? (
          <div className={styles.postGrid}>
            <BestPostCard title="불러오는 중…" />
            <BestPostCard title="불러오는 중…" />
            <BestPostCard title="불러오는 중…" />
          </div>
        ) : bestError ? (
          <p className={styles.quote}>{bestError}</p>
        ) : bestPosts.length === 0 ? (
          <p className={styles.quote}>게시글이 없습니다.</p>
        ) : (
          <div className={styles.postGrid}>
            {bestPosts.map((post) => (
              <BestPostCard
                key={post.id || post.postId}
                title={post.title}
                thumbnail={post.thumbnailUrl || post.thumbnail || post.imageUrl}
                protectedImage={false}
                author={post.author?.nickname}
                likes={post.likes}
                onClick={() => navigate(`/posts/${post.id || post.postId}`)}   // ✅ 상세로 이동
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
