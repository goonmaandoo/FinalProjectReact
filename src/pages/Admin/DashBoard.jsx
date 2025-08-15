import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import styles from '../../CSS/Admin/Dashboard.module.css';
import style from '../../CSS/Admin/AdminPage.module.css';


export default function Dashboard() {
    const [join, setJoin] = useState(0);
    const [ing, setIng] = useState(0);
    const [end, setEnd] = useState(0);
    const [total, setTotal] = useState(0);
    const [users, setUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [todayOrders, setTodayOrders] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        //전체 공구방
        fetch('http://localhost:8080/api/room/totalCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setTotal(count))
            .catch(console.error);
        //모집중
        fetch('http://localhost:8080/api/room/joinIngCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setJoin(count))
            .catch(console.error);
        //진행중
        fetch('http://localhost:8080/api/room/ingCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setIng(count))
            .catch(console.error);
        //진행마감
        fetch('http://localhost:8080/api/room/endCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setEnd(count))
            .catch(console.error);
        //사용자수
        fetch('http://localhost:8080/api/users/totalCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setUsers(count))
            .catch(console.error);
        //총주문수
        fetch('http://localhost:8080/api/orders/orderTodayCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setTodayOrders(count))
            .catch(console.error);
        //총주문수
        fetch('http://localhost:8080/api/orders/ordersCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count => setTotalOrders(count))
            .catch(console.error);
    }, []);

    return (
        <>
            <div>
                <div className={style["side_menu_box"]}>
                    <div className={style["side_title"]}>대시보드</div>
                </div>
                <div className={style["side_detail"]}>오늘의 현황을 확인하세요</div>
            </div>
            <main className={styles["dash_main_box"]}>
                <div className={styles["dash_box"]}>
                    <div className={styles["total_first"]}>
                        <div className={styles["total_title"]}>총 공구방</div>
                        <div className={styles["total_num"]}><Link to="/admin/roommanagement">{total}</Link></div>
                    </div>
                    <hr />
                    <div className={styles["total_first"]}>
                        <div className={styles["total_title"]}>모집중</div>
                        <div className={styles["total_num"]}><Link to="/admin/roommanagement">{join}</Link></div>
                    </div>
                    <hr />
                    <div className={styles["total_first"]}>
                        <div className={styles["total_title"]}>진행중</div>
                        <div className={styles["total_num"]}><Link to="/admin/roommanagement">{ing}</Link></div>
                    </div>
                    <hr />
                    <div className={styles["total_first"]}>
                        <div className={styles["total_title"]}>진행 마감</div>
                        <div className={styles["total_num"]}><Link to="/admin/roommanagement">{end}</Link></div>
                    </div>
                </div>
                <div className={styles["dash_box"]}>
                    <div className={styles["total_second"]}>
                        <div className={styles["total_title"]}>
                            <span><img src={`http://localhost:8080/image/imgfile/main_img/today_order.png`} /></span>
                            오늘 주문 건수
                        </div>
                        <div className={styles["total_num"]}>
                            <Link to="/admin/ordermanagement">{todayOrders}건</Link></div>
                    </div>
                    <hr />
                    <div className={styles["total_second"]}>
                        <div className={styles["total_title"]}><span><img src={`http://localhost:8080/image/imgfile/main_img/today_order.png`} /></span>총 주문 건수</div>
                        <div className={styles["total_num"]}>
                            <Link to="/admin/ordermanagement">{totalOrders}건</Link></div>
                    </div>
                </div>
                <div className={styles["dash_box"]}>
                    <div className={styles["total_third"]}>
                        <div className={styles["total_title"]}>회원수</div>
                        <div className={styles["total_num"]}><Link to="/admin/roommanagement">{users}명</Link></div>
                    </div>
                </div>
                <div className={styles["dash_box"]}>
                    <div className={styles["total_third"]}>
                        <div className={styles["total_title"]}>총 매출</div>
                        <div className={styles["total_num"]}>$?</div>
                    </div>
                </div>
            </main>
        </>
    )
}