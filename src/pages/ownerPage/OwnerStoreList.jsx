import style from "../../CSS/OwnerDashboard.module.css"
import OwnerHeader from "./OwnerHeader"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StoreManagement() {
    const user = useSelector((state) => state.auth.user);
    const [storeList, setStoreList] = useState([]);

    useEffect(() => {
        if (!user || !user.id) {
            console.log("로그인된 사장님 정보 없음");
            return;
        }
        const ownerId = user.id;
        axios.get(`http://localhost:8080/store/storeByOwnerId/${ownerId}`)
            .then(res => {
                console.log("가게 리스트:", res.data);
                setStoreList(res.data);
            })
            .catch(err => {
                console.error("가게 불러오기 실패:", err);
            });
    }, [user]);

    const deletebutton = async (storeId) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;  // 취소하면 그냥 함수 종료

        try {
            await axios.get(`http://localhost:8080/store/storeDelete/${storeId}`)
            setStoreList(prevList => prevList.filter(store => store.id !== storeId));
        } catch (err) {
            console.error("가게 삭제 실패:", err);
        }
    }

    return (
        <>
            <OwnerHeader />
            <div className={style["outbox"]}>
                {/* 사이드 메뉴 */}
                <div className={style["leftbox"]}>
                    <ul>
                        <li><Link to="/ownerdashboard">대시보드</Link></li>
                        <li><Link to="/storeregister">가게등록</Link></li>
                        <li><Link to="/ownerstorelist">가게관리</Link></li>
                        <li><Link to="/ownermenuedit">메뉴</Link></li>
                        <li><Link to="/deliverystate">배달접수/현황</Link></li>
                        <li><Link to="/reviewmanagement">리뷰관리</Link></li>
                        <li><Link to="/orderyesno">주문접수/취소</Link></li>
                    </ul>
                </div>

                {/* 메인 콘텐츠 */}
                <div className={style["rightbox"]}>
                    <h2>가게관리</h2>
                    <h3>가게를 관리하세요</h3>

                    <div className={style["storelist"]}>
                        {storeList.length > 0 ? (
                            storeList.map((store) => (
                                <div key={store.id} className={style["store_card"]}>
                                    <h4>{store.storeName}</h4>
                                    <p>주소: {store.storeAddress}</p>
                                    <p>전화번호: {store.tel}</p>
                                    {/* 필요하면 이미지, 수정 버튼, 메뉴관리 버튼 등 추가 */}
                                    <button className={style["store_edit_button"]}> 수정 </button>
                                    <button className={style["store_delete_button"]}
                                        onClick={() => deletebutton(store.id)}> 삭제 </button>
                                </div>

                            ))
                        ) : (
                            <p>등록된 가게가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
