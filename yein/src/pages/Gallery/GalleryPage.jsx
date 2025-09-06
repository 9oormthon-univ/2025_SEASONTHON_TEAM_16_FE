import { useState, useEffect } from "react";
import styles from "./GalleryPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getGalleries } from "../../api/gallery"; // ✅ 변경
import { useNavigate } from "react-router-dom";

const GalleryPage = () => {
  const [selected, setSelected] = useState("week"); // today | week
  const [galleries, setGalleries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getGalleries({
          page: 0,
          size: 20,
          period: selected,
          sortBy: "date_desc",
        });
        setGalleries(data.content || []);
      } catch (err) {
        console.error("갤러리 불러오기 실패:", err);
      }
    })();
  }, [selected]);

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

        {/* 갤러리 목록 */}
        <div className={styles.grid}>
          {galleries.length > 0 ? (
            galleries.map((gallery) => (
              <div
                key={gallery.id}
                className={styles.card}
                onClick={() => navigate(`/detail/${gallery.id}`)}
              >
                <img
                  src={gallery.imageUrl}
                  alt={gallery.title}
                  className={styles.image}
                />
              </div>
            ))
          ) : (
            <p className={styles.emptyText}>
              {selected === "today"
                ? "오늘 업로드한 필사가 없습니다."
                : "이번주 업로드한 필사가 없습니다."}
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
