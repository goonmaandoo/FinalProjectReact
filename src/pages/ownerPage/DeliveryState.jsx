import React, { useEffect, useState } from "react";
import axios from "axios";
import style from '../../CSS/DeliveryState.module.css';
import { useDispatch, useSelector } from 'react-redux';

export default function DeliveryState() {

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState({});
    const [room, setRoom] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axios.get(`/api/room/ownerDeliverySelect?ownerId=${user.id}`)
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("데이터를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            });
    };

    const toggleExpand = (orderId) => {
        setExpandedOrders(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    const stateUpdate = (roomId, newStatus) => {
        axios.put('/api/room/ownerDeliveryUpdate', {
            roomId: roomId,
            status: newStatus
        })
            .then(() => {
                alert(`상태가 '${newStatus}' (으)로 변경되었습니다. `);
                fetchOrders();
            })
            .catch((err) => {
                console.error(err);
                alert("상태 변경 중 오류가 발생했습니다.");
            })
    }

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={style["outbox"]}>
            <div className={style["rightbox"]}>
                {orders.length === 0 && (
                    <div className={style["noOrders"]}>주문 내역이 없습니다.</div>
                )}

                {orders.map(order => (
                    <div key={order.orderId} className={style.deliveryStateBox}>
                        <div className={style.deliveryInfo}>
                            <div className={style.orderHeader}>
                                <div className={style.roomNumber}>방번호 : {order.roomId}</div>
                                <div className={style.orderNumber}>주문번호 : {order.orderId}</div>
                                <div
                                    className={style.menuCount}
                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                    onClick={() => toggleExpand(order.orderId)}
                                >
                                    메뉴 : {expandedOrders[order.orderId] ? '▲' : '▼'}
                                </div>
                            </div>

                            {expandedOrders[order.orderId] && (
                                <div className={style.menuDetail} style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                                    {order.roomOrder}
                                </div>
                            )}

                            <div className={style.address}>
                                주소 : {order.roomAddress} &nbsp; {order.roomAddressDetail}
                            </div>
                            <div className={style.status}>배송현황 : {order.status}</div>
                        </div>

                        <div className={style.statusButtons}>
                            <button
                                onClick={() => stateUpdate(order.roomId, "조리중")}
                                style={{
                                    backgroundColor: order.status === "조리중" ? "#ff6b6b" : "#d9d9d9",
                                    color: order.status === "조리중" ? "white" : "black",
                                }}
                            >
                                조리중
                            </button>
                            <button
                                onClick={() => stateUpdate(order.roomId, "배달중")}
                                style={{
                                    backgroundColor: order.status === "배달중" ? "#ff6b6b" : "#d9d9d9",
                                    color: order.status === "배달중" ? "white" : "black",
                                }}
                            >
                                배달중
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}