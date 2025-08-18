import styles from '../../CSS/Admin/AdminPage.module.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link, Outlet } from "react-router-dom";
import { logout } from '../../redux/user';




export default function AdminPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    

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
        { id: "dashboard", label: "대시보드", path: "dashboard", content: "오늘의 현황을 확인하세요"  },
        { id: "order", label: "주문관리", path: "ordermanagement", content: "전체 주문과 배송 상태를 관리하세요" },
        { id: "user", label: "회원관리", path: "usermanagement", content: "사용자 정보와 활동을 관리하세요" },
        { id: "store", label: "가게관리", path: "storemanagement", content: "파트너 음식점을 관리하고 새로운 음식점을 등록하세요" },
        { id: "active", label: "탈퇴/정지 회원 관리", path: "active", content: "탈퇴회원과 정지회원을 관리하세요" },
        { id: "qna", label: "문의내역", path: "qnamanagement", content: "문의 내역을 확인하고 처리하세요" },
        { id: "room", label: "공구방관리", path: "roommanagement", content: "진행중이거나 완료된 공구방을 관리하세요" },
        { id: "report", label: "신고관리", path: "reportmanagement", content: "사용자 신고와 문의사항을 처리하세요" },
        { id: "refund", label: "환불관리", path: "refund", content: "환불내역을 확인하고 관리하세요" },
        { id: "orderdetail", label: "주문상세", path: "orderdetail", content: "주문의 상세 정보를 확인하고 관리하세요" },
        { id: "review", label: "댓글관리", path: "reviewadmin", content: "공구방과 음식점 리뷰 댓글을 관리하세요"  }
    ];


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
                                {menus.filter(tab => tab.id !== "orderdetail").map((tab) => {
                                    const currentPath = location.pathname.split("/").pop();
                                    const isActive = currentPath === tab.path;
                                    return(
                                        <li key={tab.id}
                                        className={isActive ? styles["active_tab"] : ""}
                                        onClick={() => { if (tab.path) navigate(tab.path); window.scrollTo({ top: 0 }); }}>
                                        <span className={styles["side_imo"]}>
                                            <img src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/admin/${tab.id}.png`} />
                                        </span>
                                        <span>{tab.label}</span>
                                    </li>   
                                    )
                                })}
                            </ul>
                        </div>
                        <div>
                            <Link to="/mainpage" className={styles["go_to_mainpage"]}>← 메인페이지</Link>
                        </div>
                    </div>
                    <div className={styles["side_main"]}> 
                        <Outlet/>
                    </div>
                </div>
            </main>
        </>
    )
}