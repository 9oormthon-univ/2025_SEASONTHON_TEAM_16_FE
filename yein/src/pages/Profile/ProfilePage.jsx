import { useEffect, useState } from "react";
import Footer from "../../components/common/Footer";
import ProgressBar from "../../components/common/ProgressBar";
import styles from "./ProfilePage.module.css";
import { getMyProfile, getMyPet, logout } from "../../api/user";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ProfilePage.jsx (발췌)
useEffect(() => {
  async function fetchData() {
    try {
      const [me, petRes] = await Promise.all([ getMyProfile(), getMyPet() ]);

      // 프로필은 그대로
      setProfile(me?.data ?? me);

      // ✅ /api/pets/me 의 data를 화면용으로 정규화
      const raw = petRes?.data ?? petRes;
      const xp    = Number(raw?.currentXp);
      const goal  = Number(raw?.xpToNextLevel);

      const normalizedPet = {
        level: Number(raw?.level ?? 1),
        experience: xp,                            // 현재 XP
        xpToNextLevel: goal,                       // 다음 레벨까지 총 필요 XP
        remainingXp: Math.max(0, goal - xp),       // 남은 XP
        experiencePercent: goal > 0
          ? Math.min(100, Math.round((xp / goal) * 100))
          : 0,
        petType: raw?.petType ?? "DEFAULT",
        evolutionStage: Number(raw?.evolutionStage ?? 0),
      };

      setPet(normalizedPet);
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
      window.location.href = "/login"; // 로그아웃 후 이동
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
              <img src={profile.profileImageUrl} alt="프로필" className={styles.profileImg}/>
                ) : (
                  <span className={styles.profileFallback}>👤</span>
                )}
          </div>
          <button className={styles.editBtn} aria-label="프로필 사진 수정">
            ✎
          </button>
        </div>
        <div className={styles.userName}>{profile.name}</div>
        <div className={styles.levelInfo}>
          <span className={styles.levelTag}>Lv. {pet.level}</span>
          <span className={styles.xpTag}>XP: {pet.experience}</span>
        </div>
        <ProgressBar value={pet.experiencePercent} />
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
          <button className={styles.menuCard} onClick={() => navigate("/transcription")}>추천 글귀</button>
          <button className={styles.menuCard} onClick={() => navigate("/")}>스크랩한 글귀</button>
          <button className={styles.menuCard} onClick={() => navigate("/")}>내가 쓴 댓글</button>
          <button className={styles.menuCard} onClick={() => navigate("/")}>작성한 게시물</button>
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
