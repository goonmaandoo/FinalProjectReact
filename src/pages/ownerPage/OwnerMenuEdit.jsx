import style from "../../CSS/OwnerDashboard.module.css";
import styles from '../../CSS/StoreListPage.module.css';
import OwnerHeader from "./OwnerHeader";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function OwnerMenuEdit() {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [menuList, setMenuList] = useState([]);


        if(!user || !user.id){
            console.log("로그인된 사장님 정보가 없습니다.");
            return;
        }

        const ownerId = user.id; // 로그인 시 저장된 ownerId 꺼내기
        if (!ownerId) {
            console.warn("로그인된 사장님 정보가 없습니다.");
            return;
        }

        const url = `http://localhost:8080/menu/owner/${ownerId}`;
        axios.get(url)
            .then(res => {
                console.log("사장님 메뉴 목록:", res.data);
                setMenuList(res.data);
            })
            .catch(err => {
                console.error("메뉴 불러오기 실패:", err);
            });


    return (
        <>
            <OwnerHeader />
            <div className={style["outbox"]}>
                {/* 사이드 메뉴 */}
                <div className={style["leftbox"]}>
                    <ul>
                        <li><Link to="/ownerdashboard">대시보드</Link></li>
                        <li><Link to="/storeregister">가게등록</Link></li>
                        <li><Link to="/ownermenuedit">메뉴</Link></li>
                        <li><Link to="/deliverystate">배달접수/현황</Link></li>
                        <li><Link to="/reviewmanagement">리뷰관리</Link></li>
                        <li><Link to="/orderyesno">주문접수/취소</Link></li>
                    </ul>
                </div>

                {/* 메인 콘텐츠 */}
                <div className={style["rightbox"]}>
                    <h2>메뉴관리</h2>
                    <h3>등록된 메뉴 목록</h3>

                    <div className={style["menu_button"]}>
                        <button> 전체메뉴 </button>
                        <button> 메뉴 추가 </button>
                        <button> 메뉴 수정 </button>
                    </div>

                    <div className={style["menu_content"]}>
                        {menuList.length > 0 ? (
                            menuList.map(menu => (
                                <div key={menu.id} className={styles["menu_card"]}>
                                    <img
                                        src={`http://localhost:8080/image/imgfile/menu/menu_${menu.image_id}.jpg`}
                                        alt={menu.menu_name}
                                        className={styles["menu_image"]}
                                    />
                                    <div className={styles["menu_info"]}>
                                        <h4>{menu.menu_name}</h4>
                                        <p>가격: {menu.menu_price}원</p>
                                        <p>가게 ID: {menu.store_id}</p>
                                        <p>카테고리 ID: {menu.menu_category_id}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>등록된 메뉴가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
