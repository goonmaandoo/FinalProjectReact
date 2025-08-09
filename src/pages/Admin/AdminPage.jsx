import styles from '../../CSS/AdminPage.module.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { logout } from '../../redux/user';
import Dashboard from "./Dashboard";
import StoreManagement from './StoreManagement';
import UserManagement from './UserManagement';
import Active from './ActiveManagement';


export default function AdminPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [menu, setMenu] = useState("대시보드");
    const [subOrderBtn, setSubOrderBtn] = useState("배달주문");
    const [subUserBtn, setSubUserBtn] = useState("all");
    const [subBanBtn, setSubBanBtn] = useState("all");
    const [ orderComponent, setOrderComponent ] = useState("</deliveryorder>")

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/mainpage");
    }
    useEffect(() => {
        console.log("현재 user 값:", user);
        if (!user || user.role !== "admin") {
            navigate("/mainpage");
        }
    }, [user, navigate]);

    const menus = [
        { id: "dashboard", label: "대시보드", component: <Dashboard />, content: "오늘의 현황을 확인하세요" },
        { id: "order", label: "주문관리", component: orderComponent, content: "전체 주문과 배송 상태를 관리하세요" },
        { id: "user", label: "회원관리", component: <UserManagement roleFilter={subUserBtn}/>, content: "사용자 정보와 활동을 관리하세요" },
        { id: "store", label: "가게관리", component: <StoreManagement />, content: "파트너 음식점을 관리하고 새로운 음식점을 등록하세요" },
        { id: "active", label: "탈퇴/정지 회원 관리", component: <Active roleFilter={subBanBtn}/>, content: "탈퇴회원과 정지회원을 관리하세요" },
        { id: "qna", label: "문의내역", component: <qna />, content: "문의 내역을 확인하고 처리하세요" },
        { id: "room", label: "공구방관리", component: <room />, content: "진행중이거나 완료된 공구방을 관리하세요" },
        { id: "ban", label: "신고관리", component: <ban />, content: "사용자 신고와 문의사항을 처리하세요" },
        { id: "refund", label: "환불관리", component: <refund />, content: "환불내역을 확인하고 관리하세요" },
        { id: "review", label: "댓글관리", component: <review />, content: "공구방과 음식점 리뷰 댓글을 관리하세요" }
    ]

    return (
        <>
            <div className={styles["container_header"]}>
                <header className={styles["admin_header"]}>
                    <div className={styles["title"]}>배달모아-관리자페이지</div>
                    <div className={styles["userinfo"]}>
                        <div className={styles["userName"]}>{user?.nickname}님</div>
                        <button className={styles["userName_btn"]} onClick={handleLogout}>로그아웃</button>
                    </div>
                </header>
            </div>
            <main className={styles["admin_main"]}>
                <div className={styles["container"]}>
                    <div className={styles["side_bar"]}>
                        <div>
                            <ul className={styles["side_menu"]}>
                                {menus.map((tab) => (
                                    <li key={tab.id}
                                        className={menu === tab.label ? styles["active_tab"] : ""}
                                        onClick={() => { setMenu(tab.label); window.scrollTo({ top: 0 }); }}>
                                        <span className={styles["side_imo"]}>
                                            <img src={`http://localhost:8080/image/imgfile/admin/${tab.id}.png`} />
                                        </span>
                                        <span>{tab.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <Link to="/mainpage" className={styles["go_to_mainpage"]}>← 메인페이지</Link>
                        </div>
                    </div>
                    <div className={styles["side_main"]}>
                        <div className={styles["side_menu_box"]}>
                            <div className={styles["side_title"]}>{menu}{(menu === "회원관리") && (subUserBtn === "user") ? " - 사용자" : ""}{(menu === "회원관리") && (subUserBtn === "owner") ? " - 사장님" : ""}</div>
                            <div>
                                {menu === "주문관리" && (
                                    <div className={styles["side_btn"]}>
                                        <button className={subOrderBtn === "배달주문" ? styles["active_btn"] : styles["unactive_btn"]} onClick={() => { setSubOrderBtn("배달주문"); setOrderComponent("</deliveryorder>"); }}>배달주문</button>
                                        <button className={subOrderBtn === "캐시주문" ? styles["active_btn"] : styles["unactive_btn"]} onClick={() => { setSubOrderBtn("캐시주문"); setOrderComponent("</cashorder>");}}>캐시주문</button>
                                    </div>
                                )}
                                {menu === "회원관리" && (
                                    <div className={styles["side_btn"]}>
                                        <button className={subUserBtn === "all" ? styles["active_btn"] : styles["unactive_btn"]} onClick={() => { setSubUserBtn("all");}}>전체</button>
                                        <button className={subUserBtn === "user" ? styles["active_btn"] : styles["unactive_btn"]} onClick={() => { setSubUserBtn("user");}}>사용자</button>
                                        <button className={subUserBtn === "owner" ? styles["active_btn"] : styles["unactive_btn"]} onClick={() => { setSubUserBtn("owner");}}>사장님</button>
                                    </div>
                                )}
                                {menu === "탈퇴/정지 회원 관리" && (
                                    <div className={styles["side_btn"]}>
                                        <button className={subBanBtn === "all" ? styles["active_btn"] : styles["unactive_btn"]} onClick={() => { setSubBanBtn("all"); }}>전체</button>
                                        <button className={subBanBtn === "unactive" ? styles["active_btn"] : styles["unactive_btn"]} onClick={() => { setSubBanBtn("unactive"); }}>탈퇴</button>
                                        <button className={subBanBtn === "ban" ? styles["active_btn"] : styles["unactive_btn"]} onClick={() => { setSubBanBtn("ban"); }}>정지</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles["side_detail"]}>
                            {menus.find((tab) => tab.label === menu)?.content}
                        </div>
                        <div>
                            {menus.find((tab) => tab.label === menu)?.component}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}