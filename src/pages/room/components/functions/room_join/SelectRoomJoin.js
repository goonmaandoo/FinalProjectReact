import axios from "axios";

export default async function selectRoomJoin({
    room_id,
    user_id,
    status,
}) {
    try {
        const response = await axios.post("/api/roomJoin/selectRoomJoin", { roomId : room_id, userId : user_id, status})
        const data = response.data;
        console.log("룸조인 데이터:",data);
        return data;
    } catch (error) {
        console.error("API호출 실패", error);
        throw error;
    } 
}