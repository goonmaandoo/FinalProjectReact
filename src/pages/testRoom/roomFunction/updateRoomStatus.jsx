import axios from "axios";

export async function updateRoomStatus(roomId, status) {
    try {
        const response = await axios.put(`/api/room/${roomId}/roomStatus`, null, {
            params: {
                status: status,
            },
        });
        console.log('방 상태 업데이트 성공:', response);
    } catch (error) {
        console.error('방 상태 업데이트 실패:', error);
    }
}