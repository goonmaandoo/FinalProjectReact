import style from '../../CSS/Admin/AdminPage.module.css';
import styles from '../../CSS/Admin/StoreManagement.module.css';
import { useEffect, useState } from "react";
import axios from "axios";


export default function RefundManagement() {
    const [subRefundBtn, setSubRefundBtn] = useState("all")
    const [paymentData, setPaymentData] = useState([]);
    const [selected, setSelected] = useState('user');
    const [keyword, setKeyword] = useState("");

    const handleChange = (e) => {
        setSelected(e.target.value);
    };

    useEffect(() => {
        fetch(`/api/payment/allPayment?comments=${subRefundBtn}`)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => { console.log(data); setPaymentData(data) })
            .catch(console.error);
    }, [subRefundBtn])

    const handleStatusClick = async (id, amount, userId) =>{
        const confirmed = window.confirm("환불 처리하시겠습니까?");
        if (!confirmed) return;

        try {
            await axios.post(
                `/api/payment/insertCashRefund?userId=${userId}&amount=${amount}`
            );
            alert("환불 처리 완료");

            await axios.post(
                `/api/payment/updateStatus?id=${id}`
            )
            
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("환불 처리 실패");
        }
    }

    const handleOrderClick = async (id, amount, userId) =>{
        const confirmed = window.confirm("주문 취소하시겠습니까?");
        if (!confirmed) return;

        try {
            await axios.post(
                `/api/payment/insertOrderCancel?userId=${userId}&amount=${amount}`
            );
            alert("주문 취소 완료");

            await axios.post(
                `/api/payment/updateStatus?id=${id}`
            )

            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("주문 취소 실패");
        }
    }
    const handleSearch = () => {
        let url = '/api/payment/';
        if (subRefundBtn === 'all') {
            url += `refundSearchAll?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        } else if (subRefundBtn === 'cash') {
            url += `refundSearchCash?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        } else if (subRefundBtn === 'order') {
            url += `refundSearchOrder?type=${selected}&keyword=${encodeURIComponent(keyword)}`;
        }
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => { console.log(data); setPaymentData(data)})
            .catch(console.error);
    };

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
                    <div className={styles["input_value"]}>
                        <select id="table_th" value={selected} onChange={handleChange}>
                            <option value="email">사용자ID</option>
                            <option value="nickname">사용자</option>
                            {subRefundBtn === "order" ? "" : <option value="outCash">환불</option>}
                            {subRefundBtn === "cash" ? "" : <option value="InOrder">주문취소</option>}
                        </select>
                        <input type='text' value={keyword} onChange={(e) => setKeyword(e.target.value)} disabled={selected === 'outCash' || selected === 'InOrder'} placeholder={selected === 'outCash' ? '환불' : selected === 'InOrder' ? '주문취소' : '검색어 입력'} />
                        <button onClick={handleSearch}>검색</button>
                    </div>
                    <table className={styles["store_table"]}>
                        <thead>
                            <tr>
                                <th>구분</th><th>사용자ID</th><th>닉네임</th><th>주문/캐시</th><th>충전/환불</th><th>주문금액</th><th>캐시</th><th>주문일시</th><th>환불버튼</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentData.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td><td>{item.email}</td><td>{item.nickname}</td><td className={styles['status_td']}>{item.comments === "cash" && "캐시"}{item.comments === "order" && "주문"}</td><td className={styles['status_td']}>
                                        {(item.inout === 'out' && item.comments === "cash") && <div className={styles['status_out']}>환불</div>}
                                        {(item.inout === 'in' && item.comments === "cash") && <div className={styles['status_in']}>충전</div>}
                                        {(item.inout === 'out' && item.comments === "order") && <div className={styles['status_in']}>주문</div>}
                                        {(item.inout === 'in' && item.comments === "order") && <div className={styles['status_out']}>주문취소</div>}
                                    </td><td>{item.amount}</td><td>{item.cash}</td><td>{item.createdAt}</td>
                                    <td className={styles['status_update']}>
                                        {(item.inout === "in" && item.comments === "cash" && item.status !== "refund") && <button type='submit' onClick={() => handleStatusClick(item.id, item.amount, item.userId)}>환불</button>}
                                        {(item.inout === "out" && item.comments === "order" && item.status !== "refund") && <button type='submit' onClick={() => handleOrderClick(item.id, item.amount, item.userId)}>주문취소</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    )
}