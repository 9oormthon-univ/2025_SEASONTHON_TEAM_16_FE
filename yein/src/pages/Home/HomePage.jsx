import React from "react";
import Footer from "../../components/Footer";
import styles from "./HomePage.module.css";

const HomePage = () => {
  return (
    <div className={styles.container}>
      <h1>Home</h1>
      <Footer />
    </div>
  );
};

export default HomePage;
