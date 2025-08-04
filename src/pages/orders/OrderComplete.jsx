import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../CSS/OrderComplete.module.css";

const OrderComplete = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/getTheOrder/${orderId}`);
        setOrderData(response.data);
      } catch (error) {
        console.error("주문 정보 불러오기 실패:", error);
        alert("주문 정보를 불러오지 못했습니다.");
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!orderData) {
    return <div className={styles.container}>로딩 중...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <i className="fas fa-check-circle"></i>
        <h1>주문 완료 🎉</h1>
      </div>

      <div className={styles.orderInfo}>
        <h2>주문 정보</h2>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>유저 ID: </span>
          <span className={styles.infoValue}>{orderData.userId}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>공구방 ID: </span>
          <span className={styles.infoValue}>{orderData.roomId}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>주문번호: </span>
          <span className={styles.infoValue}>{orderData.orderId}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>총 금액: </span>
          <span className={styles.infoValue}>
            {orderData.totalPrice?.toLocaleString()}원
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>주문일자: </span>
          <span className={styles.infoValue}>
            {orderData.createdAt ? formatDateTime(orderData.createdAt) : "정보 없음"}
          </span>
        </div>
      </div>

      <div className={styles.orderItems}>
        {orderData.roomOrder?.menu?.map((item, idx) => (
          <div className={styles.orderItem} key={idx}>
            <div>
              <span>{item.name}</span>
              <span className={styles.menu_quantity}>{item.count}개</span>
            </div>
            <div>{(item.price * item.count).toLocaleString()}원</div>
          </div>
        ))}
      </div>

      <div className={styles.total}>
        총 금액: {orderData.totalPrice?.toLocaleString()}원
      </div>

      <div className={styles.buttons}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => navigate("/mainpage")}>
          메인으로 돌아가기
        </button>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => navigate(-1)}>
          뒤로가기
        </button>
      </div>

      <div className={styles.notice}>
        주문이 완료되었습니다. 감사합니다!
      </div>
    </div>
  );
};

export default OrderComplete;
