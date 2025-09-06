// components/MoodSelector.jsx (다중 선택)
import { useState } from "react";
import styles from "./MoodSelector.module.css";

const MOODS = [
  { key: "calm",  label: "평온" },
  { key: "joy", label: "기쁨" },
  { key: "depressed",   label: "우울" },
];

export default function MoodSelector({ initial = [], onChange }) {
  // initial: string[]  예) ["calm","happy"]
  const [selected, setSelected] = useState(new Set(initial));

  const toggle = (k) => {
    const next = new Set(selected);
    if (next.has(k)) next.delete(k);
    else next.add(k);                         // 원하는 경우 최대 갯수 제한도 가능
    setSelected(next);
    onChange?.(Array.from(next));             // 배열로 부모에 전달
  };

  return (
    <div className={styles.wrap} role="group" aria-label="감정 선택(복수)">
      {MOODS.map(({ key, label }) => {
        const isSel = selected.has(key);
        return (
          <button
            key={key}
            type="button"
            className={`${styles.btn} ${styles[key]} ${isSel ? styles.selected : ""}`}
            aria-pressed={isSel}
            onClick={() => toggle(key)}
            title={label}
          >
            <span className={styles.icon} aria-hidden>☺</span>
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
