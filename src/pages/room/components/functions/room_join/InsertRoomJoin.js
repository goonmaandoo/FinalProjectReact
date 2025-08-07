import selectRoom from "../room/SelectRoom";
import selectRoomJoin from "./SelectRoomJoin";

export default async function InsertRoomJoin({
    room_id,
    user_id,
    status = "준비중"
}) {
   const room = await selectRoom({ room_id });
    if (!room || room.length === 0) {
        throw new Error("방이 존재하지 않습니다.");
    }

    // 2. 중복 참여 확인
    const roomJoin = await selectRoomJoin({ room_id });
    if (roomJoin.find(join => join.user_id === user_id)) {
        return undefined; // 이미 참여한 유저는 중복 삽입 방지
    }

    // 3. 방 상태 확인
    if (room[0].status !== "모집중") {
        throw new Error("방의 상태가 모집중이 아닙니다.");
    }

    // 4. 정원 초과 확인
    if (room[0].max_people <= roomJoin.length) {
        throw new Error("이미 방이 가득 찼습니다.");
    }

    // 5. 백엔드에 삽입 요청
    try {
        const response = await axios.post("/api/roomJoin/insertRoom", {
            roomId: room_id,
            usersId: user_id,
            status
        });
        const data = response.data;
        return data;
    } catch (error) {
        console.error("InsertRoomJoin 실패", error.response?.data || error.message);
        throw error;
    }
}
