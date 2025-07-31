import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { initUserMap } from "../../component/funtion/kakaoMapUtils";
import { renderRoomMarkers } from "../../component/funtion/renderRoomMarkers";
import styles from '../../CSS/CloseRoom.module.css';

export default function CloseRoom({ userId, roomList, onSelectRoomId }) {
    const navigate = useNavigate();

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const geocoder = useRef(null);
    const userMarker = useRef(null);
    const currentOverlay = useRef(null);
    const roomMarkers = useRef([]);
    const outsideClickListenerRef = useRef(null);
    const [userAddress, setUserAddress] = useState("");
    const [userCoords, setUserCoords] = useState(null);
    // backend 업데이트 호출 user / address
    const updateAddress = async (newAddress) => {
        console.log("업데이트할 userId:" + userId);
        console.log("새 주소:" + newAddress);
        try {
            const updatedData = {
                id: userId,
                address: newAddress
            };
            const response = await axios.put("/api/users/addressUpdate", updatedData);
            
        }catch (error) {
            console.error("주소 업데이트 에러",error);
        }
    };

    // 지도 및 사용자 마커 설정
    useEffect(() => {
        initUserMap({
            userAddress,
            mapRef,
            mapInstance,
            geocoder,
            userMarker,
            setUserCoords,
            setUserAddress,
            updateAddress,
        });
    }, [userAddress]);
     // 방 마커 렌더링
    useEffect(() => {
        renderRoomMarkers({
            mapInstance,
            geocoder,
            userCoords,
            roomList,
            roomMarkers,
            styles,
            navigate,
            currentOverlay,
            onSelectRoomId,
            outsideClickListenerRef,
        });
    }, [userCoords, roomList, onSelectRoomId, userId, navigate]);
    return (
        <div className={styles.closeMap} ref={mapRef} style={{ width: "100%", height: "100%" }}>
            {!userId && <p>로그인이 필요합니다.</p>}
        </div>
    )
}