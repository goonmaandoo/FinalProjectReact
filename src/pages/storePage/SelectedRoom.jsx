import styles from '../../CSS/Store/SelectedRoom.module.css'
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import KakaoMap from "../../components/Kakaomap";
import { useEffect, useState } from 'react';


export default function SelectRoom() {
    const navigate = useNavigate();
    const { storeId } = useParams();
    const [store, setStore] = useState(null);
    const [room, setRoom] = useState([]);
    const [activeRoomId, setActiveRoomId] = useState(null);

    const [isKakaoReady, setIsKakaoReady] = useState(false);

    useEffect(() => {
        //가게조회
        axios.get(`/api/store/storeDetail/${storeId}`)
            .then(res => {
                setStore(res.data);
            })
            .catch(console.error);
        //개설된 공구방 조회
        axios.get(`/api/room/storeid/${storeId}`)
            .then(res => {
                setRoom(res.data);
            })
            .catch(console.error);

    }, [storeId])
    useEffect(() => {
        const check = setInterval(() => {
            if (
                window.kakao &&
                window.kakao.maps &&
                window.kakao.maps.services &&
                window.kakao.maps.services.Geocoder
            ) {
                clearInterval(check);
                setIsKakaoReady(true);
            }
        }, 100);
        return () => clearInterval(check);
    }, []);

    return (
        <main className={styles["main_container"]}>
            <div className={styles["main_contents"]}>
                <div className={styles["main_head"]}>
                    <img onClick={() => { navigate(-1); }} className={styles["back_btn"]} src="https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/main_img/backbtn.png"></img>
                    <div>개설된 방 : </div>
                    {store && <div className={styles["store_name"]}>&nbsp;{store.storeName}</div>}
                </div>
                <div className={styles["main_box"]}>
                    {room.length > 0 ? (
                        room.map((item) => (
                            <div key={item.id} className={styles["search_box"]}>
                                {activeRoomId === item.id && (
                                    <KakaoMap address={item.roomAddress} className={styles["address_map"]}></KakaoMap>
                                )}
                                <div key={item.id} className={styles["search_result"]} >
                                    <img className={styles["search_store_img"]}
                                        src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/store/store_${item.storeId}.jpg`} alt={`${item.storeId}`}></img>
                                    <div className={styles["search_store_detail"]}>
                                        <div>
                                            <div className={styles["search_store_name"]}>{item.roomName}</div>
                                            <div className={styles["search_menu_name"]}>{item.roomAddress} {item.roomAddressDetail}</div>
                                            <div className={styles["search_status"]}>{item.status}</div>
                                        </div>
                                        <div className={styles["result_map_btn"]}>
                                            <button className={styles["result_btn"]} onClick={() => {
                                                setActiveRoomId(prev => (prev === item.id ? null : item.id));
                                            }}>지도</button>
                                            <button className={styles["result_btn"]} onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/room/${item.id}`;
                                            }}
                                            >참여</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles["search_noResult"]}>개설된 방이 없습니다.</div>
                    )}
                </div>
            </div>
        </main >
    )
}