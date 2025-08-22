import styles from "../../CSS/Store/StoreDetail.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import thousands from "thousands";
import axios from "axios";
import KakaoMap from "../../components/Kakaomap";

export default function StoreDetail() {
    const navigate = useNavigate();
    const { storeId } = useParams();

    const [store, setStore] = useState(null);
    const [menu, setMenu] = useState([]);
    const [isKakaoReady, setIsKakaoReady] = useState(false);

    useEffect(() => {

        //가게 조회
        axios.get(`/api/store/storeDetail/${storeId}`)
            .then(res => {
                setStore(res.data); // res.data에 avgRating, reviewCount 포함되어야 함
            })
            .catch(console.error);

        //메뉴 조회
        axios.get(`/api/menu/storeMenu/image/${storeId}`)

            .then(res => {
                setMenu(res.data);
            })
            .catch(console.error);
    }, [storeId]);

    // 카카오맵 로딩 체크
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
                {/* 가게 대표 이미지 */}
                <img
                    className={styles["square_img"]}
                    src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/store/store_${store.id}.jpg`}
                    alt={store.storeName}
                />

                {/* 가게 상세 정보 */}
                <div className={styles["detail_box"]}>
                    <img
                        src="https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/main_img/Vector.png"
                        alt="무료배달 아이콘"
                    />
                    <div className={styles["detail_text"]}>다같이 주문하면 무료배달</div>
                    <div className={styles["store_name"]}>{store.storeName}</div>

                    {/*  별점 + 리뷰 개수 */}
                    <div className={styles["store_star"]}>
                        <div className={styles["star"]}>★</div>
                        <div className={styles["score"]}>
                            {store.avgRating ? store.avgRating.toFixed(1) : "5.0"}
                            ({store.reviewCount || 0})
                        </div>
                    </div>

                    {/* 가게 상세 정보 (배달/주소/번호) */}
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
                                <div className={styles["address_title"]}>가게주소</div>
                                <div>{store.storeAddress}</div>
                            </div>
                            <div className={styles["address_flex"]}>
                                <div className={styles["address_title"]}>가게번호</div>
                                <div>{store.tel}</div>
                            </div>
                        </div>
                        <div>
                            {isKakaoReady ? (
                                <KakaoMap
                                    address={store.storeAddress}
                                    className={styles["address_map"]}
                                />
                            ) : (
                                <p>지도를 불러오는 중...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 메뉴 영역 */}
                <div className={styles["menu_box"]}>
                    <div className={styles["menu_btn"]}>
                        <button
                            onClick={() => navigate(`/room/create/${storeId}`)}
                            className={styles["menu_make_btn"]}
                        >
                            방 만들기
                        </button>
                        <button
                            onClick={() => {
                                navigate(`/selectroom/${storeId}`);
                                window.scrollTo({ top: 0 });
                            }}
                            className={styles["menu_confirm_btn"]}
                        >
                            개설된 방 확인
                        </button>
                        <button
                            onClick={() => {
                                navigate(`/store/${storeId}/reviews`);
                                window.scrollTo({ top: 0 });
                            }}
                            className={styles["menu_confirm_btn"]}
                        >
                            리뷰 확인
                        </button>
                    </div>
                    <hr className={styles["menu_hr"]} />

                    {/* 메뉴 리스트 */}
                    {menu.map((item) => (
                        <div key={item.id}>
                            <div className={styles["menu_detail_box"]}>
                                <div className={styles["menu_text"]}>
                                    <div className={styles["menu_title"]}>{item.menuName}</div>
                                    <div className={styles["menu_price"]}>
                                        {thousands(item.menuPrice)}원
                                    </div>
                                </div>
                                <img
                                    className={styles["menu_img"]}
                                    src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/${item.folder}/${item.filename}`}
                                    alt={item.menuName}
                                />
                            </div>
                            <hr className={styles["menu_hr"]} />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    ) : null;
}
