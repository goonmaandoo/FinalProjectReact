// src/components/RoomTest/ReportModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from './ReportModal.module.css';

export default function ReportModal({ visible, onClose, chat, user }) {
    const [reason, setReason] = useState('');

    const handleReport = async () => {
        if (!reason.trim()) {
            alert('신고 이유를 입력해주세요.');
            return;
        }

        if (!chat || !user) {
            alert("신고할 정보가 충분하지 않습니다.");
            return;
        }
        const createdAt = new Date().toISOString().slice(0, 19);
        // 백엔드 DTO에 맞는 데이터 객체 생성
        console.log("챗데이터",chat);
        const reportData = {
            chatId: chat.chatId,
            usersId: chat.userId, 
            reportedBy: user.id,
            reason: reason,
            createdAt
        };
        console.log("신고데이터",reportData);
        try {
            console.log("신고데이터",reportData);
            const response = await axios.post("/api/chatReports", reportData);
            
            console.log("신고가 성공적으로 접수되었습니다:", response.data);
            alert("신고가 접수되었습니다. 감사합니다.");

        } catch (error) {
            console.error("신고 접수 중 오류 발생:", error);
            alert("신고 접수에 실패했습니다.");
        } finally {
            setReason('');
            onClose(); // 모달 닫기
        }
    };

    if (!visible) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>신고하기</h3>
                <p><strong>신고 대상:</strong> {chat?.nickname}</p>
                <p><strong>신고 내용:</strong> {chat?.chat}</p>
                <textarea
                    className={styles.reasonInput}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="신고 이유를 상세히 입력해주세요."
                />
                <div className={styles.buttonGroup}>
                    <button onClick={handleReport} className={styles.submitButton}>신고</button>
                    <button onClick={onClose} className={styles.cancelButton}>취소</button>
                </div>
            </div>
        </div>
    );
}