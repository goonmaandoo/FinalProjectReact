import React, { useEffect, useState } from "react";
import ReviewEditModal from "./ReviewEditModal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../CSS/MyReviewList.module.css";

export default function MyReviewList() {
  const user = useSelector((state) => state.auth.user);
  const userId = user?.id;
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 5;

  //작성한 리뷰 불러오기
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/review/getMyReview", {
        params: { userId, page: currentPage, size: itemsPerPage },
      })
      .then((response) => {
        console.log(response.data);
        setReviews(response.data.content || []); //페이지 내용
        setTotalCount(response.data.totalElements || 0); // 총 개수
        setLoading(false);
      })
      .catch((err) => {
        console.error("리뷰 불러오기 실패", err);
        setLoading(false);
      });
  }, [userId, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  //수정 모달 관리
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  //   //데이터 로딩
  const fetchReviews = () => {
    axios
      .get("/api/review/getMyReview", {
        params: { userId, page: currentPage, size: itemsPerPage },
      })
      .then((response) => {
        setReviews(response.data.content || []);
        setTotalCount(response.data.totalElements || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("리뷰 불러오기 실패", err);
        setLoading(false);
      });
  };
  //삭제
  const handleDelete = (reviewId) => {
    if (window.confirm("리뷰를 삭제하시겠습니까?")) {
      axios
        .delete(`/api/review/deleteReview/${reviewId}`)
        .then((res) => {
          alert("삭제됐습니다.");
          fetchReviews();
        })
        .catch((err) => {
          alert("예기치 못한 오류로 삭제하지 못했습니다.");
          console.error(err);
        });
    }
  };

  //수정 버튼 클릭 시
  const handleEdit = (review) => {
    setEditTarget(review);
    setEditModalOpen(true);
  };

  //모달 저장 클릭
  const handleEditSubmit = (editedData) => {
    axios
      .put(`/api/review/updateReview/${editTarget.id}`, {
        ...editTarget,
        ...editedData,
      })
      .then((res) => {
        alert("수정됐습니다.");
        setEditModalOpen(false);
        fetchReviews();
      })
      .catch((err) => {
        alert("예기지 못한 오류로 수정하지 못했습니다.");
        console.error(err);
      });
  };

  //로딩 스켈레톤
  function ReviewListSkeleton({ count = 5 }) {
    return (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className={styles.skeletonCard}>
            <div className={`${styles.skeletonBox} ${styles.skeletonLong}`} />
            <div className={`${styles.skeletonBox} ${styles.skeletonMedium}`} />
            <div className={`${styles.skeletonBox} ${styles.skeletonShort}`} />
            <div className={`${styles.skeletonBox} ${styles.skeletonMedium}`} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.reviewWrap}>
      <ul className={styles.reviewList}>
        {loading ? (
          <ReviewListSkeleton count={5} />
        ) : reviews.length === 0 ? (
          <li className={styles.noData}>작성한 리뷰가 없습니다.</li>
        ) : (
          reviews.map((review) => (
            <li key={review.id} className={styles.reviewCard}>
              {/* 작성일 */}
              <div className={styles.reviewDate}>
                {review.createdAt?.slice(0, 16).replace("T", " ")}
              </div>
              {/* 메뉴명 */}
              <div className={styles.menuList}>
                <b>주문 메뉴:</b>
                <ul>
                  {(JSON.parse(review.roomOrder) || []).map((menu, idx) => (
                    <li key={idx}>
                      {menu.menu_name} x {menu.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              {/* 평점 */}
              <div className={styles.scoreArea}>
                <b>평점:</b>{" "}
                <span className={styles.stars}>
                  {"★".repeat(review.score)}
                  {"☆".repeat(5 - review.score)}
                </span>
                <span>({review.score})</span>
              </div>
              {/* 리뷰 내용 */}
              <div className={styles.comment}>
                <b>리뷰내용:</b> {review.comments}
              </div>
              {/* 버튼 */}
              <div className={styles.actionBtns}>
                <button onClick={() => handleEdit(review)}>수정</button>
                <button onClick={() => handleDelete(review.id)}>삭제</button>
              </div>
            </li>
          ))
        )}
      </ul>
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
      {/* 리뷰 수정 모달 */}
      <ReviewEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        review={editTarget}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}
