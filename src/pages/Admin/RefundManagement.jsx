import style from '../../CSS/AdminPage.module.css';
import styles from '../../CSS/StoreManagement.module.css';
import { useEffect, useState } from "react";

export default function RefundManagement() {
    const [subRefundBtn, setSubRefundBtn] = useState("캐시주문")
    const [paymentData, setPaymentData] = useState([]);
    const [paymentCash, setPaymentCash] = useState([]);

    useEffect(() => {
        // fetch("http://localhost:8080/api/payment/refund")
        //     .then(res => {
        //         if (!res.ok) throw new Error('서버 에러');
        //         return res.json();
        //     })
        //     .then(data => { console.log(data); setPaymentData(data) })
            // .catch(console.error);
        fetch("http://localhost:8080/api/payment/allPaymentCash")
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => { setPaymentCash(data) })
            .catch(console.error);
    })
    const handleStatusClick = (id) =>{
        
    }

    return (
        <div>
            <div className={style["side_menu_box"]}>
                <div className={style["side_title"]}>환불관리</div>
                <div className={style["side_btn"]}>
                    <button className={subRefundBtn === "배달주문" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubRefundBtn("배달주문") }}>배달주문</button>
                    <button className={subRefundBtn === "캐시주문" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubRefundBtn("캐시주문") }}>캐시주문</button>
                </div>
            </div>
            <div className={style["side_detail"]}>전체 환불을 관리하세요</div>
            {subRefundBtn === "캐시주문" && (
                <div>
                    {/* <div className={styles["input_value"]}>
                        <select id="table_th" value={selected} onChange={handleChange}>
                            <option value="orderId">주문번호</option>
                            <option value="roomId">채팅방</option>
                            <option value="nickname">사용자</option>
                            <option value="storeName">가게이름</option>
                        </select>
                        <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                        <button onClick={handleSearch}>검색</button>
                    </div> */}
                    <table className={styles["store_table"]}>
                        <thead>
                            <tr>
                                <th>주문번호</th><th>채팅방</th><th>사용자ID</th><th>가게이름</th><th>총주문금액</th><th>주문일시</th><th>상태</th><th>환불선택</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentCash.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td><td>{item.userId}</td><td>{item.comments}</td><td className={styles['status_button']}>
                                        {item.inout === 'out' && <div className={styles['status_out']}>환불</div>}
                                        {item.inout === 'in' && <div className={styles['status_in']}>충전</div>}
                                    </td><td>{item.amount}</td>
                                    <td className={styles['status_update']}>
                                        <button type='submit' onClick={() => handleStatusClick(item.id)}>환불</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}