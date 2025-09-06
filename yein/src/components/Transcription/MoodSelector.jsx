// components/MoodSelector.jsx
import { useState, useMemo } from "react";
import styles from "./MoodSelector.module.css";
import Icon from "./Icon";

const MOODS = [
  {
    key: "calm",
    label: "평온",
    icon: "sentiment_calm",     
    iconSelected: "sentiment_calm",
  },
  {
    key: "joy",
    label: "기쁨",
    icon: "sentiment_excited",
    iconSelected: "sentiment_excited",
  },
  {
    key: "depressed",
    label: "우울",
    icon: "sentiment_sad",
    iconSelected: "sentiment_sad",
  },
];

export default function MoodSelector({ initial = [], onChange }) {
  const [selected, setSelected] = useState(() => new Set(initial));

  const toggle = (key) => {
    const next = new Set(selected);
    next.has(key) ? next.delete(key) : next.add(key);
    setSelected(next);
    onChange?.(Array.from(next));
  };

  const groupLabel = useMemo(() => {
    const labels = MOODS.filter(m => selected.has(m.key)).map(m => m.label);
    return labels.length ? `선택됨: ${labels.join(", ")}` : "감정 선택(복수)";
  }, [selected]);

  return (
    <div className={styles.wrap} role="group" aria-label={groupLabel}>
      {MOODS.map(({ key, label, icon, iconSelected }) => {
        const isSel = selected.has(key);
        const iconName = isSel && iconSelected ? iconSelected : icon;
        return (
          <button
            key={key}
            type="button"
            className={`${styles.btn} ${styles[key]} ${isSel ? styles.selected : ""}`}
            aria-pressed={isSel}
            onClick={() => toggle(key)}
            title={label}
          >
            <Icon name={iconName} alt="" size={28} />

          </button>
        );
      })}
    </div>
  );
}
