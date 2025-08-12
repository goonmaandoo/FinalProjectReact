import axios from "axios";

export async function insertRoomJoin(roomId, userId) {
    try {
        const joinedAt = new Date().toISOString().slice(0, 19);
        await axios.post("/api/roomJoin/insertRoom", {
            roomId,
            usersId : userId,
            joinedAt,
            status: "준비중",
        });
    } catch (error) {
        console.error("insertRoomJoin 호출 실패:", error);
        throw error;
    }

}