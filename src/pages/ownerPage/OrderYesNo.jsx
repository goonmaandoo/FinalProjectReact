import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../../CSS/Owner/OwnerDashboard.module.css";

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrderIds, setExpandedOrderIds] = useState(new Set());

    useEffect(() => {
        const fetchOrdersAndUsers = async () => {
            try {
                setLoading(true);


                const orderRes = await axios.get("/api/orders/getAllOrders");
                const ordersData = orderRes.data;

                console.log("ordersData sample:", ordersData[0]);

 
                const userIds = [
                    ...new Set(
                        ordersData
                            .map((order) => order.userId ?? order.user_id ?? order.id)
                            .filter(Boolean)
                    ),
                ];
                console.log("userIds extracted:", userIds);


                const userRes = await axios.post("/api/users/findUsersByIds", userIds);
                const usersData = userRes.data;

                console.log("usersData from backend:", usersData);


                const userAddressMap = {};
                usersData.forEach((user) => {
                    const key = user.userId ?? user.id;
                    userAddressMap[key] = {
                        address: user.address,
                        addressDetail: user.addressDetail,
                    };
                });


                const parsedOrders = ordersData.map((order) => {
                    let items = [];
                    try {
                        const roomOrderData =
                            typeof order.roomOrder === "string"
                                ? JSON.parse(order.roomOrder)
                                : order.roomOrder;

            
                        items = Array.isArray(roomOrderData)
                            ? roomOrderData
                            : roomOrderData.menu || [];
                    } catch (e) {
                        items = [];
                    }

      
                    const userKey = order.userId ?? order.user_id ?? order.id;
                    const userAddr = userAddressMap[userKey] || {};

                    return {
                        ...order,
                        items,
                        address: userAddr.address || "주소 정보 없음",
                        addressDetail: userAddr.addressDetail || "",
                    };
                });

                setOrders(parsedOrders);
            } catch (error) {
                alert("주문 목록을 불러오는데 실패했습니다.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrdersAndUsers();
    }, []);


    const toggleExpand = (orderId) => {
        setExpandedOrderIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) newSet.delete(orderId);
            else newSet.add(orderId);
            return newSet;
        });
    };

    return (
        
            <div className={style.main_content}>
                <div className={style.order_list_container}>
                    <div className={style.order_list_header}>주문 내역</div>

                    {loading ? (
                        <div className={style.empty_state}>불러오는 중...</div>
                    ) : orders.length === 0 ? (
                        <div className={style.empty_state}>주문 내역이 없습니다.</div>
                    ) : (
                        orders.map((order) => {
                            const isExpanded = expandedOrderIds.has(order.orderId);
                            return (
                                <div key={order.orderId} className={style.order_item}>
                                    <div className={style.order_header}>
                                        <span className={style.order_number}>
                                            주문번호: {order.orderId}
                                        </span>
                                        <span className={style.order_time}>
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleString()
                                                : "주문일자 정보 없음"}
                                        </span>
                                    </div>

                                    <div
                                        className={style.menu_title_row}
                                        onClick={() => toggleExpand(order.orderId)}
                                    >
                                        메뉴&nbsp;
                                        <span>
                                            {isExpanded ? "▼" : "▶"}
                                        </span>
                                    </div>

                                    {isExpanded && (
                                        <div className={style.order_items}>
                                            {order.items.length > 0 ? (
                                                order.items.map((item, idx) => (
                                                    <div key={idx} className={style.menu_item_row}>
                                                        <span>{item.menu_name}</span>
                                                        <span>{item.quantity}개</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>주문 항목이 없습니다.</div>
                                            )}
                                        </div>
                                    )}

                                    <div className={style.customer_info}>
                                        주소: {order.address} {order.addressDetail}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        
    );
}