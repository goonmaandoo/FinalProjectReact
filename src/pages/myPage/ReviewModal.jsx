// ReviewModal.jsx
import React, { useState, useEffect } from "react";
import styles from "../../CSS/ReviewModal.module.css";

export default function ReviewModal({ open, onClose, order, onSubmit }) {
  const [score, setScore] = useState(5);
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (open) {
      setComments(""); //내용 초기값
      setScore(5); //평점 초기값
    }
  }, [open]);

  if (!open) return null;

  const orderSummary = (
    <div>
      <b>주문 메뉴:</b>
      <ul style={{ margin: 0, paddingLeft: 17 }}>
        {order.roomOrder && Array.isArray(order.roomOrder) ? (
          order.roomOrder.map((item, i) => (
            <li key={i}>
              {item.menu_name}
              {item.quantity > 1 ? ` ×${item.quantity}` : ""}
            </li>
          ))
        ) : (
          <li>알 수 없음</li>
        )}
      </ul>
    </div>
  );

  //  별점 선택
  const handleStarClick = (i) => setScore(i);

  // 제출 버튼 활성화 조건
  const canSubmit = score > 0 && comments.trim().length >= 5;

  return (
    open && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalBox}>
          <button className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
          <div className={styles.orderSummary}>{orderSummary}</div>
          <div
            style={{
              fontWeight: 600,
              marginTop: 4,
              fontSize: 18,
              textAlign: "center",
            }}
          >
            상품에 만족하셨나요?
          </div>
          <div className={styles.starArea}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                className={`${styles.starBtn} ${
                  score >= i ? styles.starSelected : ""
                }`}
                onClick={() => handleStarClick(i)}
                type="button"
                aria-label={`${i}점`}
              >
                ★
              </button>
            ))}
          </div>
          <div style={{ fontWeight: 600, marginTop: 2, marginBottom: 4 }}>
            어떤 점이 좋았나요?
          </div>
          <textarea
            className={styles.textArea}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="최소 5자 이상 입력해주세요."
            maxLength={5000}
          />
          <div className={styles.textGuide}>
            {comments.length < 5
              ? `리뷰를 5자 이상 입력해주세요. (${comments.length}/5)`
              : `${comments.length}/5000`}
          </div>
          <div className={styles.actionBar}>
            <button className={styles.cancelBtn} onClick={onClose}>
              취소
            </button>
            <button
              className={styles.submitBtn}
              onClick={onSubmit}
              disabled={!canSubmit}
            >
              등록
            </button>
          </div>
        </div>
      </div>
    )
  );
}
