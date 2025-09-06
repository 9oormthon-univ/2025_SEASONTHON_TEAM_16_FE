import { useEffect, useState } from "react";
import Footer from "../../components/common/Footer";
import styles from "./HomePage.module.css";
import ProgressBar from "../../components/common/ProgressBar";
import BestPostCard from "../../components/home/BestPostCard";
import Header from "../../components/common/Header";
import { getTodayRecommendation } from "../../api/recommend";
import { getPosts } from "../../api/community";
import { getPetStatus } from "../../api/pet"; // ✅ 펫 API 추가
import { useNavigate } from "react-router-dom";

// 서버 ↔ 클라 매핑 (PetPage랑 동일하게)
const serverToClientPetType = {
  DEFAULT: "PUPPY",
  TYPE_1: "CAT",
  TYPE_2: "RABBIT",
  TYPE_3: "BEAR",
  TYPE_4: "MOUSE",
};

const petImages = {
  PUPPY: [
    "/assets/images/puppy1.svg",
    "/assets/images/puppy2.svg",
    "/assets/images/puppy3.svg",
  ],
  CAT: [
    "/assets/images/cat1.svg",
    "/assets/images/cat2.svg",
    "/assets/images/cat3.svg",
  ],
  RABBIT: [
    "/assets/images/rabbit1.svg",
    "/assets/images/rabbit2.svg",
    "/assets/images/rabbit3.svg",
  ],
  BEAR: [
    "/assets/images/bear1.svg",
    "/assets/images/bear2.svg",
    "/assets/images/bear3.svg",
  ],
  MOUSE: [
    "/assets/images/mouse1.svg",
    "/assets/images/mouse2.svg",
    "/assets/images/mouse3.svg",
  ],
};

const HomePage = () => {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bestPosts, setBestPosts] = useState([]);
  const [bestLoading, setBestLoading] = useState(true);
  const [bestError, setBestError] = useState("");

  const [pet, setPet] = useState(null); // ✅ 펫 상태
  const [petLoading, setPetLoading] = useState(true);

  const navigate = useNavigate();

  // 오늘의 문구
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

  // BEST 게시글
  useEffect(() => {
    (async () => {
      try {
        const data = await getPosts({ sortBy: "best", page: 0, size: 6 });
        const items = Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data)
          ? data
          : [];
        setBestPosts(items);
      } catch (e) {
        console.error("BEST 게시글 불러오기 실패:", e);
        setBestError("게시글을 불러오지 못했습니다.");
      } finally {
        setBestLoading(false);
      }
    })();
  }, []);

  // ✅ 나의 펫 API
  useEffect(() => {
    (async () => {
      try {
        const petData = await getPetStatus();
        setPet(petData);
      } catch (e) {
        console.error("펫 상태 불러오기 실패:", e);
      } finally {
        setPetLoading(false);
      }
    })();
  }, []);

  // 펫 이미지 계산
  let petImg = "/assets/images/puppy1.svg";
  if (pet) {
    const clientType = serverToClientPetType[pet.petType] || "PUPPY";
    const imgs = petImages[clientType] || [];
    petImg = imgs[(pet.evolutionStage || 1) - 1] || petImg;
  }

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

      {/* ✅ 나의 펫 섹션 */}
      <section className={styles.petSection}>
        {petLoading ? (
          <p>펫 불러오는 중…</p>
        ) : !pet ? (
          <p>펫 정보 없음</p>
        ) : (
          <>
            <div className={styles.pet_wrapper}>
              <img
                className={styles.petCircle}
                src="/assets/images/bg_pet.svg"
                alt="배경"
              />
              <img className={styles.petImg} src={petImg} alt="펫" />
            </div>
            <div className={styles.levelText}>
              {pet.name} (Lv. {pet.level})
            </div>
            <ProgressBar
              currentXp={pet.currentXp}
              xpToNextLevel={pet.xpToNextLevel}
            />

            <button
              className={styles.primaryBtn}
              onClick={() => navigate("/pet")}
            >
              마이펫 보러가기
            </button>
          </>
        )}
      </section>

      {/* 오늘의 문구 */}
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

      {/* BEST 필사 */}
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
                onClick={() => navigate(`/posts/${post.id || post.postId}`)}
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
