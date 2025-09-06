import styles from "./Header.module.css";
import { useProfile } from "../../hooks/useProfile";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { profile } = useProfile();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.brand}>
          <div className={styles.title}>禮仁</div>
          <div className={styles.slogan}>조용히 쓰고, 크게 성장하다</div>
        </div>
        <div className={styles.profile} onClick={() => navigate("/profile")}>
          {profile?.profileImageUrl ? (
            <img src={profile.profileImageUrl} alt="프로필" className={styles.profileImg}/>
          ) : (
            <span className={styles.profileFallback}>👤</span>
          )}
        </div>
      </div>
    </header>
  );
}
