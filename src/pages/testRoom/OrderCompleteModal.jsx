import React from "react";
import styles from "./OrderCompleteModal.module.css";

export default function OrderCompleteModal({ visible, onClose, cart, totalPrice, room, user }) {
    if (!visible) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                <h2 className={styles.title}>✅ 주문 완료</h2>
                <p className={styles.subTitle}>{room?.roomName} - 영수증</p>

                <div className={styles.receipt}>
                    {cart.map((item, idx) => (
                        <div key={idx} className={styles.receiptItem}>
                            <span>{item.menuName}</span>
                            <span>{item.quantity}개</span>
                            <span>{(item.menuPrice * item.quantity).toLocaleString()}원</span>
                        </div>
                    ))}
                    <hr />
                    <div className={styles.total}>
                        <strong>총 금액</strong>
                        <strong>{totalPrice.toLocaleString()}원</strong>
                    </div>
                </div>

                <div className={styles.footer}>
                    <p>주문자: {user?.nickname}</p>
                    <p>픽업 장소: {room?.roomAddress}</p>
                </div>

                <button className={styles.closeButton} onClick={onClose}>확인</button>
            </div>
        </div>
    );
}
