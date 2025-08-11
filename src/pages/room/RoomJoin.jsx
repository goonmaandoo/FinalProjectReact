import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import InsertRoomJoin from "./components/functions/room_join/InsertRoomJoin";

export default function RoomJoin({ room_id, user_id }) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const process = async () => {       
            try {
                await InsertRoomJoin({ room_id, user_id });
            } catch (error) {
                console.error(error.message);
                alert(error.message);
                navigate("/");
            }
        };
        // const roomSubscribe = supabase
        //    .realtime
        //    .channel(`realtime:room_status_update_watch_on_room_delete_${room_id}`)
        //    .on(
        //         "postgres_changes",
        //         { event: '*', schema: 'public', table: 'room' },
        //         (payload) => {
        //             console.log("Received payload:", payload);
        //             if (payload.new.room_id === Number(room_id) && payload.new.status === "삭제") {
        //                 console.log("Room ID matches, navigating to room...");
        //                 alert('방이 삭제되었습니다.')
        //                 navigate(`/room/${room_id}`);
        //             }
        //         }
        //     )
        process();
        // return () => {
        //     roomSubscribe.unsubscribe();
        // }
    }, [room_id]);

    return (
        <>
        <p>ㅎㅇ</p>
        </>
    );
}
