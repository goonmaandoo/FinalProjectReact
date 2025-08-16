import style from '../../CSS/Admin/AdminPage.module.css';
import styles from '../../CSS/Admin/OrderDetailManagement.module.css';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";


export default function OrderDetailManagement() {
    const { orderId } = useParams();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/orders/OrderDetail/${orderId}`)
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
                            <div className={styles["main_second_box_title"]}>주문번호 :</div>
                            <div>{orders.orderId}</div>
                        </div>
                        <div className={styles["main_second_box"]}>
                            <div className={styles["main_second_box_title"]}>주문시간 :</div>
                            <div>{orders.createdAt}</div>
                        </div>
                    </div>
                    <div className={styles["main_first_box"]}>
                        <div className={styles["main_second_box"]}>
                            <div className={styles["main_second_box_title"]}>주문자 :</div>
                            <div>{orders.nickname}</div>
                        </div>
                        <div className={styles["main_second_box"]}>
                            <div className={styles["main_second_box_title"]}>공구방 :</div>
                            <div>{orders.roomId}번방</div>
                        </div>
                    </div>
                </div>
                <div className={styles["main_second"]}>
                    <div className={styles["main_title"]}>주문상품</div>
                    <div className={styles["order_box"]}>
                        <div className={styles["sub_title"]}>가게정보</div>
                        <div className={styles["order_box_container"]}>
                            <div>
                                <span className={styles["order_box_title"]}>가게 이름 : </span>
                                <span className={styles["order_box_name"]}>{orders.storeName}</span>
                            </div>
                            <div>
                                <span className={styles["order_box_title"]}>가게 주소 : </span>
                                <span className={styles["order_box_name"]}>{orders.storeAddress}</span>
                            </div>
                            <div>
                                <span className={styles["order_box_title"]}>가게 전화번호 : </span>
                                <span className={styles["order_box_name"]}>{orders.tel}</span>
                            </div>
                        </div>
                        {orders.roomOrder && orders.roomOrder.map((item, index) => (
                            <div key={index}>
                                <div className={styles["sub_title"]}>메뉴정보</div>
                                <div className={styles["order_box_container2"]}>
                                    <div>
                                        <span className={styles["order_box_title1"]}>{item.menu_name}</span>
                                    </div>
                                    <div className={styles["order_box_title1"]}>수량: {item.quantity}개</div>
                                    <div className={styles["order_box_title1"]}>가격: {item.menu_price}원</div>
                                </div>
                            </div>
                            ))}
                        <div className={styles["order_box_total"]}>총 주문금액 : {orders.totalPrice}원</div>
                    </div>
                </div>
            </div>
        </>

    )
}