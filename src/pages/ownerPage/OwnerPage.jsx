import styles from '../../CSS/OwnerPage.module.css';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import { logout } from '../../redux/user';
import OwnerDashboard from './OwnerDashboard';
import StoreRegister from './StoreRegister';
import OwnerMenuEdit from './OwnerMenuEdit';
import DeliveryState from './DeliveryState';
import ReviewManagement from './ReviewManagement';
import OrderYesNo from './OrderYesNo';
import OwnerStoreList from './OwnerStoreList';

export default function OwnerPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [menu, setMenu] = useState("대시보드");

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/mainpage");
    }
    useEffect(() => {
        console.log("현재 user 값:", user);
        if (!user || user.role !== "owner") {
            navigate("/mainpage");
        }
    }, [user, navigate]);

    const menus = [
        { id: "dashboard", label: "대시보드", component: <OwnerDashboard/>, content: "실시간 주문과 매출을 확인하세요 " },
        { id: "storeregister", label: "가게등록", component: <StoreRegister/>, content: "가게 등록을 신청하세요" },
        {id: "store", label: "가게관리", component: <OwnerStoreList/>,
        content: "가게를 관리하세요"},
        { id: "menu", label: "메뉴관리", component: <OwnerMenuEdit/>, content: "메뉴를 관리하세요" },
        // { id: "delivery", label: "배달접수/현황", component: <DeliveryState/>, content: "배달을 접수하고 배달 현황을 관리하세요" },
        { id: "review", label: "리뷰관리", component: <ReviewManagement/>, content: "가게 리뷰를 관리하세요" },

        { id: "order", label: "주문접수/취소", component: <OrderYesNo/>, content: "실시간으로 들어오는 주문을 관리하세요" }

    ]
    

    return (
        <>
            <div className={styles["container_header"]}>
                <header className={styles["admin_header"]}>
                    <div className={styles["title"]}>배달모아 - 사장님 페이지</div>
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
                                            <img src={`http://localhost:8080/image/imgfile/owner/${tab.id}.png`} />
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
                        <div className={styles["side_menu"]}>{menu}</div>
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