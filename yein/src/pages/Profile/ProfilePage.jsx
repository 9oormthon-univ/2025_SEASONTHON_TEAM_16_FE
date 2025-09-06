import { useEffect, useState } from "react";
import Footer from "../../components/common/Footer";
import ProgressBar from "../../components/common/ProgressBar";
import styles from "./ProfilePage.module.css";
import { getMyProfile, logout } from "../../api/user";
import { getPetStatus } from "../../api/pet";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // 프로필 + 펫 동시 요청
        const [me, petRes] = await Promise.all([
          getMyProfile(),
          getPetStatus(),
        ]);

        setProfile(me);

        // ✅ 펫 데이터 정규화
        const xp = Number(petRes?.currentXp ?? 0);
        const goal = Number(petRes?.xpToNextLevel ?? 100);

        setPet({
          name: petRes?.name ?? "나의 펫",
          level: Number(petRes?.level ?? 1),
          currentXp: xp,
          xpToNextLevel: goal,
          remainingXp: Math.max(0, goal - xp),
          experiencePercent: goal > 0 ? Math.round((xp / goal) * 100) : 0,
          petType: petRes?.petType ?? "DEFAULT",
          evolutionStage: Number(petRes?.evolutionStage ?? 1),
        });
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          window.location.replace("/login?error=unauthorized");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("로그아웃 실패:", err);
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  if (loading) return <div>로딩중...</div>;
  if (!profile || !pet) return <div>데이터 없음</div>;

  return (
    <div className={styles.container}>
      {/* 상단 프로필 */}
      <section className={styles.profileSection}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {profile?.profileImageUrl ? (
              <img
                src={profile.profileImageUrl}
                alt="프로필"
                className={styles.profileImg}
              />
            ) : (
              <span className={styles.profileFallback}>👤</span>
            )}
          </div>
          <button className={styles.editBtn} aria-label="프로필 사진 수정">
            ✎
          </button>
        </div>
        <div className={styles.userName}>{profile.name}</div>

        {/* ✅ 펫 레벨 / 경험치 */}
        <div className={styles.levelInfo}>
          <span className={styles.levelTag}>Lv. {pet.level}</span>
          <span className={styles.xpTag}>
            XP: {pet.currentXp} / {pet.xpToNextLevel}
          </span>
        </div>
        <ProgressBar
          currentXp={pet.currentXp}
          xpToNextLevel={pet.xpToNextLevel}
        />
        <p className={styles.progressHint}>
          레벨 업까지 앞으로 {pet.remainingXp} 경험치가 남았어요!
        </p>
      </section>

      {/* 이메일 */}
      <section className={styles.emailSection}>
        <span className={styles.emailLabel}>✉ email</span>
        <span className={styles.emailValue}>{profile.email}</span>
      </section>

      {/* 통계 */}
      <section className={styles.statsSection}>
        <div className={styles.statRow}>
          <span>오늘 필사</span>
          <span className={styles.statValue}>
            {profile?.todayGalleries ?? 0}
          </span>
        </div>
      </section>
      <section className={styles.statsSection}>
        <div className={styles.statRow}>
          <span>총 필사 수</span>
          <span className={styles.statValue}>
            {profile?.totalGalleries ?? 0}
          </span>
        </div>
      </section>
      <section className={styles.statsSection}>
        <div className={styles.statRow}>
          <span>전체 필사 평균</span>
          <span className={styles.statValue}>
            {(profile?.averageHandwritingScore ?? 0).toFixed(1)}
          </span>
        </div>
      </section>

      {/* 네비게이션 카드 */}
      <section className={styles.menuSection}>
        <div className={styles.menuGrid}>
          <button
            className={styles.menuCard}
            onClick={() => navigate("/transcription")}
          >
            추천 글귀
          </button>
          <button className={styles.menuCard} onClick={() => navigate("/")}>
            스크랩한 글귀
          </button>
          <button className={styles.menuCard} onClick={() => navigate("/")}>
            내가 쓴 댓글
          </button>
          <button className={styles.menuCard} onClick={() => navigate("/")}>
            작성한 게시물
          </button>
        </div>
      </section>

      {/* 하단 버튼 */}
      <section className={styles.bottomActions}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          로그아웃
        </button>
      </section>

      <div className={styles.footerSpacer} />
      <Footer />
    </div>
  );
};

export default ProfilePage;
