import style from '../../CSS/Admin/AdminPage.module.css';
import styles from '../../CSS/Admin/StoreManagement.module.css';
import { useEffect, useState } from "react";
import axios from "axios";


export default function RefundManagement() {
    const [subRefundBtn, setSubRefundBtn] = useState("all")
    const [paymentData, setPaymentData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/payment/allPayment?comments=${subRefundBtn}`)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => { console.log(data); setPaymentData(data) })
            .catch(console.error);
    }, [subRefundBtn])

    const handleStatusClick = async (amount, id) =>{
        const confirmed = window.confirm("환불 처리하시겠습니까?");
        if (!confirmed) return;

        try {
            await axios.post(
                `http://localhost:8080/api/payment/insertCashRefund?userId=${id}&amount=${amount}`
            );
            alert("환불 처리 완료");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("환불 처리 실패");
        }
    }

    const handleOrderClick = async (amount, id) =>{
        const confirmed = window.confirm("환불 처리하시겠습니까?");
        if (!confirmed) return;

        try {
            await axios.post(
                `http://localhost:8080/api/payment/insertCashRefund?userId=${id}&amount=${amount}`
            );
            alert("환불 처리 완료");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("환불 처리 실패");
        }
    }

    return (
        <div>
            <div className={style["side_menu_box"]}>
                <div className={style["side_title"]}>환불관리</div>
                <div className={style["side_btn"]}>
                    <button className={subRefundBtn === "all" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubRefundBtn("all") }}>전체</button>
                    <button className={subRefundBtn === "order" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubRefundBtn("order") }}>배달주문</button>
                    <button className={subRefundBtn === "cash" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubRefundBtn("cash") }}>캐시주문</button>
                </div>
            </div>
            <div className={style["side_detail"]}>전체 환불을 관리하세요</div>
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
                                <th>구분</th><th>사용자ID</th><th>닉네임</th><th>주문/캐시</th><th>충전/환불</th><th>주문금액</th><th>캐시</th><th>주문일시</th><th>환불버튼</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td><td>{item.email}</td><td>{item.nickName}</td><td className={styles['status_td']}>{item.comments === "cash" && "캐시"}{item.comments === "order" && "주문"}</td><td className={styles['status_td']}>
                                        {(item.inout === 'out' && item.comments === "cash") && <div className={styles['status_out']}>환불</div>}
                                        {(item.inout === 'in' && item.comments === "cash") && <div className={styles['status_in']}>충전</div>}
                                        {(item.inout === 'out' && item.comments === "order") && <div className={styles['status_in']}>주문</div>}
                                        {(item.inout === 'in' && item.comments === "order") && <div className={styles['status_in']}>주문취소</div>}
                                    </td><td>{item.amount}</td><td>{item.cash}</td><td>{item.createdAt}</td>
                                    <td className={styles['status_update']}>
                                        {(item.inout === "in" && item.comments === "cash") && <button type='submit' onClick={() => handleStatusClick(item.amount, item.userId)}>환불</button>}
                                        {(item.inout === "out" && item.comments === "order") && <button type='submit' onClick={() => handleOrderClick(item.amount, item.userId)}>주문취소</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    )
}