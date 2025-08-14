import axios from "axios";

export async function getInRoom( roomId, updatedUsers, userId, navigate ) {
    console.log("추가할 유저",updatedUsers);
    try {
        await axios.put('/api/room/updateReady', {
            id: roomId,
            users: JSON.stringify(updatedUsers),
        });
        const joinedAt = new Date().toISOString().slice(0, 19);
        await axios.post("/api/roomJoin/insertRoom", {
            roomId,
            usersId : userId,
            joinedAt,
            status: "준비중",
        });
        navigate(`/room/${roomId}`);
        alert("방에 입장했습니다.");

    } catch (error) {
        console.error("방 입장 실패:", error);
        alert("방 입장에 실패했습니다.");
        navigate("/mainpage");
    }
}