import styles from "../../../CSS/MyPage.module.css";

export default function GaugeBar({ value = 0 }) {
  const safeValue = Math.min(Math.max(value, 0), 100);

  let fillColor = "#ff6b6b";
  // if (safeValue < 30) fillColor = "#f44336"; // 빨강
  // else if (safeValue < 80) fillColor = "#ffeb3b"; // 노랑

  return (
    <div
      className={styles.gaugeBar}
      aria-label={`Progress: ${safeValue}%`}
      role="progressbar"
    >
      <div
        className={styles.gaugeFill}
        style={{ width: `${safeValue}%`, backgroundColor: fillColor }}
      ></div>
      <span className={styles.gaugeText}>{safeValue}%</span>
    </div>
  );
}
