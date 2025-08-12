import axios from "axios";

export async function countingJoin(roomId) {
    try {
        const { data: counting } = await axios.get('/api/roomJoin/countingJoin', {
            params: { roomId: roomId }
        });
        const response = await axios.post("/api/room/selectAllRoom", {
            id: roomId
        });
        const maxPeople = response.data[0]?.maxPeople;
        console.log("리스폰스데이터",response.data);
        console.log("카운팅",counting);
        console.log("맥스피플",maxPeople);
        if (counting === maxPeople) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log("카운팅 실패", error);
    }
}