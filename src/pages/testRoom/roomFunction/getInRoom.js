import axios from "axios";

export async function getInRoom( roomId, updatedUsers, navigate ) {
    try {
        await axios.put('/api/room/updateReady', {
            id: roomId,
            users: JSON.stringify(updatedUsers),
        });

        alert("방에 입장했습니다.");

    } catch (error) {
        console.error("방 입장 실패:", error);
        alert("방 입장에 실패했습니다.");
        navigate("/mainpage");
    }
}