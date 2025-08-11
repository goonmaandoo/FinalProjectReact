import style from "./RoomBody.module.css";
import Chat from "../../components/chat/Chat";
import RoomMenu from "./RoomMenu";
import RoomOrderStatus from "./RoomOrderStatus";

export default function RoomBody({
    room,
    room_id,
    roomJoin,
    setRoomMenus,
    roomMenus,
    store,
    me,
}) {
    return (
        <div className={style.room_body}>
            <div className={style.room_body_left}>
                <div className={style.room_body_left_top}>
                    <RoomOrderStatus room={room} room_id={room_id} roomJoin={roomJoin} me={me} />
                </div>
                <div className={style.room_body_left_bottom}>
                    <Chat room_id={room_id} />
                </div>
            </div>
            <div className={style.room_body_right}>
                <RoomMenu room={room} room_id={room_id} setRoomMenus={setRoomMenus} store={store} roomMenus={roomMenus} me={me} />
            </div>
        </div>
    );
}