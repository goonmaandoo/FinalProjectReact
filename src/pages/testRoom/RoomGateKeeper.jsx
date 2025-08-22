// RoomGatekeeper.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllRoom } from "./roomFunction/selectAllRoom";
import { selectRoomJoin } from "./roomFunction/selectRoomJoin";
import { countingJoin } from "./roomFunction/countingJoin";
import { getInRoom } from "./roomFunction/getInRoom";
import styles from './GateKeeperModal.module.css';
import RoomTest from "./RoomTest";

export default function RoomGatekeeper() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const { room_id: roomId } = useParams();

    const [validated, setValidated] = useState(false);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        const checkAccess = async () => {
            if (!user) {
                navigate("/login");
                return;
            }

            try {
                const roomData = await selectAllRoom(roomId);
                if (typeof roomData.users === 'string') {
                    roomData.users = JSON.parse(roomData.users);
                }

                // 강퇴 확인
                if (roomData.kickId && Number(roomData.kickId) === Number(user.id)) {
                    alert("강퇴된 방입니다.");
                    navigate("/mainpage");
                    return;
                }

                // 참여 여부 확인
                const joined = await selectRoomJoin(roomId, user.id);
                const isJoined = joined.some(j => j.usersId === user.id);

                if (!isJoined) {
                    const isFull = await countingJoin(roomId);
                    if (isFull) {
                        alert("방이 가득 찼습니다.");
                        navigate("/mainpage");
                        return;
                    }

                    const newUser = {
                        nickname: user?.nickname,
                        pickup: false,
                        profileurl: user?.profileUrl,
                        rating: user?.userRating,
                        ready: false,
                        userId: user?.id
                    };

                    const updatedUsers = [...roomData.users, newUser];
                    await getInRoom(roomId, updatedUsers, user.id); // navigate 없음
                    roomData.users = updatedUsers;
                }

                setRoom(roomData);
                setValidated(true);
            } catch (err) {
                console.error("게이트키퍼 오류:", err);
                alert("방 입장 중 오류 발생");
                navigate("/mainpage");
            }
        };

        checkAccess();
    }, [user, roomId, navigate]);

    if (!validated) return <div className={styles.gateKeeping}>공구방에 입장하고 있습니다...</div>;

    return (
        <div className={styles.gateWrapper}>
            <RoomTest initialRoom={room} roomId={roomId} />
        </div>
    )

}
