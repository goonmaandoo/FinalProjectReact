import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "../../CSS/StoreReview.module.css";

export default function StoreReview() {
  const { storeId } = useParams(); // URL에서 storeId 가져오기
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("🟢 StoreReview 렌더링 - storeId:", storeId);

  // 날짜 포맷 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return "날짜 없음";
    // 마이크로초 제거
    const cleanStr = dateStr.split(".")[0];
    const d = new Date(cleanStr);
    if (isNaN(d)) return "날짜 없음";

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!storeId) return;

    const fetchReviews = async () => {
      console.log("📥 fetchReviews 호출 - storeId:", storeId);

      try {
        const response = await axios.get(`/api/store/${storeId}/reviews`);
        console.log("✅ API 응답:", response.data);

        setReviews(response.data);
      } catch (error) {
        console.error("❌ 리뷰 불러오기 실패:", error);
      } finally {
        setLoading(false);
        console.log("⏹️ fetchReviews 완료");
      }
    };

    fetchReviews();
  }, [storeId]);

  if (loading)
    return <div className={style.loading}>리뷰를 불러오는 중...</div>;

  return (
    <div className={style.container}>
      <h2 className={style.title}>가게 리뷰</h2>
      {reviews.length === 0 ? (
        <div className={style.noReview}>등록된 리뷰가 없습니다.</div>
      ) : (
        <div className={style.reviewList}>
          {reviews.map((review) => (
            <div key={review.id} className={style.reviewBox}>
              <div className={style.header}>
                <span className={style.user}>
                  👤 {review.nickname || "익명"}
                </span>
                <span className={style.date}>
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <div className={style.stars}>
                {"★".repeat(review.score)}
                {"☆".repeat(5 - review.score)}
              </div>
              <div className={style.comment}>{review.comments}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
