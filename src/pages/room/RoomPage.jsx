import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RoomHeader from "./RoomHeader";
import RoomBody from "./RoomBody";
import RoomJoin from "./RoomJoin";
import selectRoomJoin from "./components/functions/room_join/SelectRoomJoin";
import selectRoom from "./components/functions/room/SelectRoom";
import selectMenu from "./components/functions/menu/SelectMenu";
import selectMenu from "./components/functions/menu/SelectMenu";
import selectStore from "./components/functions/store/SelectStore"
 
export default function RoomPage() {
    const { room_id } = useParams();
    const [user_id, setUserId] = useState(null);
    const [room, setRoom] = useState(null);
    const [roomJoin, setRoomJoin] = useState([]);
    const [roomMenus, setRoomMenus] = useState([]);
    //const [user, setUser] = useState(null);
    const [store, setStore] = useState(null);
    const user = useSelector((state) => state.auth.user);
    useEffect(() => {
  if (user) {
    setUserId(user.id);
  }
}, [user]);
    
    useEffect(() => {
        async function userFetch() {
            if (!user) return;
            setUserId(user.id);
        }
        async function fetchRoomJoin() {
            const roomJoinData = await selectRoomJoin({ room_id });
            setRoomJoin(roomJoinData.sort((a, b) => Date.parse(a.joined_at) - Date.parse(b.joined_at)));
        }
        async function fetchRoom() {
            await fetchRoomJoin();
            const roomData = await selectRoom({ room_id });
            if (!roomData?.length) {
                console.error("Room not found");
                return;
            }
            setRoom(roomData[0]);
        }
        async function fetchMenus(){
            const roomData = await selectRoom({ room_id });
            if (!roomData?.length) {
                console.error("Room not found");
                return;
            }

            const menus = await selectMenu({ store_id: roomData[0]?.store_id });
            setRoomMenus(menus.map((menu) => ({ ...menu, quantity: 0 })));
        }
        async function fetchStore() {
            const roomData = await selectRoom({ room_id });
            if (!roomData?.length) {
                console.error("Room not found");
                return;
            }
            const storeData = await selectStore({ store_id: roomData[0].store_id });
            setStore(storeData[0]);
        }
        userFetch()
        fetchRoom();
        fetchMenus();
        fetchRoomJoin();
        fetchStore();
        // const roomJoinListSubscribe = supabase
        //     .realtime
        //     .channel(`realtime:room_join_watch_in_room`)
        //     .on(
        //         "postgres_changes",
        //         { event: '*', schema: 'public', table: 'room_join' },
        //         (payload) => {
        //             if (payload.new.room_id === Number(room_id)) {
        //                 let tmp = null;
        //                 setRoomJoin((prevRoomJoin) => (tmp = [...(prevRoomJoin || []).filter((row) => (!((row.user_id === payload.new?.user_id || row.user_id === payload.old?.user_id) && (row.room_id == Number(payload.new?.room_id) || row.room_id === Number(payload.old?.room_id))))), payload.new].filter((row) => (row)).sort((a, b) => Date.parse(a.joined_at) - Date.parse(b.joined_at)), tmp));
        //                 console.log("Room ID matches, fetching room join data...");
        //             }
        //             if (payload.eventType === "DELETE") {
        //                 let tmp = null;
        //                 setRoomJoin((prevRoomJoin) => (tmp = [...prevRoomJoin.filter((row) => (row.id !== payload.old.id))], tmp));
        //             }
        //         }
        //     )
        //     .subscribe();
        // const roomSubscribe = supabase
        //     .realtime
        //     .channel(`realtime:room_watch_on_room_header_in_room_${room_id}`)
        //     .on(
        //         "postgres_changes",
        //         { event: '*', schema: 'public', table: 'room' },
        //         (payload) => {
        //             if (payload.new.id === Number(room_id)) {
        //                 setRoom((prevRoom) => ({ ...prevRoom, ...payload.new }));
        //             }
        //         }
        //     )
        //     .subscribe();
        // const userSubscribe = supabase
        //     .realtime
        //     .channel(`realtime:user_watch_in_room_page`)
        //     .on(
        //         "postgres_changes",
        //         { event: '*', schema: 'public', table: 'user' },
        //         async (payload) => {
        //             const { id } = await getAuthUser();
        //             if (payload.new.id === id) {
        //                 setUser((prevUser) => ({ ...prevUser, ...payload.new }));
        //             }
        //         }
        //     )
        //     .subscribe();

        // return () => {
        //     roomJoinListSubscribe.unsubscribe();
        //     roomSubscribe.unsubscribe();
        //     userSubscribe.unsubscribe();
        // };
    }, [room_id]);
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}>
            <RoomJoin room_id={room_id}  user_id={user_id}/>
            <RoomHeader room_id={room_id} room={room} roomJoin={roomJoin} me={user} />
            <RoomBody room_id={room_id} room={room} store={store} roomJoin={roomJoin} setRoomMenus={setRoomMenus} roomMenus={roomMenus} me={user} />
        </div>
    );
}
