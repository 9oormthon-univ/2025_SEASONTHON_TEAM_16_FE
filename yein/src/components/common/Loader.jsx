import styles from "./Loader.module.css";

export default function LoaderShapes({
  icons = [
    "/assets/loading/Default.svg",
    "/assets/loading/Variant2.svg",
    "/assets/loading/Variant3.svg",
    "/assets/loading/Variant4.svg",
    "/assets/loading/Variant5.svg",
    "/assets/loading/Variant6.svg",
  ],
  fullscreen = true,
  stepMs = 400,
  size = 72,
}) {

  const totalMs = icons.length * stepMs;

  return (
    <div className={fullscreen ? styles.overlay : styles.inline}>
      <div
        className={styles.stack}
        style={{ width: size, height: size }}
        aria-label="로딩 중"
        role="status"
      >
        {icons.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            aria-hidden
            className={styles.shape}
            style={{
              animationDuration: `${totalMs}ms`,
              animationDelay: `${i * stepMs}ms`,
            }}
          />
        ))}
      </div>
      <div className={styles.text} />
    </div>
  );
}
