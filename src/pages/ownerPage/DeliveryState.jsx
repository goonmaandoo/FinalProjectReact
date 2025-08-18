import React, { useEffect, useState } from "react";
import axios from "axios";
import style from '../../CSS/Owner/DeliveryState.module.css';
import { useSelector } from 'react-redux';

export default function DeliveryState() {

    const user = useSelector((state) => state.auth.user);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrders, setExpandedOrders] = useState({});

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 한 페이지에 보여줄 주문 개수

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

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
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;



    return (
        <div className={style["outbox"]}>
            <div className={style["rightbox"]}>
                {orders.length === 0 && (
                    <div className={style["noOrders"]}>주문 내역이 없습니다.</div>
                )}

                {currentOrders.map(order => (
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
                                    {(() => {
                                        try {
                                            const menuList = JSON.parse(order.roomOrder);
                                            return menuList.map((item, index) => (
                                                <div key={index}>
                                                    <span className={style.menuName}> {item.menu_name} </span>
                                                    <span className={style.menuInfo}> 수량: {item.quantity}개</span>
                                                </div>
                                            ));
                                        } catch (e) {
                                            return order.roomOrder; // JSON 파싱 실패하면 원본 그대로
                                        }
                                    })()}
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

                {totalPages > 1 && (
                    <div className={style["pagination"]}>
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                                className={currentPage === number ? style["active"] : ""}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
