import React from 'react';
import styles from './OrderConfirmModal.module.css';
import axios from 'axios';
import { makeOrder } from './roomFunction/makeOrder';

export default function OrderConfirmModal({
  user,
  visible,
  cart,
  totalPrice,
  userId,
  room,
  roomId,
  onSetOrderId,
  onRefreshRoomUsers,
  onClose,
}) {
  if (!visible) return null;

  const handleOrderConfirm = async () => {
    if (!room || !room.users) return;
    if (cart.length === 0) {
      alert('메뉴를 먼저 선택해주세요.');
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

    if (user?.cash < totalPrice) {
      alert('돈이 부족합니다.');
      return;
    }
    // 캐쉬 컬럼 update 해야함.
    try {
      const newOrderId = await makeOrder(myOrder);
      onSetOrderId(newOrderId); // 부모 상태 변경

      await axios.put('/api/room/updateReady', {
        id: roomId,
        users: JSON.stringify(updatedUsers),
      });

      await axios.put(`/api/room/${roomId}/readyCount`, null, {
        params: { delta },
      });

      await onRefreshRoomUsers(); // 부모에서 fetch
      onClose(); // 모달 닫기
    } catch (error) {
      console.error('주문 처리 실패:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>주문 확인</h2>
        <div>보유 금액: {(user?.cash ?? 0).toLocaleString()}원</div>
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
          <button onClick={handleOrderConfirm}>확인</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
