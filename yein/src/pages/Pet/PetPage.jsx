import { useState, useEffect } from "react";
import styles from "./PetPage.module.css";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import { getPetStatus, updatePetType } from "../../api/pet";

// 동물별 이미지 (evolutionStage 1~3)
const petImages = {
  PUPPY: [
    "/assets/images/puppy1.svg",
    "/assets/images/puppy2.svg",
    "/assets/images/puppy3.svg",
  ],
  CAT: [
    "/assets/images/cat1.svg",
    "/assets/images/cat2.svg",
    "/assets/images/cat3.svg",
  ],
  RABBIT: [
    "/assets/images/rabbit1.svg",
    "/assets/images/rabbit2.svg",
    "/assets/images/rabbit3.svg",
  ],
  BEAR: [
    "/assets/images/bear1.svg",
    "/assets/images/bear2.svg",
    "/assets/images/bear3.svg",
  ],
  MOUSE: [
    "/assets/images/mouse1.svg",
    "/assets/images/mouse2.svg",
    "/assets/images/mouse3.svg",
  ],
};

// 기본 이름 매핑
const petNames = {
  PUPPY: "강아지",
  CAT: "고양이",
  RABBIT: "토끼",
  BEAR: "곰",
  MOUSE: "쥐",
};

// 서버 ↔ 클라 매핑
const serverToClientPetType = {
  DEFAULT: "PUPPY",
  TYPE_1: "CAT",
  TYPE_2: "RABBIT",
  TYPE_3: "BEAR",
  TYPE_4: "MOUSE",
};

const clientToServerPetType = {
  PUPPY: "DEFAULT",
  CAT: "TYPE_1",
  RABBIT: "TYPE_2",
  BEAR: "TYPE_3",
  MOUSE: "TYPE_4",
};

const getNextEvolutionLevel = (level) => {
  if (level >= 30) return "MAX";
  if (level >= 20) return 30;
  if (level >= 10) return 20;
  return 10;
};

const PetPage = () => {
  const [currentPet, setCurrentPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const pet = await getPetStatus();
        setCurrentPet(pet);
      } catch (err) {
        console.error("펫 상태 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectPet = async (clientType) => {
    try {
      const serverType = clientToServerPetType[clientType];
      const updatedPet = await updatePetType(serverType);
      setCurrentPet(updatedPet);
    } catch (err) {
      console.error("펫 종류 변경 실패:", err);
      alert("펫 변경 실패");
    }
  };

  if (loading) return <p>불러오는 중...</p>;
  if (!currentPet) return <p>펫 정보 없음</p>;

  const clientType = serverToClientPetType[currentPet.petType] || "PUPPY";

  const petImgs = petImages[clientType] || [];
  const petImg =
    petImgs[(currentPet.evolutionStage || 1) - 1] || "/assets/icons/puppy1.svg";

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

      {/* 현재 펫 */}
      <section className={styles.currentPet}>
        <img src={petImg} alt="현재 펫" className={styles.currentPetImg} />
        <div className={styles.petName}>[ {currentPet.name} ]</div>
        <div className={styles.petInfo}>
          <div className={styles.info}>
            <p className={styles.detail}>Lv.</p>
            <p className={styles.detail}>{currentPet.level}</p>
          </div>
          <div className={styles.info}>
            <p className={styles.detail}>XP</p>
            <p className={styles.detail}>
              {currentPet.currentXp} / {currentPet.xpToNextLevel}
            </p>
          </div>
          <div className={styles.info}>
            <p className={styles.detail}>진화 예정 레벨</p>
            <p className={styles.detail}>
              {getNextEvolutionLevel(currentPet.level)}
            </p>
          </div>
        </div>
      </section>

      {/* 선택 가능한 펫 목록 */}
      <section className={styles.petList}>
        {Object.keys(petImages).map((type) => {
          const images = petImages[type];
          const previewImg = images[0]; // Lv1 이미지

          return (
            <div
              key={type}
              className={`${styles.petCard} ${
                styles[`petCard_${type.toLowerCase()}`]
              }`}
            >
              <button
                className={`${styles.selectBtn} ${
                  clientType === type ? styles.selectedBtn : ""
                }`}
                onClick={() => handleSelectPet(type)}
              >
                선택하기
              </button>

              <img
                src={previewImg}
                alt={petNames[type]}
                className={`${styles.petCardImg} ${
                  styles[`img_${type.toLowerCase()}`]
                }`}
              />
            </div>
          );
        })}
      </section>

      <Footer />
    </div>
  );
};

export default PetPage;
