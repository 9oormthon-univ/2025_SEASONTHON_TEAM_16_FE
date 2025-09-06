import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default Header;
