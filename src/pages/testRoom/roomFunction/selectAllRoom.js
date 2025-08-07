import axios from "axios";

export async function selectAllRoom(roomId) {
    try {
    const response = await axios.post("/api/room/selectAllRoom", {
      id : roomId
    });
    const data = response.data[0];
    // 최신순 정렬 (id 기준)
    return data
  } catch (error) {
    console.error("방 조회 실패:", error);
    throw error;
  }
}