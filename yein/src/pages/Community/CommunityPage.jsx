import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CommunityPage.module.css";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { getPosts } from "../../api/post";

const CommunityPage = () => {
  const [bestPosts, setBestPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      // 주간 Best (조회수 기준 상위 3개)
      const bestData = await getPosts({
        sortBy: "view",
        page: 0,
        size: 3,
      });
      setBestPosts(bestData.content || []);

      // 최신 게시물 (최신순 5개, 검색 적용)
      const latestData = await getPosts({
        sortBy: "latest",
        page: 0,
        size: 5,
        keyword: keyword || "",
      });
      setLatestPosts(latestData.content || []);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchPosts();
  };

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
        <h2 className={styles.pageTitle}>커뮤니티</h2>

        {/* 검색창 */}
        <form className={styles.searchBar} onSubmit={handleSearch}>
          <img
            src="/assets/icons/search.svg"
            alt="검색"
            className={styles.searchIcon}
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        {/* 주간 Best */}
        <section className={styles.section}>
          <ul className={styles.bestList}>
            <div className={styles.subTitleWrapper}>
              <h3 className={styles.subTitle}>주간 Best</h3>
              <img
                src="/assets/icons/double_arrow.svg"
                alt="더보기"
                className={styles.moreIcon}
              />
            </div>
            {bestPosts.map((post, index) => (
              <li key={post.id} className={styles.bestItem}>
                <span className={styles.rank}>{index + 1}위</span>
                <div className={styles.textBox}>
                  <p className={styles.title}>{post.title}</p>
                  <p className={styles.info}>
                    {post.bookTitle} / {post.author}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 최근 게시물 */}
        <section className={styles.section}>
          <h3 className={styles.subTitle}>최근 게시물</h3>
          <ul className={styles.postList}>
            {latestPosts.map((post) => (
              <li key={post.id} className={styles.postCard}>
                <h4 className={styles.title}>{post.title}</h4>
                <img
                  src="/assets/icons/bookmark.svg"
                  alt="스크랩"
                  className={styles.bookmarkIcon}
                />
                <p className={styles.author}>
                  {post.bookTitle} / {post.author}
                </p>
                <p className={styles.quote}>{post.quote}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 버튼 영역 */}
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${styles.myPosts}`}
            onClick={() => navigate("/myposts")}
          >
            내가 쓴 글
          </button>
          <button
            className={`${styles.button} ${styles.createPost}`}
            onClick={() => navigate("/post/create")}
          >
            글쓰기
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityPage;
