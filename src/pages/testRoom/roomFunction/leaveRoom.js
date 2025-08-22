import axios from "axios";

export async function handleLeaveRoom({ room, user, roomId, status, navigate }) {

    if (!room || !room.users || !user) return;
    if (status==="배달중") {
        alert('이미 배달주문이 시작되었습니다.')
        return;
    }
    // 1. 나가는 유저 제거
    const updatedUsers = room.users.filter(u => Number(u.userId) !== Number(user.id));

    const isLeaderLeaving = String(user.id) === String(room.leaderId);

    try {
        // 인원이 없거나, 방장이 나갈 경우 → 방 삭제
        if (updatedUsers.length === 0 || isLeaderLeaving) {
            await axios.delete(`/api/room/${roomId}/blowUpRoom`);
            await axios.delete(`/api/roomJoin/${roomId}/deleteRoomOnlyJoin`);
            alert("공구방이 종료됩니다.");
            console.log("방 폭파");
            navigate("/mainpage");
            return;
        }

        // 일반 유저가 나갈 경우 → users 배열만 업데이트
        await axios.put('/api/room/updateReady', {
            id: roomId,
            users: JSON.stringify(updatedUsers),
        });
        // 룸조인도 delete
        await axios.delete('/api/roomJoin/deleteRoomJoin', {
            data: {
                roomId: roomId,
                usersId: user.id
            }
        });
        alert("방을 나갔습니다.");
        navigate("/mainpage");

    } catch (error) {
        console.error("방 나가기 실패:", error);
        alert("방 나가기에 실패했습니다.");
    }
};