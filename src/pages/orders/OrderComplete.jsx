import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../CSS/OrderComplete.module.css"; 

const OrderComplete = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/getTheOrder/${orderId}`)

        setOrderData(response.data);
      } catch (error) {
        console.error("주문 정보 불러오기 실패:", error);
        alert("주문 정보를 불러오지 못했습니다.");
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!orderData) {
    return <div className="container">로딩 중...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <i className="fas fa-check-circle"></i> {/* FontAwesome 필요 */}
        <h1>주문 완료 🎉</h1>
      </div>

      <div className="order-info">
        <h2>주문 정보</h2>
        <div className="info-row">
          <span className="info-label">주문번호</span>
          <span className="info-value">{orderData.orderId}</span>
        </div>
        <div className="info-row">
          <span className="info-label">총 금액</span>
          <span className="info-value">
            {orderData.totalPrice?.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="order-items">
        {orderData.roomOrder?.menu?.map((item, idx) => (
          <div className="order-item" key={idx}>
            <div>
              <span>{item.name}</span>
              <span className="menu_quantity">{item.count}개</span>
            </div>
            <div>{(item.price * item.count).toLocaleString()}원</div>
          </div>
        ))}
      </div>

      <div className="total">
        총 금액: {orderData.totalPrice?.toLocaleString()}원
      </div>

      <div className="buttons">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/mainpage")}
        >
          메인으로 돌아가기
        </button>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          뒤로가기
        </button>
      </div>

      <div className="notice">
        배달 예상 시간은 주문 접수 후 약 30분입니다.
      </div>
    </div>
  );
};

export default OrderComplete;
