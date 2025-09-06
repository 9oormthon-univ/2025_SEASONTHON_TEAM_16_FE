import { useState } from "react";
import styles from "./PetPage.module.css";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";

const pets = [
  { id: 1, name: "멍멍이", level: 1, img: "/assets/images/puppy1.svg" },
  { id: 2, name: "멍멍이", level: 2, img: "/assets/images/puppy2.svg" },
  { id: 3, name: "멍멍이", level: 3, img: "/assets/images/puppy3.svg" },
];

const PetPage = () => {
  const [currentPet, setCurrentPet] = useState(pets[0]); // 기본 펫 1번

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

      <section className={styles.currentPet}>
        <img
          src={currentPet.img}
          alt="현재 펫"
          className={styles.currentPetImg}
        />
        <div
          className={`${styles.floor} ${
            currentPet.id === 1
              ? styles.floor1
              : currentPet.id === 2
              ? styles.floor2
              : styles.floor3
          }`}
        ></div>
        <div className={styles.petName}>[ {currentPet.name} ]</div>
        <div className={styles.petInfo}>
          <div className={styles.info}>
            <p className={styles.detail}>Lv.</p>{" "}
            <p className={styles.detail}> {currentPet.level}</p>
          </div>
          <div className={styles.info}>
            <p className={styles.detail}>XP</p>{" "}
            <p className={styles.detail}>2500 / 3000</p>
          </div>
          <div className={styles.info}>
            <p className={styles.detail}>진화 예정 레벨</p>{" "}
            <p className={styles.detail}>Lv. 10</p>
          </div>
        </div>
      </section>

      <section className={styles.petList}>
        {pets.map((pet) => (
          <div key={pet.id} className={styles.petCard}>
            <img src={pet.img} alt={pet.name} className={styles.petCardImg} />
            <div className={styles.cardName}>
              [ {pet.name} ] Lv.{pet.level}
            </div>
            <button
              className={styles.selectBtn}
              onClick={() => setCurrentPet(pet)}
            >
              선택하기
            </button>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default PetPage;
