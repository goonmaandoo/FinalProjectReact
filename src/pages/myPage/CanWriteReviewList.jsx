import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewModal from "./ReviewModal";
import { useSelector } from "react-redux";
import styles from "../../CSS/CanWriteReviewList.module.css";

export default function CanWriteReviewList() {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  //한 페이지당 표시 갯수
  const itemsPerPage = 5;

  //modal 관리
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  //리뷰 가능한 주문 axios로 불러오기
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios
      .get("/api/review/canWrite", {
        params: { userId, page: currentPage, size: itemsPerPage },
      })
      .then((response) => {
        console.log("응답: ", response.data);
        setOrders(response.data.content || []);
        setTotalCount(response.data.totalElements || 0);
        setLoading(false);
      })
      .catch((err) => {
        setOrders([]);
        setTotalCount(0);
        setLoading(false);
        console.error("예기치 못한 오류로 목록을 불러오지 못했습니다.", err);
      });
  }, [userId, currentPage]);

  //리뷰쓰기 버튼
  const handleReviewWrite = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  //리뷰 등록
  const handleSubmitReview = (reviewData) => {
    axios
      .post("/api/review", {
        userId,
        orderId: selectedOrder.orderId,
        storeId: selectedOrder.storeId,
        ...reviewData,
      })
      .then((res) => {
        console.log(res);
        alert("리뷰가 등록됐습니다.");
        setModalOpen(false);
        fetchOrders();
      })
      .catch((error) => {
        console.log(error);
        console.log(selectedOrder);
        alert("예기치 못한 오류로 등록하지 못했습니다.");
      });
  };

  //모달 등록 후 새로고침
  const fetchOrders = () => {
    setLoading(true);
    axios
      .get("/api/review/canWrite", {
        params: { userId, page: currentPage, size: itemsPerPage },
      })
      .then((response) => {
        setOrders(response.data.content || []);
        setTotalCount(response.data.totalElements || 0);
        setLoading(false);
      })
      .catch((err) => {
        setOrders([]);
        setTotalCount(0);
        setLoading(false);
      });
  };

  //로딩 스켈레톤
  function ReviewListSkeleton({ count = 5 }) {
    return (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className={styles.skeletonCard}>
            <div className={`${styles.skeletonBox} ${styles.skeletonMedium}`} />
            <div className={`${styles.skeletonBox} ${styles.skeletonMedium}`} />
            <div className={`${styles.skeletonBox} ${styles.skeletonMedium}`} />
            <div className={`${styles.skeletonBox} ${styles.skeletonShort}`} />
          </li>
        ))}
      </ul>
    );
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className={styles.bgArea}>
      <div className={styles.reviewContainer}>
        {loading ? (
          <ReviewListSkeleton count={5} />
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", color: "#999", padding: 40 }}>
            작성 가능한 리뷰가 없습니다.
          </div>
        ) : (
          <ul style={{ padding: 0, margin: 0 }}>
            {orders.map((order) => (
              <li className={styles.card} key={order.orderId}>
                <div className={styles.cardInfo}>
                  {/* 1. 주문일 */}
                  <div className={styles.date}>
                    주문일: {order.createdAt?.slice(0, 16).replace("T", " ")}
                  </div>
                  {/* 2. 주문 메뉴(메인 강조) */}
                  <ul
                    className={styles.menuList}
                    style={{ marginTop: "7px", marginBottom: 7 }}
                  >
                    {Array.isArray(order.roomOrder) &&
                    order.roomOrder.length > 0 ? (
                      order.roomOrder.map((item, idx) => (
                        <li
                          className={styles.mainTitle}
                          style={{ fontSize: 18, fontWeight: 700 }}
                          key={idx}
                        >
                          {item.menu_name} x {item.quantity}
                        </li>
                      ))
                    ) : (
                      <li className={styles.menuItem} style={{ color: "#bbb" }}>
                        주문 메뉴 없음
                      </li>
                    )}
                  </ul>
                  {/* 3. 가게 */}
                  <div
                    className={styles.store}
                    style={{ fontSize: 15, marginTop: 4 }}
                  >
                    가게: {order.storeId}
                  </div>
                </div>
                <button
                  className={styles.reviewBtn}
                  onClick={() => handleReviewWrite(order)}
                >
                  리뷰쓰기
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className={styles.reviewPages}>
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
            disabled={currentPage >= totalPages - 1}
          >
            다음
          </button>
        </div>
      )}

      {/* 리뷰쓰기 모달 */}
      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        order={selectedOrder}
        orderId={selectedOrder?.orderId}
        storeId={selectedOrder?.storeId}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
