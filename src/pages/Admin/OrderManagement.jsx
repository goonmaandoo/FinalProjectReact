import styles from '../../CSS/Admin/StoreManagement.module.css';
import style from '../../CSS/Admin/AdminPage.module.css';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [cash, setCash] = useState([]);
    const [selected, setSelected] = useState('orderId');
    const [keyword, setKeyword] = useState("");
    const [subOrderBtn, setSubOrderBtn] = useState("배달주문");

    const handleChange = (e) => {
        setSelected(e.target.value);
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
            handleCashSearch();
        }
    }

    const handleSearch = () => {
        let url = 'http://localhost:8080/api/orders/orderSearch';
        if (keyword.trim() !== '') {
            url += `?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        }
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => { console.log(data); setOrders(data) })
            .catch(console.error);
    };

    const handleCashSearch = () => {
        let url = 'http://localhost:8080/api/payment/search';
        if (keyword.trim() !== '') {
            url += `?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        }
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => { console.log(data); setCash(data) })
            .catch(console.error);
    };

    //데이터 불러오기
    useEffect(() => {
        fetch('http://localhost:8080/api/orders/orderList')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => { console.log(data); setOrders(data) })
            .catch(console.error);
        fetch(`http://localhost:8080/api/payment/allPaymentInOnly`)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => { console.log(data); setCash(data) })
            .catch(console.error);
    }, [])
    return (
        <>
            <div>
                <div className={style["side_menu_box"]}>
                    <div className={style["side_title"]}>주문관리</div>
                    <div className={style["side_btn"]}>
                        <button className={subOrderBtn === "배달주문" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubOrderBtn("배달주문") }}>배달주문</button>
                        <button className={subOrderBtn === "캐시주문" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubOrderBtn("캐시주문") }}>캐시주문</button>
                    </div>
                </div>
                <div className={style["side_detail"]}>전체 주문과 배송 상태를 관리하세요</div>
            </div>
            <div>
                {subOrderBtn === "배달주문" &&
                    <>
                        <div className={styles["input_value"]}>
                            <select id="table_th" value={selected} onChange={handleChange}>
                                <option value="orderId">주문번호</option>
                                <option value="roomId">채팅방</option>
                                <option value="nickname">사용자</option>
                                <option value="storeName">가게이름</option>
                            </select>
                            <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={onKeyDown}/>
                            <button onClick={handleSearch}>검색</button>
                        </div>
                        <div>&darr; 주문상세페이지 </div>
                        <table className={styles["store_table"]}>
                            <thead>
                                <tr>
                                    <th>주문번호</th><th>채팅방</th><th>사용자</th><th>가게이름</th><th>총주문금액</th><th>주문일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((item) => (
                                    <tr key={item.orderId}>
                                        <td><Link to={`/admin/orderdetail/${item.orderId}`}>{item.orderId}</Link></td><td>{item.roomId}</td><td>{item.nickname}</td><td>{item.storeName}</td><td>{item.totalPrice}</td><td>{item.createdAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                }
                {subOrderBtn === "캐시주문" &&
                    <>
                        <div className={styles["input_value"]}>
                            <select id="table_th" value={selected} onChange={handleChange}>
                                <option value="id">구매번호</option>
                                <option value="email">사용자ID</option>
                                <option value="nickname">사용자</option>
                            </select>
                            <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={onKeyDown}/>
                            <button onClick={handleCashSearch}>검색</button>
                        </div>
                        <table className={styles["store_table"]}>
                            <thead>
                                <tr>
                                    <th>구매번호</th><th>사용자ID</th><th>닉네임</th><th>주문금액</th><th>캐시</th><th>주문일시</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cash.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td><td>{item.email}</td><td>{item.nickname}</td><td>{item.amount}</td><td>{item.cash}</td><td>{item.createdAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                }
            </div>
        </>
    )
}