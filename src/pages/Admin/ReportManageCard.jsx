import { useMemo, useState } from "react";
import styles from "../../CSS/admin/ReportManagement.module.css";

const STATUS_TEXT = {
  pending: "미응답",
  in_progress: "처리중",
  resolved: "처리완료",
  rejected: "반려",
};

export default function AdminReportCard({
  report,
  onTempBan,
  onPermanentBan,
  onReject,
  defaultExpanded = false,
}) {
  // 1) report가 null이어도 에러 안 나게 안전 디스트럭처링
  const {
    id,
    chatId,
    usersId,
    userId,
    reason,
    reportedBy,
    reportedAt,
    responseStatus,
    respondedAt,
    adminId,
    targetNickname,
    reporterNickname,
    chatPreview,
    roomNo,
  } = report || {};

  // 2) 모든 Hook은 조건문/early return보다 "위에" 둔다
  const [expanded, setExpanded] = useState(Boolean(defaultExpanded));

  const statusText = useMemo(() => {
    return STATUS_TEXT[responseStatus] ?? (responseStatus || "미응답");
  }, [responseStatus]);

  const pillClass = useMemo(() => {
    if (responseStatus === "resolved") return styles.pillGreen;
    if (responseStatus === "rejected") return styles.pillRed;
    if (responseStatus === "in_progress") return styles.pillOrange;
    return styles.pillPink; // pending or unknown
  }, [responseStatus]);

  const fmt = (v) => {
    if (!v) return "-";
    try {
      const d = v instanceof Date ? v : new Date(v);
      if (!isNaN(d)) return d.toLocaleString();
    } catch {}
    return String(v);
  };

  // 3) (선택) early return은 Hook들 "이후"에 둬야 안전
  if (!report) return null;

  const displayUserId = usersId ?? userId;

  return (
    <article className={`${styles.card} ${expanded ? styles.expanded : ""}`}>
      {/* 상단 요약 */}
      <div className={styles.topRow}>
        <div className={styles.metaGroup}>
          <div className={styles.metaTitle}>신고 번호</div>
          <div className={styles.metaValue}>{id}</div>
        </div>

        <div className={styles.metaGroup}>
          <div className={styles.metaTitle}>신고 대상</div>
          <div className={styles.metaValue}>
            {targetNickname ?? (displayUserId ? `#${displayUserId}` : "-")}
          </div>
        </div>

        <div className={`${styles.metaGroup} ${styles.metaRight}`}>
          <div className={styles.metaTitle}>
            신고자 :{" "}
            {reporterNickname ?? (reportedBy != null ? `#${reportedBy}` : "-")}{" "}
            <span className={`${styles.pill} ${pillClass}`}>{statusText}</span>
          </div>
          <div className={styles.metaSub}>
            신고 일시 : {fmt(reportedAt)}
            {respondedAt ? ` / 처리 : ${fmt(respondedAt)}` : ""}
          </div>
        </div>

        <div className={styles.actionsTop}>
          <button
            className={`${styles.btn} ${styles.btnOutline}`}
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "카드 접기" : "카드 펼치기"}
          >
            {expanded ? "접기" : "펼치기"}
          </button>
        </div>
      </div>

      {/* 상세 (펼침) */}
      {expanded && (
        <div className={styles.detail}>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>신고 내용</div>
            <div className={styles.detailBox}>
              {chatPreview ?? "(본문 없음)"}
            </div>
          </div>

          <div className={styles.detailRow}>
            <div className={`${styles.detailLabel} ${styles.labelEmph}`}>
              신고 사유
            </div>
            <div className={`${styles.detailBox}`}>{reason ?? "-"}</div>
          </div>

          <div className={styles.footerRow}>
            <div className={styles.roomInfo}>
              {roomNo != null ? (
                <>
                  공구방 번호 : <b>{roomNo}</b>
                </>
              ) : (
                <>&nbsp;</>
              )}
            </div>

            <div className={styles.actionBar}>
              <button
                className={`${styles.btn} ${styles.btnOutline}`}
                onClick={() => onReject?.(report)}
              >
                기각
              </button>
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={() => onTempBan?.(report)}
              >
                임시 정지
              </button>
              <button
                className={`${styles.btn} ${styles.btnRed}`}
                onClick={() => onPermanentBan?.(report)}
              >
                영구 정지
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
