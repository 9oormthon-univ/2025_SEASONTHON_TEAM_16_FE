import { useNavigate } from "react-router-dom";
import styles from "./StartButton.module.css"

export default function StartButton() {
  const navigate = useNavigate();

  const handleClick = () => {
    const token = localStorage.getItem("app_token");
    if (token) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <button onClick={handleClick} className={styles.startButton}>
      필사 시작하기
    </button>
  );
}
