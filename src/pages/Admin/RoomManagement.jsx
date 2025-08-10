import styles from '../../CSS/RoomManagement.module.css';
import { useState, useEffect } from 'react';

export default function RoomManagement() {
    const { roomData, setRoomData } = useState([]);

    useEffect(() => {
        fetch('/room/adminSelectRoom')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => setRoomData(data))
            .catch(console.error);
    }, []);

    return (

        <div className={styles["store_box"]}>
            <div className={styles["total"]}>
                <div className={styles["total_third"]}>
                    <div>{roomData.roomName}</div>
                    <div>가게이름</div>
                </div>
                <div className={styles["total_third"]}>
                    <div>주문번호</div>
                    <div>주문상품</div>
                </div>
            </div>
            <div className={styles["total1"]}>
                <div>
                    <div>주문인원 ?/?</div>
                </div>
                <div className={styles["report_status"]}>미응답</div>
                <button>펼치기</button>
            </div>
        </div>
    )
}