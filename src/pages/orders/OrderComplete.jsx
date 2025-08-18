import React from "react";
import style from "../../CSS/OrderComplete.module.css"; // CSS는 아래 예시 참고

export default function OrderComplete({ orderData, onClose }) {
  if (!orderData) return null;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <button className={style.closeButton} onClick={onClose}>×</button>

        <div className={style.header}>
          <h1>주문 완료 🎉</h1>
        </div>

        <div className={style.orderInfo}>
          <div><strong>주문번호:</strong> {orderData.order_id}</div>
          <div><strong>유저 ID:</strong> {orderData.user_id}</div>
          <div><strong>공구방 ID:</strong> {orderData.room_id}</div>
          <div><strong>총 금액:</strong> {orderData.total_price?.toLocaleString()}원</div>
          <div><strong>주문일자:</strong> {orderData.created_at ? formatDateTime(orderData.created_at) : "정보 없음"}</div>
        </div>

        <div className={style.orderItems}>
          {orderData.room_order && orderData.room_order.length > 0 ? (
            orderData.room_order.map((item, idx) => (
              <div key={idx} className={style.orderItem}>
                <span>{item.menu_name || item.name}</span>
                <span>{item.quantity}개</span>
                <span>{((item.menu_price || item.price) * item.quantity).toLocaleString()}원</span>
              </div>
            ))
          ) : (
            <div>주문 항목이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
