import styles from '../../CSS/RoomManagement.module.css';
import { useState, useEffect } from 'react';

export default function RoomManagement() {
    const [roomData, setRoomData] = useState([]);
    const [activeRoomId, setActiveRoomId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/room/getAllRoomsWithUsers')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => {
                setRoomData(data);
            })
            .catch(console.error);
    }, []);


    return (
        <div>
            {roomData.map((item) => (
                <>
                <div key={item.id} className={activeRoomId === item.id ? styles["store_box_active"] : styles["store_box"]}>
                {/* <div key={item.id} className={styles["store_box"]}> */}
                    <div className={styles["total"]}>
                        <div className={styles["total_title"]}>
                            <div className={styles["room_name"]}>{item.roomName}</div>
                            <div className={styles["room_store"]}>{item.storeName}</div>
                        </div>
                        <div className={styles["total_num_box"]}>
                            <div className={styles["total_num"]}>공구방번호 : {item.id}</div>
                        </div>
                    </div>
                    <div className={styles["total1"]}>
                        <div>
                            <div className={styles["room_count"]}>공구방 인원 : {item.usersInfo ? item.usersInfo.length : 0}/{item.maxPeople}</div>
                        </div>
                        <div className={styles["report_box"]}>
                            <div className={styles["report_status"]}>{item.status}</div>
                        </div>
                        <div className={styles["report_btn"]}>
                            <button onClick={() => { setActiveRoomId(prev => (prev === item.id ? null : item.id)); }}>
                            {activeRoomId === item.id ? "접기" : "펼치기"}
                        </button>
                        </div>
                        
                    </div>
                </div>
                {activeRoomId === item.id && (
                        <div className={styles["user_list"]}>
                            {item.usersInfo.length > 0 ? (
                                item.usersInfo.map(user => (
                                    <>
                                    <div className={styles["user_map"]}>
                                        <div key={user.roomJoinId} className={styles["user_item"]}>
                                            {user.nickname}
                                        </div>
                                        <div key={user.roomJoinId} className={styles["user_status"]}>
                                            {user.joinStatus}
                                        </div>
                                    </div>
                                    </>
                                ))
                            ) : (
                                <div>참여자가 없습니다.</div>
                            )}
                        </div>
                    )}
                </>
            ))}
        </div>
    )
}
