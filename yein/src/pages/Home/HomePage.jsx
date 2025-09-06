import { useEffect, useState } from "react";
import Footer from "../../components/common/Footer";
import styles from "./HomePage.module.css";
import ProgressBar from "../../components/common/ProgressBar";
import BestPostCard from "../../components/home/BestPostCard";
import Header from "../../components/common/Header";
import { getTodayRecommendation } from "../../api/recommend";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          <img
            className={styles.petCircle}
            src="/assets/images/bg_pet.svg"
            alt="배경"
          />
          <img
            className={styles.petImg}
            src="/assets/images/puppy3.svg"
            alt="펫"
          />
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
      </section>
      <button className={styles.secondaryBtn}>오늘의 문구 필사하기</button>

      <section className={styles.bestSection}>
        <div className={styles.sectionLabel}>BEST 필사</div>
        <div className={styles.postGrid}>
          <BestPostCard />
          <BestPostCard />
          <BestPostCard />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;
