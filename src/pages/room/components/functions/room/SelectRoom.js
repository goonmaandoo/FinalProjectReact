import axios from "axios";

export default async function selectRoom({
  room_id,
  room_name_like,
  room_name,
  room_address,
  room_address_detail,
  max_people,
  leader_id,
  status,
  store_id,
}) {
  try {
    const response = await axios.post("/api/room/selectRoom", {
      id: room_id,
      roomNameLike: room_name_like,
      roomName: room_name,
      roomAddress: room_address,
      roomAddressDetail: room_address_detail,
      maxPeople: max_people,
      leaderId: leader_id,
      status: status,
      storeId: store_id,
    });

    const data = response.data;

    // 최신순 정렬 (id 기준)
    return data.sort((a, b) => b.id - a.id);
  } catch (error) {
    console.error("방 조회 실패:", error);
    throw error;
  }
}
