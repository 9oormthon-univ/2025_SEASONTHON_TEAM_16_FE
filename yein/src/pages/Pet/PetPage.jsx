import styles from "./PetPage.module.css";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
const PetPage = () => {
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
      <Footer />
    </div>
  );
};

export default PetPage;
