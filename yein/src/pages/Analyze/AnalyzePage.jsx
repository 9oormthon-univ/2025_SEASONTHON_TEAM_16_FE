import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import styles from "./AnalyzePage.module.css";
import bg from "../../assets/bg.png";

function ScoreBar({ label, value, max = 100 }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={styles.scoreItem} role="group" aria-label={`${label} 점수`}>
      <span className={styles.label}>{label}</span>
      <div className={styles.barWrapper} aria-hidden>
        <div
          className={styles.bar}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={styles.value} aria-label={`${value}점`}>{value}</span>
    </div>
  );
}

export default function AnalyzePage() {
  const { state } = useLocation();
  const [data, setData] = useState(() => state || null);

  useEffect(() => {
    console.log("analyze state:", state);
    if (state) {
      sessionStorage.setItem("analyze_state", JSON.stringify(state));
      setData(state);

    } else {
      const cached = sessionStorage.getItem("analyze_state");
      if (cached) setData(JSON.parse(cached));
    }
  }, [state]);

  if (!data) return <div>결과 데이터가 없습니다.</div>;

  return (
    <div className={styles.container} style={{ backgroundImage: "url(/assets/images/bg_home.svg)" }}>
      <Header />
      <div className={styles.Title}>AI 분석 결과</div>
      {data.image && (
        <img
          src={data.image}
          alt="분석 이미지"
          style={{
            maxWidth: 334,
            width: "100%",
            height: 185,
            display: "block",
            margin: "16px auto",
            border: "1px solid #ddd",
            borderRadius: 12,
          }}
        />
      )}


      {/* 점수 섹션 */}
      <div className={styles.scoresSection}>
        <div className={styles.totalScore}>
          <span>점수</span>
          <span>{data.totalScore}/100</span>
        </div>

        <ScoreBar label="정렬"   value={data.alignmentScore} color="#9CA3AF"/>
        <ScoreBar label="간격"   value={data.spacingScore} color="#A0BCEF"/>
        <ScoreBar label="일관성" value={data.consistencyScore} color="#D8D3F4"/>
        <ScoreBar label="길이"   value={data.lengthScore} color="#EFC7D8"/>
      </div>

      {/* 스크롤 되는 분석 박스 */}
      <div className={styles.analysisBox}>
        <h4>AI 피드백</h4>
        <p>{data.feedback}</p>

        <h4>강점</h4>
        <p>{data.strengths}</p>
        <h4>상세 분석</h4>
        <p>{data.detailedAnalysis}</p>
      </div>

      <Footer />
    </div>
  );
}
