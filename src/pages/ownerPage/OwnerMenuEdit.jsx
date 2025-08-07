import style from "../../CSS/OwnerDashboard.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

export default function OwnerMenuEdit() {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [menuList, setMenuList] = useState([]);
    const [storeId, setStoreId] = useState("");
    const [selectedTab, setSelectedTab] = useState("전체메뉴");


    useEffect(() => {
        if (!user || !user.id) {
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
    }, [user]);

    useEffect(() => {
        if (!user || !user.id) return;

        const ownerId = user.id;
        axios.get(`http://localhost:8080/menu/ownerWithImage/${ownerId}`)
            .then(res => {
                console.log("사장님 메뉴 목록:", res.data);
                setMenuList(res.data);
                if (res.data.length > 0) {
                    setStoreId(res.data[0].storeId);
                }
            })
            .catch(console.error);
    }, [user]);


    return (
        <>
            <div className={style["outbox"]}>

                {/* 메인 콘텐츠 */}
                <div className={style["rightbox"]}>

                    <div className={style["menu_button"]}>
                        <button onClick={() => setSelectedTab("전체메뉴")}> 전체메뉴 </button>
                        <button onClick={() => setSelectedTab("메뉴추가")}> 메뉴 추가 </button>
                        <button onClick={() => setSelectedTab("메뉴수정")}> 메뉴 수정 </button>
                    </div>
                    <div className={style["right_content"]}>
                        {selectedTab === "전체메뉴" && (
                            <div className={style["all_menu"]}>
                                {menuList.length > 0 ? (
                                    menuList.map(menu => (
                                        <div key={menu.id} className={style["menu_card"]}>
                                            <img
                                                src={`http://localhost:8080/image/imgfile/${menu.folder}/${menu.filename}`}
                                                alt={`http://localhost:8080/image/imgfile/${menu.folder}/${menu.filename}`}
                                                className={style["menu_image"]}
                                            />
                                            <div className={style["menu_info"]}>
                                                <p> {menu.menuName} </p>
                                                <div className={style["menu_status"]}>
                                                    <p> 판매중 </p>
                                                </div>
                                            </div>
                                            <div className={style["menu_price"]}>
                                                <p>{menu.menuPrice}원</p>
                                            </div>
                                            <div className={style["menuCRUD_button"]}>
                                                <button className={style["menu_edit"]}> 수정 </button>
                                                <button className={style["menu_soldout"]}> 품절 </button>
                                                <button className={style["menu_delete"]}> 삭제 </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>등록된 메뉴가 없습니다.</p>
                                )}
                            </div>
                        )}

                        {selectedTab === "메뉴추가" && (
                            <div className={style["insert_menu"]}>
                                <div className={style["image_insert"]}>
                                    <p> 사진 추가하기 </p>
                                </div>
                                <div className={style["insertmenu_info"]}>
                                    <input type="text" placeholder="메뉴명" /><br></br>
                                    <input type="text" placeholder="가격" /><br/>
                                    <button className={style["insertmenu_button"]}> 추가하기 </button>
                                </div>
                                
                            </div>
                        )}

                        {selectedTab === "메뉴수정" && (
                            <div className={style["edit_menu"]}>
                                메뉴수정
                            </div>
                        )}
                    </div>


                </div>
            </div>
        </>
    );
}