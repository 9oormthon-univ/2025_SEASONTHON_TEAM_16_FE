import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./DetailPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getGalleryDetail } from "../../api/gallery";

const DetailPage = () => {
  const { galleryId } = useParams();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getGalleryDetail(galleryId);
        setGallery(data);
      } catch (err) {
        console.error("갤러리 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [galleryId]);

  if (loading) return <p>불러오는 중...</p>;
  if (!gallery) return <p>데이터 없음</p>;

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

        {/* 제목 + 날짜 */}
        <div className={styles.postHeader}>
          <p className={styles.bookTitle}>{gallery.title}</p>
          <p className={styles.date}>
            {new Date(gallery.createdAt).toISOString().slice(0, 10)}
          </p>
        </div>

        {/* 이미지 */}
        <div className={styles.imageWrapper}>
          <img src={gallery.imageUrl} alt={gallery.title} />
        </div>

        {/* 점수 */}
        <div className={styles.scoreBox}>
          <div className={styles.scoreHeader}>
            <span className={styles.info}>점수</span>
            <span className={styles.info}>{gallery.totalScore}/100</span>
          </div>

          <div className={styles.bar}>
            <span className={styles.score_info1}>정렬</span>
            <div className={styles.progressWrapper}>
              <div
                className={`${styles.progressFill} ${styles.progressAlignment}`}
                style={{ width: `${gallery.alignmentScore}%` }}
              />
            </div>
            <span className={styles.score_info2}>{gallery.alignmentScore}</span>
          </div>

          <div className={styles.bar}>
            <span className={styles.score_info1}>간격</span>
            <div className={styles.progressWrapper}>
              <div
                className={`${styles.progressFill} ${styles.progressSpacing}`}
                style={{ width: `${gallery.spacingScore}%` }}
              />
            </div>
            <span className={styles.score_info2}>{gallery.spacingScore}</span>
          </div>

          <div className={styles.bar}>
            <span className={styles.score_info1}>일관성</span>
            <div className={styles.progressWrapper}>
              <div
                className={`${styles.progressFill} ${styles.progressConsistency}`}
                style={{ width: `${gallery.consistencyScore}%` }}
              />
            </div>
            <span className={styles.score_info2}>
              {gallery.consistencyScore}
            </span>
          </div>

          <div className={styles.bar}>
            <span className={styles.score_info1}>길이</span>
            <div className={styles.progressWrapper}>
              <div
                className={`${styles.progressFill} ${styles.progressLength}`}
                style={{ width: `${gallery.lengthScore}%` }}
              />
            </div>
            <span className={styles.score_info2}>{gallery.lengthScore}</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DetailPage;
