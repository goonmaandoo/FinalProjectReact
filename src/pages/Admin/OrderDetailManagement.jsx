import style from '../../CSS/AdminPage.module.css';
import styles from '../../CSS/Admin/OrderDetailManagement.module.css';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";


export default function OrderDetailManagement() {
    const { orderId } = useParams();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/orders/getTheOrder/${orderId}`)
            .then(res => {
                setOrders(res.data);
            })
            .catch(err => console.error("RoomsbyId error:", err));
    })

    return (
        <>
            <div>
                <div className={style["side_menu_box"]}>
                    <div className={style["side_title"]}>주문상세</div>
                </div>
                <div className={style["side_detail"]}>주문의 상세 정보를 확인하고 관리하세요</div>
            </div>
            <div className={styles["main_container"]}>
                <div className={styles["main_first"]}>
                    <div className={styles["main_title"]}>주문정보</div>
                    <div className={styles["main_first_box"]}>
                        <div className={styles["main_second_box"]}>
                            <div>주문번호</div>
                            <div>{orders.orderId}</div>
                        </div>
                        <div className={styles["main_second_box"]}>
                            <div>주문시간</div>
                            <div>{orderId}</div>
                        </div>
                    </div>
                    <div className={styles["main_first_box"]}>
                        <div className={styles["main_second_box"]}>
                            <div>공구방</div>
                            <div>{orderId}</div>
                        </div>
                        <div className={styles["main_second_box"]}>
                            <div>주문시간</div>
                            <div>{orderId}</div>
                        </div>
                    </div>
                </div>
                <div className={styles["main_second"]}>
                    <div className={styles["main_title"]}>주문상품</div>
                    <div className={styles["order_box"]}>
                        <div className={styles["order_box_title"]}>주문가게: </div>
                        <div className={styles["order_box_title"]}>주문시간: </div>
                        <div className={styles["order_box_title"]}>주문메뉴: </div>
                        <div className={styles["order_box_title"]}>주문가격: </div>
                    </div>
                </div>
            </div>
        </>

    )
}