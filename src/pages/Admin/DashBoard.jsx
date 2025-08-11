import { useState, useEffect  } from 'react';
import styles from '../../CSS/Dashboard.module.css';


export default function Dashboard() {
    const [ join, setJoin] = useState(0);
    const [ ing, setIng] = useState(0);
    const [ end, setEnd] = useState(0);
    const [ total, setTotal] = useState(0);
    const [ users, setUsers] = useState(0);

    useEffect(() => {
            //전체 공구방
            fetch('http://localhost:8080/api/room/totalCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count  => setTotal(count))
            .catch(console.error);
            //모집중
            fetch('http://localhost:8080/api/room/joinIngCount')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(count  => setJoin(count))
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
        },[]);

    return (
        <main className={styles["dash_main_box"]}>
            <div className={styles["dash_box"]}>
                <div className={styles["total_first"]}>
                    <div className={styles["total_title"]}>총 공구방</div>
                    <div className={styles["total_num"]}>{total}</div>
                </div>
                <hr />
                <div className={styles["total_first"]}>
                    <div className={styles["total_title"]}>모집중</div>
                    <div className={styles["total_num"]}>{join}</div>
                </div>
                <hr />
                <div className={styles["total_first"]}>
                    <div className={styles["total_title"]}>진행중</div>
                    <div className={styles["total_num"]}>{ing}</div>
                </div>
                <hr />
                <div className={styles["total_first"]}>
                    <div className={styles["total_title"]}>진행 마감</div>
                    <div className={styles["total_num"]}>{end}</div>
                </div>
            </div>
            <div className={styles["dash_box"]}>
                <div className={styles["total_second"]}>
                    <div className={styles["total_title"]}>
                        <span><img src={`http://localhost:8080/image/imgfile/main_img/today_order.png`} /></span>오늘 주문 건수</div>
                    <div className={styles["total_num"]}>?건</div>
                </div>
                <hr />
                <div className={styles["total_second"]}>
                    <div className={styles["total_title"]}><span><img src={`http://localhost:8080/image/imgfile/main_img/today_order.png`} /></span>총 주문 건수</div>
                    <div className={styles["total_num"]}>?건</div>
                </div>
            </div>
            <div className={styles["dash_box"]}>
                <div className={styles["total_third"]}>
                    <div className={styles["total_title"]}>회원수</div>
                    <div className={styles["total_num"]}>{users}명</div>
                </div>
            </div>
            <div className={styles["dash_box"]}>
                <div className={styles["total_third"]}>
                    <div className={styles["total_title"]}>총 매출</div>
                    <div className={styles["total_num"]}>$?</div>
                </div>
            </div>
        </main>
    )
}