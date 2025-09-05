import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  const items = [
    { to: "/pet", icon: "/assets/icons/pet.svg", label: "펫" },
    {
      to: "/transcription",
      icon: "/assets/icons/transcription.svg",
      label: "필사하기",
    },
    { to: "/home", icon: "/assets/icons/home.svg", label: "홈" },
    { to: "/gallery", icon: "/assets/icons/gallery.svg", label: "갤러리" },
    {
      to: "/community",
      icon: "/assets/icons/community.svg",
      label: "커뮤니티",
    },
  ];

  return (
    <div className={styles.footer}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `${styles.footerItem} ${isActive ? styles.active : ""}`
          }
        >
          {({ isActive }) => (
            <div
              className={isActive ? styles.activeCircle : styles.inactiveCircle}
            >
              <img src={item.icon} alt={item.label} className={styles.icon} />
              <span className={styles.name}>{item.label}</span>
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default Footer;
