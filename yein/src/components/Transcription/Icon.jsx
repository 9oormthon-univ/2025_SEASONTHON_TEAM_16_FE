import React from "react";
import styles from "./Icon.module.css";

export default function Icon({ name, alt = "", size = 24 }) {
  const src = `/assets/icons/${name}.svg`;
  return (
    <img
      src={src}
      alt={alt}
      className={styles.icon}
      style={{ width: size, height: size }}
      aria-hidden={alt === ""}
    />
  );
}