import styles from '../../CSS/StoreManagement.module.css';
import { useState, useEffect } from 'react';

export default function OrderManagement() {
    const [orders, setOrders] = useState([]);
    const [selected, setSelected] = useState('orderId');
    const [keyword, setKeyword] = useState("");

    const handleChange = (e) => {
        setSelected(e.target.value);
    };

    const handleSearch = () => {
        let url = 'http://localhost:8080/api/orders/orderSearch';
        console.log(orders.map(o => o.orderId))
        if (keyword.trim() !== '') {
            url += `?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        }
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => {console.log(data); setOrders(data)})
            .catch(console.error);
    };
    //데이터 불러오기
    useEffect(() => {
        fetch('http://localhost:8080/api/orders/orderList')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => {console.log(data); setOrders(data)})
            
            .catch(console.error);
    }, [])
    return (
        <>
            <div className={styles["input_value"]}>
                <select id="table_th" value={selected} onChange={handleChange}>
                    <option value="orderId">주문번호</option>
                    <option value="roomId">채팅방</option>
                    <option value="nickname">사용자</option>
                    <option value="storeName">가게이름</option>
                </select>
                <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button onClick={handleSearch}>검색</button>
            </div>

            <table className={styles["store_table"]}>
                <thead>
                    <tr>
                        <th>주문번호</th><th>채팅방</th><th>사용자ID</th><th>가게이름</th><th>총주문금액</th><th>주문일시</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((item) => (
                        <tr key={item.orderId}>
                            <td>{item.orderId}</td><td>{item.roomId}</td><td>{item.nickname}</td><td>{item.storeName}</td><td>{item.totalPrice}</td><td>{item.createdAt}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </>
    )
}