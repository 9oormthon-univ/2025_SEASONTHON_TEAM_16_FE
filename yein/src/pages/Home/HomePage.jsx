import Footer from "../../components/common/Footer";
import styles from "./HomePage.module.css";
import ProgressBar from "../../components/common/ProgressBar";
import BestPostCard from "../../components/home/BestPostCard";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
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
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandKanji}>
            <img src="assets/images/logo.svg" alt="禮仁" />
          </div>
          <button
            className={styles.avatarBtn}
            aria-label="프로필 열기"
            onClick={() => navigate("/profile")}
          >
            v
          </button>
        </div>
        <div className={styles.brandSub}>조용히 쓰고, 크게 성장하다</div>
      </header>

      <section className={styles.petSection}>
        <div className={styles.petCircle}>
          <img className={styles.petImg} src="" alt="펫" />
        </div>
        <div className={styles.levelText}>나의 펫 (Lv. 4)</div>
        <ProgressBar value={65} />
        <button className={styles.primaryBtn}>마이펫 보러가기</button>
      </section>

      <section className={styles.quoteSection}>
        <div className={styles.sectionLabel}>오늘의 문구 추천</div>
        <p className={styles.quote}>“동해물과백두산이마르고닳도록”</p>
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
