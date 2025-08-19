import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import CloseRoom from "./CloseRoom";
import styles from '../../CSS/AllRoom.module.css';
import axios from "axios";
import { getCoordinates } from "../../component/funtion/Coord";
import { loadKakaoApi } from "../../component/funtion/loadKakaoApi";
import { getDistance } from "../../component/funtion/Distance";
import { useSelector } from "react-redux";

export default function AllRoom() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const userId = user?.id;
    const [roomList, setRoomList] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [error, setError] = useState();
    const [userCoords, setUserCoords] = useState(null);
    const [userAddress, setUserAddress] = useState(null);
    const roomRefs = useRef({});
    const scrollContainerRef = useRef(null);

    // 1. 처음 마운트 시, userId를 기반으로 userCoords를 가져와 설정
    useEffect(() => {
        if (!user?.id) return;

        const fetchUserLocation = async () => {
            try {
                console.log("사용할 유저아이디", userId);
                await loadKakaoApi();
                const userResponse = await axios.get(`/api/users/getUserAddress/${userId}`);
                const fetchedAddress = userResponse.data.address;
                const detailAddress = userResponse.data.addressDetail;
                console.log("상세주소", detailAddress);
                // ✅ 로컬 변수를 사용해 getCoordinates를 호출
                const coords = await getCoordinates(fetchedAddress);

                // ✅ 두 상태를 동시에 업데이트
                setUserAddress(fetchedAddress);
                setUserCoords(coords);

            } catch (error) {
                console.error("사용자 위치를 가져오는 중 오류 발생:", error);
                setError("사용자 위치 정보를 가져올 수 없습니다.");
            }
        };
        fetchUserLocation();
    }, [user]);
    // 2. userCoords가 변경될 때마다 roomList를 다시 가져와 필터링
    useEffect(() => {
        const fetchRoomsByLocation = async () => {
            if (!userCoords) {
                // userCoords가 없으면 실행하지 않음
                return;
            }

            try {
                //const response = await axios.get("http://localhost:8080/api/room/allRoomSelect");
                const response = await axios.get(`http://localhost:8080/api/room/roomsbyId/${user?.id}`);
                const rooms = response.data;
                console.log("리스폰스1", response);
                //console.log("리스폰스2",response2);
                const roomsWithDistance = await Promise.all(
                    rooms.map(async (room) => {
                        if (room.status !== "모집중") return null;
                        // ... (기존 필터링 로직)
                        const roomCoords = await getCoordinates(room.roomAddress);
                        if (!roomCoords) return null;

                        const distance = getDistance(userCoords, roomCoords);
                        if ((room.joinCount || 0) >= room.maxPeople || distance > 1.5) {
                            return null;
                        }

                        return { ...room, distance };
                    })
                );

                const filteredRooms = roomsWithDistance.filter(r => r !== null);
                setRoomList(filteredRooms.sort((a, b) => a.distance - b.distance));

            } catch (error) {
                console.error("Error fetching rooms:", error);
                setError(error);
            }
        };

        fetchRoomsByLocation();
    }, [userCoords]); // ⭐️ userCoords에 의존

    // roomList 상태 확인 로그
    useEffect(() => {
        console.log("roomList 상태값:", roomList);
    }, [roomList]);

    const infowindowClick = (roomId) => {
        setSelectedRoomId(roomId);
        const container = scrollContainerRef.current;
        const target = roomRefs.current[roomId];

        if (container && target) {
            const offsetTop = target.offsetTop - container.offsetTop;
            container.scrollTo({
                top: offsetTop - 20,
                behavior: 'smooth',
            });
        }
    };
    const handleUserLocationUpdate = (newAddress, newCoords) => {
        setUserAddress(newAddress);
        setUserCoords(newCoords);
    };
    const roomClick = async (e, roomId) => {
        e.preventDefault();

        try {
            const response = await axios.get('/api/roomJoin/statusCheck', {
                params: { roomId: roomId, userId: userId }
            });

            const joinData = response.data;
            console.log("조인데이터", joinData);
            if (joinData) {
                // 데이터가 있으면 참여중
                const move = window.confirm("이미 참여중인 방입니다. 이동하시겠습니까?");
                if (move) {
                    navigate(`/room/${roomId}`);
                }
            } else {
                // 데이터 없으면 참여 안 한 상태
                const confirmJoin = window.confirm("이 공구방에 참여하시겠습니까?");
                if (confirmJoin) {
                    navigate(`/room/${roomId}`);
                }
            }
        } catch (error) {
            console.error('API 호출 실패:', error);
            // 에러 처리 추가 가능 (예: alert 띄우기)
        }
    };

    return (
        <main className={styles.main_body}>
            <div className={styles.main_container}>
                <div className={styles.AllRoomhead}>
                    <img
                        onClick={() => { navigate(-1); }}
                        className={styles.back_btn}
                        src="http://localhost:8080/image/imgfile/main_img/backbtn.png"
                        alt="뒤로가기 버튼"
                    />
                    <div>진행중인 공구방</div>
                </div>

                <div className={styles.AllRoomBody}>
                    <div className={styles.rooms} ref={scrollContainerRef}>
                        {console.log("룸배열 길이:", roomList.length)}
                        {roomList.length > 0 ? (
                            <>
                                {roomList.map((room) => {
                                    console.log("렌더링될 room:", room);
                                    return (
                                        <Link
                                            key={room.id}
                                            to={`/room/${room.id}`}
                                            onClick={(e) => roomClick(e, room.id)}
                                        >
                                            <div
                                                ref={(el) => (roomRefs.current[room.id] = el)}
                                                className={styles.roomList}
                                                style={{
                                                    border: room.id === selectedRoomId ? "3px solid #d87575" : "none",
                                                }}
                                            >
                                                <div
                                                    className={styles.roomWithText}
                                                    style={{
                                                        backgroundImage:
                                                            window.innerWidth > 480
                                                                ? `url("http://localhost:8080/image/imgfile/store/store_${room.storeId}.jpg")`
                                                                : "none",
                                                        backgroundColor: "#eee",
                                                        backgroundSize: "cover",
                                                        backgroundPosition: "center 80%",
                                                        padding: "36px 0px 0px 0px",
                                                    }}
                                                >
                                                    <div className={styles.roomDetail}>
                                                        <div className={styles.roomTitle}>{room.roomName}</div>
                                                        <div className={styles.roomAddress}>{room.roomAddress}</div>
                                                        <progress
                                                            className={styles.gongu_progress}
                                                            value={room.joinCount}
                                                            max={room.maxPeople}
                                                        ></progress>
                                                        <div className={styles.gongu_bottom}>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <div className={styles.gongu_people}>
                                                                    {room.joinCount}/{room.maxPeople} {room.status}
                                                                </div>
                                                            </div>
                                                            <div className={styles.gongu_delivery}>
                                                                {Math.floor(room.distance * 10) / 10}km
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </>
                        ) : (
                            <div className={styles.room_no_result}>
                                진행중인 공구방이 없습니다.
                            </div>
                        )}
                    </div>

                    <div className={styles.roomMap}>
                        {userCoords ? (
                            <CloseRoom
                                userId={userId}
                                roomList={roomList}
                                onSelectRoomId={infowindowClick}
                                userAddress={userAddress}
                                userCoords={userCoords}
                                onUserLocationUpdate={handleUserLocationUpdate}
                            />
                        ) : (
                            <p>위치 정보를 불러오는 중입니다...</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
