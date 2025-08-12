import axios from "axios";

export async function selectRoomJoin(roomId, userId) {
    try {
        const response = await axios.post("/api/roomJoin/selectRoomJoin", {
            roomId,
            usersId : userId,
        });
        return response.data;
    } catch (error) {
        console.error("방 참여 데이터 가져오기 실패:", error);
        throw error;
    }
}