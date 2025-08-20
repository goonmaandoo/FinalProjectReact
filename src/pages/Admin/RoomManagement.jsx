import styles from '../../CSS/Admin/RoomManagement.module.css';
import style from '../../CSS/Admin/AdminPage.module.css';
import { useState, useEffect } from 'react';

export default function RoomManagement() {
    const [roomData, setRoomData] = useState([]);
    const [activeRoomId, setActiveRoomId] = useState(null);

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 한 페이지에 보여줄 주문 개수

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRoomData = roomData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(roomData.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        fetch('/api/room/getAllRoomsWithUsers')
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
            <div>
                <div className={style["side_menu_box"]}>
                    <div className={style["side_title"]}>공구방관리</div>
                </div>
                <div className={style["side_detail"]}>진행중이거나 완료된 공구방을 관리하세요</div>
            </div>
            
            {currentRoomData.map((item) => (
                <div key={item.id}>
                    <div className={activeRoomId === item.id ? styles["store_box_active"] : styles["store_box"]}>
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
                            {item.usersInfo.map(user => (
                                <div key={user.roomJoinId} className={styles["user_map"]}>
                                    <div className={styles["user_item"]}>
                                        {user.nickname}
                                    </div>
                                    <div className={styles["user_status"]}>
                                        {user.joinStatus}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            
            {totalPages > 1 && (
                <div className={styles["pagination"]}>
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={currentPage === number ? styles["active"] : ""}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}