import React, { useState, useEffect } from 'react';
import styles from './OrderConfirmModal.module.css';
import axios from 'axios';
import { makeOrder } from './roomFunction/makeOrder';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
export default function OrderConfirmModal({
  user,
  visible,
  cart,
  totalPrice,
  userId,
  room,
  roomId,
  token,
  onSetOrderId,
  onRefreshRoomUsers,
  onClose,
}) {
  const navigate = useNavigate();
  const [cash, setCash] = useState(user?.cash);
  //const token = useSelector((s) => s.auth?.token);

  // 캐쉬 불러오기.
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

  useEffect(() => {
    fetchCash();
  }, [token]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return; // 보안
      if (event.data?.type === "CASH_CHARGED") {
        fetchCash();
      }
    };

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, [token]);

  if (!visible) return null;

  const handleOrderConfirm = async () => {
    console.log('totalPrice:', totalPrice, 'type:', typeof totalPrice);
    if (!room || !room.users) return;
    if (cart.length === 0) {
      alert('메뉴를 먼저 선택해주세요.');
      return;
    }

    if (cash == null) {
      alert("캐시 정보를 불러오는 중입니다. 잠시 후 시도해주세요.");
      return;
    }

    if (cash < totalPrice) {
      alert('캐쉬 잔액이 부족합니다.');
      window.open(
        "/cash/cashcharge",
        "_blank",
        "width=420,height=500"
      );
      return;
    }

    const foundUser = room.users.find(u => Number(u.userId) === Number(userId));
    if (!foundUser) return;

    const newReadyState = !foundUser.ready;
    const delta = newReadyState ? 1 : -1;

    const updatedUsers = room.users.map(u =>
      Number(u.userId) === Number(userId) ? { ...u, ready: newReadyState } : u
    );

    const roomOrder = cart.map(item => ({
      id: item.id,
      img_id: item.imageId,
      quantity: item.quantity,
      store_id: item.storeId,
      menu_name: item.menuName,
      menu_price: item.menuPrice,
    }));

    const myOrder = {
      roomId,
      userId,
      storeId: room.storeId,
      roomOrder,
      totalPrice,
    };
    console.log("토큰",token);
    try {
      // 1. 주문 먼저 생성
      const newOrderId = await makeOrder(myOrder);
      onSetOrderId(newOrderId); // 부모 상태 변경
      // room total 가격 + 호출
      const amount = totalPrice;
      console.log("어마운트",amount);
      // 3. 캐시 차감 (서비스 쪽에서 amount 음수 체크함)
      await axios.post(
        '/api/users/cash/pay',
        {  cash: amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      //alert("결제가 완료되었습니다."); 

      // 4. ready 상태 업데이트 및 리프레시
      await axios.put('/api/room/updateReady', {
        id: roomId,
        users: JSON.stringify(updatedUsers),
        kickId: room.kickId
      });

      await axios.put(`/api/room/${roomId}/readyCount`, null, {
        params: { delta },
      });

      await onRefreshRoomUsers();
      alert('결제가 완료되었습니다'); 
      onClose();
      //주문완료 navigate
      //navigate(`/ordercomplete/${newOrderId}`);
    } catch (error) {
      if (error.response) {
        alert("결제 실패: " + error.response.data);
      } else {
        alert("서버 연결 실패");
        console.error("서버에러?",error);
      }
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
        <div className={styles.myMenu}>
          Menu
        </div>
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
