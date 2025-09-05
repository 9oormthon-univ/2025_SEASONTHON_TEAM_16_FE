import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <NavLink
        to="/pet"
        className={({ isActive }) =>
          `${styles.footerItem} ${isActive ? styles.active : ""}`
        }
      >
        {({ isActive }) => (
          <div className={isActive ? styles.activeCircle : ""}>
            <img src="/assets/icons/pet.svg" alt="펫" className={styles.icon} />
            <span className={styles.name}>펫</span>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/transcription"
        className={({ isActive }) =>
          `${styles.footerItem} ${isActive ? styles.active : ""}`
        }
      >
        {({ isActive }) => (
          <div className={isActive ? styles.activeCircle : ""}>
            <img
              src="/assets/icons/transcription.svg"
              alt="필사하기"
              className={styles.icon}
            />
            <span className={styles.name}>필사하기</span>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${styles.footerItem} ${isActive ? styles.active : ""}`
        }
      >
        {({ isActive }) => (
          <div className={isActive ? styles.activeCircle : ""}>
            <img
              src="/assets/icons/home.svg"
              alt="홈"
              className={styles.icon}
            />
            <span className={styles.name}>홈</span>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/gallery"
        className={({ isActive }) =>
          `${styles.footerItem} ${isActive ? styles.active : ""}`
        }
      >
        {({ isActive }) => (
          <div className={isActive ? styles.activeCircle : ""}>
            <img
              src="/assets/icons/gallery.svg"
              alt="갤러리"
              className={styles.icon}
            />
            <span className={styles.name}>갤러리</span>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/community"
        className={({ isActive }) =>
          `${styles.footerItem} ${isActive ? styles.active : ""}`
        }
      >
        {({ isActive }) => (
          <div className={isActive ? styles.activeCircle : ""}>
            <img
              src="/assets/icons/community.svg"
              alt="커뮤니티"
              className={styles.icon}
            />
            <span className={styles.name}>커뮤니티</span>
          </div>
        )}
      </NavLink>
    </div>
  );
};

export default Footer;
