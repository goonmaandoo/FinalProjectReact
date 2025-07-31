import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../../CSS/OrderComplete.module.css"; // 기존 CSS 유지

const OrderComplete = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
        setOrderData(response.data);
      } catch (error) {
        console.error("주문 정보 불러오기 실패:", error);
        alert("주문 정보를 불러오지 못했습니다.");
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!orderData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className={style["order-container"]}>
      <h2>주문 완료 🎉</h2>
      <p>주문번호: {orderData.orderId}</p>
      <p>총 금액: {orderData.totalPrice.toLocaleString()}원</p>

      <div className={style["order-items"]}>
        <h4>주문 내역</h4>
        {orderData.roomOrder.items.map((item, idx) => (
          <div key={idx} className={style["order-item"]}>
            <span>{item.menu_name}</span>
            <span>{item.menu_price.toLocaleString()}원</span>
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/mainpage")}>메인으로 돌아가기</button>
    </div>
  );
};

export default OrderComplete;
