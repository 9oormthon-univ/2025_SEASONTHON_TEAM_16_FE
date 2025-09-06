import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/common/Footer";
import Header from "../../components/Header";
import MoodSelector from "../../components/MoodSelector";
import styles from "./Transcription.module.css";

export default function TranscriptionPage() {
  const navigate = useNavigate();

  const [tip] = useState("필사 팁: 조급해하지 말고 천천히 써서 마음을 담아봐요.");
  const [rec, setRec] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 이미지 관련 상태
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);            // blob: URL
  const [imageDataUrl, setImageDataUrl] = useState(null);  // data:
  const [isDragging, setIsDragging] = useState(false);
  const objectUrlRef = useRef(null);

  // 입력값
  const [title, setTitle] = useState("");
  const [moods, setMoods] = useState([]); // 다중 선택

  const API_BASE =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
    process.env.REACT_APP_API_BASE ||
    "https://yein.duckdns.org";

  // ✅ 진입 가드: 토큰 없으면 로그인으로
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login?error=login_required", { replace: true });
    }
  }, [navigate]);

  // 파일 선택/드랍 시 미리보기 & dataURL 준비
  const setPreviewFromFile = (f) => {
    if (!f || !f.type?.startsWith("image/")) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

    const url = URL.createObjectURL(f);
    objectUrlRef.current = url;
    setFile(f);
    setPreview(url);

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result); // base64 dataURL
    reader.readAsDataURL(f);
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setPreviewFromFile(f);
  };

  // DnD
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    setPreviewFromFile(f);
  };

  // ✅ 추천 문구 (인증 포함)
  useEffect(() => {
    const token = localStorage.getItem("access_token") || "";
    fetch("https://yein.duckdns.org/api/recommendations/today", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "omit",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const sentence = data?.data?.quote;
        setRec(sentence ? `“${sentence}”` : "추천 문구 없음");
      })
      .catch((err) => {
        console.error("추천문구 불러오기 실패:", err);
        setError("추천 문구를 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));

    // 언마운트 시 blob URL 정리
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  // ✅ 제출 (access_token 사용으로 통일)
  const handleSubmit = async () => {
    try {
      if (!file) throw new Error("이미지 파일이 없습니다.");
      if (!title.trim()) throw new Error("제목을 입력해 주세요.");

      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      const form = new FormData();
      form.append("image", file, file.name);

      const payload = {
        title: title.trim(),
        moods, // ["calm","happy"] ...
        quote: rec?.replace(/[“”]/g, "") || null,
      };

      // 서버가 multipart에서 JSON 파트를 기대하는 경우
      form.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      // (문자열만 받는다면) form.append("data", JSON.stringify(payload));

      const res = await fetch(`${API_BASE.replace(/\/$/, "")}/api/handwriting/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          alert("인증이 필요합니다. 다시 로그인해 주세요.");
        }
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const result = await res.json();

      navigate("/analyze", {
        state: {
          ...(result?.data || {}),
          image: imageDataUrl || preview, // dataURL 우선
        },
      });
    } catch (e) {
      console.error("제출 실패:", e);
      alert(e.message || "요청 실패");
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: "url(/assets/images/bg_home.svg)" }}>
      <Header />

      <section className={styles.reco}>
        <div className={styles.recoTitle}>오늘의 필사하기</div>
        <div className={styles.recoLabel}>오늘의 추천문구</div>
        {loading && <div>불러오는 중...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && <div className={styles.recoSentence}>{rec}</div>}
        <div className={styles.recoUnderline} />
      </section>

      {/* 감정 다중선택 */}
      <MoodSelector initial={[]} onChange={setMoods} />

      <div className={styles.tip}>{tip}</div>

      {/* 제목 */}
      <div className={styles.formRow}>
        <label className={styles.label} htmlFor="title"></label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          placeholder="예: 오늘의 필사"
        />
      </div>

      {/* 업로드(드래그/클릭) */}
      <div
        className={`${styles.upload} ${isDragging ? styles.dragging : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="uploadInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />
        <label htmlFor="uploadInput" className={styles.uploadLabel} aria-label="이미지 업로드">
          {preview ? (
            <img src={preview} className={styles.preview} alt="업로드 미리보기" />
          ) : (
            <span className={styles.uploadText}>여기로 이미지를 드래그하거나 클릭해서 선택하세요</span>
          )}
        </label>
      </div>

      <button className={styles.submit} disabled={!file} onClick={handleSubmit}>
        완료하기
      </button>

      <Footer />
    </div>
  );
}
