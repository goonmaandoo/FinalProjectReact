import axios from "axios";

export async function changeRoomStatus(roomId, status) {
    try {
        const newStatus = status === "모집중" ? "모집마감" : "모집중";

        const response = await axios.put(`/api/room/${roomId}/roomStatus`, null, {
            params: {
                status: newStatus
            }
        });

        console.log(`방 상태가 ${newStatus}으로 변경되었습니다:`, response.data);
        return response.data; 
    } catch (error) {
        console.error("방 상태 변경 실패:", error);
        throw error; 
    }
}