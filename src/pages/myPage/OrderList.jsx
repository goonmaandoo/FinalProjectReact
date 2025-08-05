import { useState, useEffect } from "react";
import styles from "../../CSS/OrderList.module.CSS";
import axios from "axios";

export default function OrderList() {
  const [openOrderIds, setOpenOrderIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [roomOrderMap, setRoomOrderMap] = useState({});

  const itemsPerPage = 5;

  const userId = 1;
  //테스트용 userId. 나중에 로그인 id 연동 예정.

  //주문 목록 불러오기.
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/orders/getOrderList", {
        params: { userId, page: currentPage, size: itemsPerPage },
      })
      .then((response) => {
        console.log(response.data);
        setOrderList(response.data.content); //페이지 내용
        setTotalCount(response.data.totalElements); //총 개수
        setLoading(false);
      })
      .catch((err) => {
        console.error("주문 내역 불러오기 실패", err);
        setLoading(false);
      });
  }, [userId, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  //펼치기 핸들러
  const toggleOrder = async (orderId) => {
    setOpenOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );

    // if (!roomOrderMap[order_id]) {
    //   try {
    //     const res = await axios.get(`/api/orders/getTheOrder/${order_id}`);
    //     setRoomOrderMap((prev) => ({
    //       ...prev,
    //       [order_id]: res.data.room_order || [],
    //     }));
    //   } catch (err) {
    //     console.error("상세 주문 불러오기 실패: ", err);
    //   }
    // }
  };

  return (
    <div className={styles.order_body}>
      {loading ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className={styles.skeletonCard}>
              <div className={`${styles.skeletonBox} ${styles.long}`} />
              <div className={`${styles.skeletonBox} ${styles.medium}`} />
              <div className={`${styles.skeletonBox} ${styles.short}`} />
            </li>
          ))}
        </ul>
      ) : orderList.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orderList.map((order) => {
            const parsedRoomOrder = Array.isArray(order.roomOrder)
              ? order.roomOrder
              : [];

            const total = parsedRoomOrder.reduce(
              (sum, item) =>
                sum + (item.menu_price || 0) * (item.quantity || 0),
              0
            );
            return (
              <li
                key={order.order_id}
                style={{
                  marginBottom: "18px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "18px",
                  background: "#f9f9fa",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {/* 카드 헤더 */}
                {/* <div
                  onClick={() => toggleOrder(order.orderId)}
                  className={styles.cardHeaderTop}
                > */}
                <div className={styles.cardHeader}>
                  <div className={styles.infoArea}>
                    <div className={styles.mainTitle}>
                      <b>
                        {order.storeId}번 가게 | 방 {order.roomId}
                      </b>
                    </div>
                    <div className={styles.sunInfo}>
                      주문번호: {order.orderId}
                      &nbsp;|&nbsp;{" "}
                      {order.createdAt?.slice(0, 16).replace("T", " ")}
                    </div>
                  </div>
                  <div className={styles.actionArea}>
                    <span className={styles.price}>
                      {total.toLocaleString()}원
                    </span>
                    <span
                      className={styles.expandBtn}
                      onClick={() => toggleOrder(order.orderId)}
                    >
                      {openOrderIds.includes(order.orderId)
                        ? "▲ 접기"
                        : "▼ 펼치기"}
                    </span>
                  </div>
                </div>
                {/* 펼치기 영역: 메뉴 상세 */}
                {openOrderIds.includes(order.orderId) && (
                  <div style={{ marginTop: "12px" }}>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "disc inside",
                      }}
                    >
                      {parsedRoomOrder.length === 0 ? (
                        <li style={{ color: "#888" }}>주문 메뉴가 없습니다.</li>
                      ) : (
                        parsedRoomOrder.map((item, idx) => (
                          <li key={idx} style={{ marginBottom: "4px" }}>
                            <b>{item.menu_name}</b>
                            &nbsp;({item.menu_price.toLocaleString()}원 ×{" "}
                            {item.quantity}개) &nbsp;=&nbsp;
                            <b>
                              {(
                                (item.menu_price || 0) * (item.quantity || 0)
                              ).toLocaleString()}
                              원
                            </b>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* {페이지네이션 버튼} */}
      {totalPages > 1 && (
        <div className={styles.orderPages}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
            disabled={currentPage === 0}
          >
            이전
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                fontWeight: currentPage === i ? "bold" : "normal",
                margin: "0 2px",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
