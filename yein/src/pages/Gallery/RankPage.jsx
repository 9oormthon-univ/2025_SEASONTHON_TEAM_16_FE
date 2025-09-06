import { useEffect, useState } from "react";
import styles from "./RankPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getRankings } from "../../api/rank";

const RankPage = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRankings({
          page: 0,
          size: 50,
          period: "all",
          sortBy: "score_desc",
        });
        console.log("랭킹 API 응답:", data);
        setRankings(data.content || []);
      } catch (err) {
        console.error("랭킹 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>불러오는 중...</p>;
  if (!rankings.length) return <p>랭킹 데이터 없음</p>;

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
        <p className={styles.pageTitle}>필사 점수 랭킹</p>

        <ul className={styles.rankList}>
          {rankings.map((item, index) => (
            <li key={item.id} className={styles.rankItem}>
              <div className={styles.rankInfo}>
                <span className={styles.rankNumber}>{index + 1}.</span>
                <div className={styles.textBox}>
                  <p className={styles.bookTitle}>{item.title}</p>
                  <p className={styles.date}>
                    {item.createdAt
                      ? new Date(item.createdAt).toISOString().slice(0, 10)
                      : "-"}
                  </p>
                </div>
              </div>
              <span className={styles.score}>{item.totalScore}/100</span>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default RankPage;
