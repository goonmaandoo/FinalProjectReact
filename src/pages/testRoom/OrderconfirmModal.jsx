import React, { useState, useEffect } from 'react';
import styles from './OrderConfirmModal.module.css';
import axios from 'axios';
import { makeOrder } from './roomFunction/makeOrder';
import { useSelector } from 'react-redux';

export default function OrderConfirmModal({
  user,
  visible,
  cart,
  totalPrice,
  userId,
  room,
  roomId,
  onSetOrderId,
  onComplete,   // 부모에서 전달될 콜백
  onClose,   // ← 반드시 추가
}) {
  const [cash, setCash] = useState(user?.cash || 0);
  const token = useSelector((s) => s.auth?.token);

  // 캐쉬 불러오기
  const fetchCash = async () => {
    if (!token) return;
    try {
      const res = await axios.get("/api/users/cash", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCash(Number(res.data) || 0);
    } catch (error) {
      console.error("캐쉬 조회 실패", error);
    }
  };

  useEffect(() => { fetchCash(); }, [token]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "CASH_CHARGED") fetchCash();
    };
    window.addEventListener("message", onMessage);
    return () => { window.removeEventListener("message", onMessage); };
  }, [token]);

  if (!visible) return null;

  const handleOrderConfirm = async () => {
    if (!room || !room.users) return;
    if (cart.length === 0) { alert('메뉴를 먼저 선택해주세요.'); return; }
    if (cash == null) { alert("캐시 정보를 불러오는 중입니다."); return; }
    if (cash < totalPrice) {
      alert('캐쉬 잔액이 부족합니다.');
      window.open("/cash/cashcharge", "_blank", "width=420,height=500");
      return;
    }

    const roomOrder = cart.map(item => ({
      id: item.id,
      img_id: item.imageId,
      quantity: item.quantity,
      store_id: item.storeId,
      menu_name: item.menuName,
      menu_price: item.menuPrice,
    }));

    const myOrder = { roomId, userId, storeId: room.storeId, roomOrder, totalPrice };

    try {
      // 1. 주문 생성
      const newOrderId = await makeOrder(myOrder);
      onSetOrderId(newOrderId);

      // 2. 캐시 차감
      await axios.post(
        '/api/users/cash/pay',
        { cash: totalPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("결제가 완료되었습니다.");

      // 3. 주문 완료 모달 표시 (DB 업데이트는 RoomTest에서)
      if (typeof onComplete === "function") onComplete();
      if (typeof onClose === "function") onClose(); // 안전하게 호출

      onClose(); // 주문 확인 모달 닫기
    } catch (error) {
      if (error.response) alert("결제 실패: " + error.response.data);
      else alert("서버 연결 실패");
      console.error('주문 처리 실패:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.confirmOrder}>
          <p className={styles.confrimTitle}>주문 확인</p>
        </div>

        <div className={styles.myCash}>내 캐쉬: {cash.toLocaleString()}원</div>

        <div className={styles.myMenu}>Menu</div>
        <div className={styles.orderList}>
          {cart.map(item => (
            <div key={item.id} className={styles.orderItem}>
              <span>{item.menuName}</span>
              <span>{item.quantity}개</span>
              <span>{(item.menuPrice * item.quantity).toLocaleString()}원</span>
            </div>
          ))}
        </div>

        <p><strong>총 금액: {totalPrice.toLocaleString()}원</strong></p>

        <div className={styles.buttonGroup}>
          <button className={styles.modalButton} onClick={handleOrderConfirm}>확인</button>
          <button className={styles.modalButton} onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
