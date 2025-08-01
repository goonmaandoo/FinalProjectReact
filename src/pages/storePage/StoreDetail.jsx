import styles from '../../CSS/StoreDetail.module.css'
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import thousands from "thousands";
import axios from "axios";

export default function StoreDetail(){
    const navigate = useNavigate();
    const { storeId } = useParams();
    const[store, setStore] = useState(null);
    const mapRef = useRef(null);
    const[menu, setmenu] = useState([]);

    useEffect(() => {
        //가게 조회
        axios.get(`http://localhost:8080/store/storeDetail/${storeId}`)
            .then(res => {
                setStore(res.data);
            })
            .catch(console.error);
    }, [storeId]);

    const waitForKakaoMaps = () => {
        return new Promise((resolve, reject) => {
            if (
                window.kakao &&
                window.kakao.maps &&
                window.kakao.maps.Map &&
                window.kakao.maps.services &&
                window.kakao.maps.services.Geocoder
            ) {
                resolve();
            } else {
                reject(new Error('카카오 지도 API가 준비되지 않았습니다.'));
            }
        });
    };

    const showMap = async (addr) => {
        await waitForKakaoMaps();

        if (!mapRef.current) return;

        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(addr, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
                const map = new window.kakao.maps.Map(mapRef.current, {
                    center: coords,
                    level: 3,
                });

                setTimeout(() => {
                    window.kakao.maps.event.trigger(map, "resize");
                }, 200);

                new window.kakao.maps.Marker({
                    map: map,
                    position: coords,
                });
            }
        });
    };
    useEffect(() => {
        if (store?.storeAddress) {
            showMap(store.storeAddress);
        }
    }, [store]);

    return store ? (
        <main className={styles["main_box"]}>
            <div className={styles["main_container"]}>
                    <img className={styles["square_img"]} src={`http://localhost:8080/image/imgfile/store/store_${store.id}.jpg`} />
                    <div className={styles["detail_box"]}>
                        <img src="http://localhost:8080/image/imgfile/main_img/Vector.png"/>
                        <div className={styles["detail_text"]}>다같이 주문하면 무료배달</div>
                        <div className={styles["store_name"]}>{store.storeName}</div>
                        <div className={styles["store_star"]}>
                            <div className={styles["star"]}>★</div>
                            <div className={styles["score"]}>4.9(1689)</div>
                        </div>
                        <div className={styles["address_box"]}>
                            <div className={styles["address_text"]}>
                                <div className={styles["address_flex"]}>
                                    <div>가게배달</div>
                                    <div>29~44분</div>
                                </div>
                                <div className={styles["address_flex"]}>
                                    <div>최소주문</div>
                                    <div>{thousands(store.minPrice)}원</div>
                                </div>
                                <div className={styles["address_flex"]}>
                                    <div>가게배달</div>
                                    <div>{store.storeAddress}</div>
                                </div>
                                <div className={styles["address_flex"]}>
                                    <div>가게번호</div>
                                    <div>{store.tel}</div>
                                </div>
                            </div>
                            <div ref={mapRef} className={styles["address_map"]}></div>
                        </div>
                    </div>
            </div>
        </main>
    ) : null;
}