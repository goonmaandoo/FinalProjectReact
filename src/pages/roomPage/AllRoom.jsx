import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CloseRoom from "./CloseRoom";
import styles from '../../CSS/AllRoom.module.css';
import { useRef } from "react";
import axios from "axios";
import { getCoordinates } from "../../component/funtion/Coord";
import { loadKakaoApi } from "../../component/funtion/loadKakaoApi";

export default function AllRoom() {
    const navigate = useNavigate();
    const userId = 1;
    const roomId = 1;
    const [roomList, setRoomList] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [error, setError] = useState();
    // useEffect userData / roomList
    useEffect(() => {
        // userFetch
        // roomFetch
        const fetchRooms = async () => {
            try {
                await loadKakaoApi();
                const dummyUserCoords = { lat: 37.5665, lng: 126.9780 };
                const response = await axios.get("/room/allRoomSelect");
                const rooms = response.data;
                console.log("reponseData:", rooms);
                const roomArray = [];
                for (const room of rooms) {
                    const joinCount = room.join_count || 0;
                    if (joinCount >= room.max_people) continue;
                    const roomCoords = await getCoordinates(room.room_address);
                    const distance = getDistance(dummyUserCoords, roomCoords);
                    if (distance <= 1) {
                        roomArray.push({ ...room, distance, join_count: joinCount });
                    }
                }
                setRoomList(roomArray.sort((a, b) => a.distance - b.distance));
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchRooms();
    }, []);
    const roomRefs = useRef({});
    const scrollContainerRef = useRef(null);
    // 마커 클릭시 방 체크
    const infowindowClick = (roomId) => {
        setSelectedRoomId(roomId);
        console.log("선택된 방 ID:", roomId);

        const container = scrollContainerRef.current;
        const target = roomRefs.current[roomId];

        if (container && target) {
            const offsetTop = target.offsetTop - container.offsetTop;

            container.scrollTo({
                top: offsetTop - 20, // 여유 공간
                behavior: 'smooth',
            });
        }
    }
    return (
        <main className={styles.main_body}>
            <div className={styles.main_container}>
                {/*<MustBeLoggedIn />*/}
                <div className={styles.AllRoomhead}>
                    <img onClick={() => { navigate(-1); }} className={styles["back_btn"]} src="https://epfwvrafnhdgvyfcrhbo.supabase.co/storage/v1/object/public/imgfile/main_img/backbtn.png"></img>
                    <div>진행중인 공구방</div>
                </div>
                <div className={styles.AllRoomBody}>
                    <div className={styles.rooms} ref={scrollContainerRef}>
                        {roomList.length > 0 ? (
                            roomList.map((room, index) => (
                                <Link key={room.id} to={`/room/${room.id}`} onClick={(e) => roomClick(e, room.id)}>
                                    <div ref={(el) => (roomRefs.current[room.id] = el)} key={room.id} className={styles.roomList} style={{ border: room.id === selectedRoomId ? "3px solid #d87575" : "none", }}>
                                        <div className={styles.roomWithText} style={{ backgroundImage: `url("https://epfwvrafnhdgvyfcrhbo.supabase.co/storage/v1/object/public/imgfile/store/store_${room.store_id}.jpg")`, backgroundSize: "cover", backgroundPosition: "center 80%", }}>
                                            <div className={styles.roomDetail}>
                                                <div className={styles.roomTitle}>{room.room_name}</div>
                                                <div className={styles.roomAddress}>{room.room_address}</div>
                                                <progress className={styles["gongu_progress"]} value={room.join_count} max={room.max_people}></progress>
                                                <div className={styles["gongu_bottom"]}>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <div className={styles["gongu_people"]}>{room.join_count}/{room.max_people} {room.status}</div>
                                                    </div>
                                                    <div className={styles["gongu_delivery"]}>{Math.floor(room.distance * 10) / 10}km</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className={styles.room_no_result}>
                                진행중인 공구방이 없습니다.
                            </div>
                        )}
                    </div>
                    <div className={styles.roomMap}>
                        <CloseRoom userId={userId} roomList={roomList} onSelectRoomId={infowindowClick} />
                    </div>
                </div>
            </div>
        </main>
    )
}