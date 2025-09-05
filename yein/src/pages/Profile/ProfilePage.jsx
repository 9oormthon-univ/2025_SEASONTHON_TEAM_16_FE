import { useEffect, useState } from "react";
import Footer from "../../components/common/Footer";
import ProgressBar from "../../components/common/ProgressBar";
import styles from "./ProfilePage.module.css";
import { getMyProfile, getMyPet, logout, deleteAccount } from "../../api/user";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, petRes] = await Promise.all([
          getMyProfile(),
          getMyPet(),
        ]);
        setProfile(profileRes.data);
        setPet(petRes.data);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
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

  const handleDeleteAccount = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;
    try {
      await deleteAccount();
      localStorage.clear();
      window.location.href = "/signup"; // 탈퇴 후 이동
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
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
            <span className={styles.avatarIcon}>👤</span>
          </div>
          <button className={styles.editBtn} aria-label="프로필 사진 수정">
            ✎
          </button>
        </div>
        <div className={styles.userName}>{profile.nickname}</div>
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
          <span className={styles.statValue}>{profile.todayCopyCount}</span>
        </div>
        <div className={styles.statRow}>
          <span>총 필사 수</span>
          <span className={styles.statValue}>{profile.totalCopyCount}</span>
        </div>
        <div className={styles.statRow}>
          <span>전체 필사 평균</span>
          <span className={styles.statValue}>{profile.avgCopyCount}</span>
        </div>
      </section>

      {/* 네비게이션 카드 */}
      <section className={styles.menuSection}>
        <div className={styles.menuGrid}>
          <button className={styles.menuCard}>오늘 필사</button>
          <button className={styles.menuCard}>스크랩한 글귀</button>
          <button className={styles.menuCard}>내가 쓴 댓글</button>
          <button className={styles.menuCard}>작성한 게시물</button>
        </div>
      </section>

      {/* 하단 버튼 */}
      <section className={styles.bottomActions}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          로그아웃
        </button>
        <button className={styles.quitBtn} onClick={handleDeleteAccount}>
          회원 탈퇴
        </button>
      </section>

      <div className={styles.footerSpacer} />
      <Footer />
    </div>
  );
};

export default ProfilePage;
