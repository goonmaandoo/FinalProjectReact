import styles from '../../CSS/Store/StoreDetail.module.css'
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import thousands from "thousands";
import axios from "axios";
import KakaoMap from "../../components/Kakaomap";

export default function StoreDetail() {
    const navigate = useNavigate();
    const { storeId } = useParams();
    const [store, setStore] = useState(null);
    const [menu, setmenu] = useState([]);
    const [image, setImage] = useState([]);

    const [isKakaoReady, setIsKakaoReady] = useState(false);

    useEffect(() => {
        //가게 조회
        axios.get(`http://localhost:8080/store/storeDetail/${storeId}`)
            .then(res => {
                setStore(res.data);
            })
            .catch(console.error);
        //메뉴 조회
        axios.get(`http://localhost:8080/menu/storeMenu/image/${storeId}`)
            .then(res => {
                setmenu(res.data);
            })
            .catch(console.error);
    }, [storeId]);


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

    return store ? (
        <main className={styles["main_box"]}>
            <div className={styles["main_container"]}>
                <img className={styles["square_img"]} src={`http://localhost:8080/image/imgfile/store/store_${store.id}.jpg`} />
                <div className={styles["detail_box"]}>
                    <img src="http://localhost:8080/image/imgfile/main_img/Vector.png" />
                    <div className={styles["detail_text"]}>다같이 주문하면 무료배달</div>
                    <div className={styles["store_name"]}>{store.storeName}</div>
                    <div className={styles["store_star"]}>
                        <div className={styles["star"]}>★</div>
                        <div className={styles["score"]}>4.9(1689)</div>
                    </div>
                    <div className={styles["address_box"]}>
                        <div className={styles["address_text"]}>
                            <div className={styles["address_flex"]}>
                                <div className={styles["address_title"]}>가게배달</div>
                                <div>29~44분</div>
                            </div>
                            <div className={styles["address_flex"]}>
                                <div className={styles["address_title"]}>최소주문</div>
                                <div>{thousands(store.minPrice)}원</div>
                            </div>
                            <div className={styles["address_flex"]}>
                                <div className={styles["address_title"]}>가게배달</div>
                                <div>{store.storeAddress}</div>
                            </div>
                            <div className={styles["address_flex"]}>
                                <div className={styles["address_title"]}>가게번호</div>
                                <div>{store.tel}</div>
                            </div>
                        </div>
                        <div>
                            {isKakaoReady ? (
                                <KakaoMap address={store.storeAddress} className={styles["address_map"]} />
                            ) : (
                                <p>지도를 불러오는 중...</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles["menu_box"]}>
                    <div className={styles["menu_btn"]}>
                        <button onClick={() => {
                            navigate(`/room/create/${storeId}`) 
                        }} className={styles["menu_make_btn"]}>방 만들기</button>
                        <button onClick={() => {
                            navigate(`/selectroom/${storeId}`);window.scrollTo({ top: 0 });
                        }} className={styles["menu_confirm_btn"]}>개설된 방 확인</button>
                    </div>
                    <hr className={styles["menu_hr"]} ></hr>
                    {menu.map((item) => (
                        <div key={item.id}>
                            <div className={styles["menu_detail_box"]}>
                            <div className={styles["menu_text"]}>
                                <div className={styles["menu_title"]}>{item.menuName}</div>
                                <div className={styles["menu_price"]}>{thousands(item.menuPrice)}원</div>
                            </div>
                            <img className={styles["menu_img"]} 
                            src={`http://localhost:8080/image/imgfile/${item.folder}/${item.filename}`} alt={item.menuName}/>
                            </div>
                            <hr className={styles["menu_hr"]} ></hr>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    ) : null;
}