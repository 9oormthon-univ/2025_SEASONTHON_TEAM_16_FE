// src/components/home/BestPostCard.jsx
import { useEffect, useRef, useState } from "react";
import styles from "./BestPostCard.module.css";
import { resolveImageUrl } from "../../api/imgUrl";
import { fetchImageObjectUrl } from "../../api/fetchImg";

export default function BestPostCard({
  title = "게시글 제목",
  thumbnail,            // 문자열 URL(상대/절대)
  protectedImage = false, // 인증 필요하면 true
  onClick,
}) {
  const [imgSrc, setImgSrc] = useState("");
  const revokeRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 이미지가 없으면 종료
      if (!thumbnail) return setImgSrc("");

      const abs = resolveImageUrl(thumbnail);

      // 인증 필요 없으면 바로 사용
      if (!protectedImage) {
        setImgSrc(abs);
        return;
      }

      // 인증 필요한 경우: blob + objectURL
      try {
        const token = localStorage.getItem("access_token");
        const url = await fetchImageObjectUrl(abs, token);
        if (!cancelled) {
          setImgSrc(url);
          revokeRef.current = url; // unmount 시 revoke
        }
      } catch (e) {
        console.error("이미지 로드 실패:", e);
        setImgSrc("");
      }
    })();

    return () => {
      cancelled = true;
      if (revokeRef.current) {
        URL.revokeObjectURL(revokeRef.current);
        revokeRef.current = null;
      }
    };
  }, [thumbnail, protectedImage]);

  return (
    <button className={styles.postCard} type="button" onClick={onClick}>
      <div className={styles.postThumb}>
        {imgSrc ? (
          <img src={imgSrc} alt={title} className={styles.thumbImg} />
        ) : (
          <span className={styles.imgPlaceholder} />
        )}
      </div>
      <div className={styles.postTitle}>{title}</div>
    </button>
  );
}
