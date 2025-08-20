import { useEffect, useState } from "react";
import axios from "axios";
import style from "../../CSS/Owner/OwnerDashboard.module.css";

export default function OwnerDashboard() {
    // 공구방 카운트
    const [ingCount, setIngCount] = useState(0);
    const [recruitCount, setRecruitCount] = useState(0);

    // 주문 카운트
    const [todayOrderCount, setTodayOrderCount] = useState(0);
    const [totalOrderCount, setTotalOrderCount] = useState(0);

    // 오늘 매출액
    const [todaySales, setTodaySales] = useState(0);

    // 최근 주문 목록
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 진행 중/모집 중 공구방
                const [ingRes, recruitRes] = await Promise.all([
                    axios.get("/api/room/ingCount"),
                    axios.get("/api/room/joinIngCount")
                ]);
                setIngCount(ingRes.data);
                setRecruitCount(recruitRes.data);

                // 오늘/총 주문 건수
                const [todayOrdersRes, totalOrdersRes] = await Promise.all([
                    axios.get("/api/orders/orderTodayCount"),
                    axios.get("/api/orders/ordersCount")
                ]);
                setTodayOrderCount(todayOrdersRes.data);
                setTotalOrderCount(totalOrdersRes.data);

                // 전체 주문 가져오기
                const orderRes = await axios.get("/api/orders/getAllOrders");
                let ordersData = orderRes.data || [];

                // 최신순 정렬
                ordersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                // 오늘 날짜 (yyyy-mm-dd)
                const today = new Date().toISOString().slice(0, 10);

                // 오늘 주문 필터링
                const todayOrders = ordersData.filter(order =>
                    order.createdAt?.slice(0, 10) === today
                );

                // 오늘 매출액 합계
                const todaySalesSum = todayOrders.reduce(
                    (sum, order) => sum + (order.totalPrice || 0),
                    0
                );
                setTodaySales(todaySalesSum);

                // 최근 주문 4개만 추출
                ordersData = ordersData.slice(0, 4);

                // 사용자 정보 매핑 (주소)
                const userIds = [...new Set(
                    ordersData.map(o => o.userId ?? o.user_id).filter(Boolean)
                )];
                if (userIds.length > 0) {
                    const userRes = await axios.post("/api/users/findUsersByIds", userIds);
                    const usersData = userRes.data;
                    const userAddressMap = {};
                    usersData.forEach(user => {
                        const key = user.userId ?? user.id;
                        userAddressMap[key] = {
                            address: user.address,
                            addressDetail: user.addressDetail
                        };
                    });

                    ordersData = ordersData.map(order => {
                        let items = [];
                        try {
                            const roomOrderData =
                                typeof order.roomOrder === "string"
                                    ? JSON.parse(order.roomOrder)
                                    : order.roomOrder;
                            items = Array.isArray(roomOrderData)
                                ? roomOrderData
                                : roomOrderData?.menu || [];
                        } catch {
                            items = [];
                        }
                        return {
                            ...order,
                            items,
                            address: userAddressMap[order.userId]?.address || "주소 정보 없음",
                            addressDetail: userAddressMap[order.userId]?.addressDetail || ""
                        };
                    });
                }

                setRecentOrders(ordersData);
            } catch (err) {
                console.error("대시보드 데이터 불러오기 실패:", err);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className={style["outbox"]}>
            <div className={style["rightbox"]}>
                {/* 오늘 매출액 */}
                <div className={style["today_order"]}>
                    <div className={style["status_box"]}>
                        <h3>오늘 매출액</h3>
                        <h4>{todaySales.toLocaleString()}원</h4>
                    </div>
                </div>

                {/* 주문 건수 */}
                <div className={style["status_box_wrapper"]}>
                    <div className={style["status_box"]}>
                        <h3>오늘 주문건수</h3>
                        <h4>{todayOrderCount}건</h4>
                    </div>
                    <div className={style["status_box"]}>
                        <h3>총 주문건수</h3>
                        <h4>{totalOrderCount}건</h4>
                    </div>
                </div>

                {/* 공구방 */}
                <div className={style["status_box_wrapper"]}>
                    <div className={style["status_box"]}>
                        <h3>진행 중인 공구방</h3>
                        <h4>{ingCount}건</h4>
                    </div>
                    <div className={style["status_box"]}>
                        <h3>모집 중인 공구방</h3>
                        <h4>{recruitCount}건</h4>
                    </div>
                </div>

                {/* 최근 주문 */}
                <div className={style["recent_order_box"]}>
                    <h3>최근 주문</h3>
                    {recentOrders.length === 0 ? (
                        <p>주문 내역이 없습니다.</p>
                    ) : (
                        recentOrders.map(order => (
                            <div key={order.orderId} className={style.order_item}>
                                <div>
                                    <strong>주문번호:</strong> {order.orderId} <br />
                                    <strong>주문일자:</strong> {order.createdAt
                                        ? new Date(order.createdAt).toLocaleString()
                                        : "정보 없음"}
                                </div>
                                <div>
                                    <strong>주소:</strong> {order.address} {order.addressDetail}
                                </div>
                                <div>
                                    <strong>메뉴:</strong>{" "}
                                    {order.items.length > 0
                                        ? order.items.map((item, i) =>
                                            `${item.menu_name}(${item.quantity}개)`
                                        ).join(", ")
                                        : "없음"}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
