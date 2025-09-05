import { useState } from "react";
import styles from "./GalleryPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

const GalleryPage = () => {
  const [selected, setSelected] = useState("week");

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
        <p className={styles.pageTitle}> 내 필사 갤러리</p>
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
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
