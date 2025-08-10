import styles from '../../CSS/RoomManagement.module.css';
import { useState, useEffect } from 'react';

export default function RoomManagement() {
    const [roomData, setRoomData] = useState([]);
    const [activeRoomId, setActiveRoomId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/room/adminSelectRoom')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => setRoomData(data))
            .catch(console.error);
    }, []);
    // useEffect(() => {
    //     fetch('http://localhost:8080/api/room/adminSelectRoomUser/{id}')
    //         .then(res => {
    //             if (!res.ok) throw new Error('서버 에러');
    //             return res.json();
    //         })
    //         .then(data => setRoomData(data))
    //         .catch(console.error);
    // }, [])

    return (
        <div>
            {roomData.map((item) => (
                <div key={item.id} className={styles["store_box"]}>
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
                            <div className={styles["room_count"]}>공구방 인원 : ?/{item.maxPeople}</div>
                        </div>
                        <div className={styles["report_box"]}><div className={styles["report_status"]}>{item.status}</div></div>
                        <button onClick={() => { setActiveRoomId(prev => (prev === item.id ? null : item.id)); }}>펼치기</button>
                    </div>
                    
                </div>
            ))
            }
        </div>
    )
}