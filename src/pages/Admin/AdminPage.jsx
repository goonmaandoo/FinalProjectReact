import styles from '../../CSS/AdminPage.module.css';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/user';


export default function AdminPage() {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [menu, setMenu] = useState("대시보드");

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/mainpage");
    }

    const menus = [
        { id: "dashboard", label:"대시보드", component:<dashboard/>, content: "오늘의 현황을 확인하세요"},
        { id: "order", label:"주문관리", component:<order/>, content: "전체 주문과 배송 상태를 관리하세요"},
        { id: "user", label:"회원관리", component:<user/>, content: "사용자 정보와 활동을 관리하세요"},
        { id: "store", label:"가게관리", component:<store/>, content: "파트너 음식점을 관리하고 새로운 음식점을 등록하세요"},
        { id: "active", label:"탈퇴/정지 회원 관리", component:<active/>, content: "탈퇴회원과 정지회원을 관리하세요"},
        { id: "qna", label:"문의내역", component:<qna/>, content: "문의 내역을 확인하고 처리하세요"},
        { id: "room", label:"공구방관리", component:<room/>, content: "진행중이거나 완료된 공구방을 관리하세요"},
        { id: "ban", label:"신고관리", component:<ban/>, content: "사용자 신고와 문의사항을 처리하세요"},
        { id: "refund", label:"환불관리", component:<refund/>, content: "환불내역을 확인하고 관리하세요"},
        { id: "review", label:"댓글관리", component:<review/>, content: "공구방과 음식점 리뷰 댓글을 관리하세요"}
    ]

    return (
        <>
            <header className={styles["admin_header"]}>
                <div className={styles["title"]}>배달모아-관리자페이지</div>
                <div className={styles["userinfo"]}>
                    <div className={styles["userName"]}>{user?.nickname}님</div>
                    <button className={styles["userName_btn"]} onClick={handleLogout}>로그아웃</button>
                </div>
            </header>
            <main className={styles["admin_main"]}>
                <div className={styles["side_bar"]}>
                    <div>
                        <ul className={styles["side_menu"]}>
                            {menus.map((tab) => (
                                <li key={tab.id}
                                    className={menu === tab.label ? styles["active_tab"] : ""}
                                    onClick={() => { setMenu(tab.label); window.scrollTo({ top: 0 }); }}>
                                        <span className={styles["side_imo"]}>
                                            <img src={`http://localhost:8080/image/imgfile/admin/${tab.id}.png`}/>
                                        </span>
                                        <span>{tab.label}</span>
                                    </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles["side_main"]}>
                    <div className={styles["side_menu"]}>{menu}</div>
                    <div className={styles["side_detail"]}>
                        {menus.find((tab) => tab.label === menu)?.content}
                    </div>
                    {menus.find((tab) => tab.label === menu)?.component}
                </div>
            </main>
        </>

    )
}