import style from "../../CSS/Owner/ReviewManagement.module.css";
import { useEffect, useState } from "react";
import FormattedDate from "../../component/funtion/common/FormattedDate";
import { useSelector } from 'react-redux';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ReviewManagement() {

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    const [reviews, setReviews] = useState([]);
    const [avgScore, setAvgScore] = useState(0);
    const [newReviewCount, setNewReviewCount] = useState(0);

    const ownerId = user.id;

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`/api/review/selectReviewByOwner/${ownerId}`);
            const data = res.data;

            setReviews(data);

            // 평균 점수 계산
            if (data.length > 0) {
                const total = data.reduce((sum, review) => sum + review.score, 0);
                setAvgScore((total / data.length).toFixed(1));
            } else {
                setAvgScore(0);
            }

            // 최근 7일 리뷰 계산
            const recent = data.filter(r => {
                const created = new Date(r.createdAt);
                const now = new Date();
                const diffDays = (now - created) / (1000 * 60 * 60 * 24);
                return diffDays <= 7;
            });
            setNewReviewCount(recent.length);

        } catch (err) {
            console.error("리뷰 불러오기 실패:", err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [ownerId]);

    const updateReviewStatus = async (id, newStatus) => {
        try {
            const response = await axios.put(`/api/review/updateReviewByOwner/${id}`, {
                id: id,
                status: newStatus,
            });

            if (response.status === 200) {
                alert("리뷰 상태가 성공적으로 변경되었습니다.");
                fetchReviews(); // 변경 후 다시 목록 불러오기
            } else {
                alert("리뷰 상태 변경에 실패했습니다.");
            }
        } catch (error) {
            console.error("리뷰 상태 변경 실패: ", error);
            alert("리뷰 상태 변경 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={style["outbox"]}>
            <div className={style["rightbox"]}>
                <div className={style["review_dashboard"]}>
                    <div className={style["all_review"]}>
                        <h2>{reviews.length} 개</h2>
                        <h2 className={style["dashboard_name"]}> 전체리뷰 </h2>
                    </div>
                    <div className={style["avg_score"]}>
                        <h2>{avgScore}</h2>
                        <h2 className={style["dashboard_name"]}> 평균평점 </h2>
                    </div>
                    <div className={style["new_review"]}>
                        <h2>{newReviewCount} 개</h2>
                        <h2 className={style["dashboard_name"]}> 최근 7일 리뷰 </h2>
                    </div>
                </div>

                <div className={style["review_list"]}>
                    <h2> 리뷰목록 </h2>
                    {reviews.map((review, index) => (
                        <div key={index} className={style["review_content"]}>
                            <p className={style["nickname"]}><b>{review.nickname}</b> ({review.score}점)</p>
                            <p>{review.status}</p>
                            <p className={style["review_date"]}><FormattedDate dateString={review.createdAt} /></p>
                            <p>{review.comments}</p>

                            <div className={style["review_managebtn"]}>
                                <button className={style["review_openbtn"]}
                                    onClick={() => updateReviewStatus(review.id, "공개")}> 공개 </button>
                                <button className={style["review_hidebtn"]}
                                    onClick={() => updateReviewStatus(review.id, "비공개")}> 숨김 </button>
                                <button className={style["review_reportbtn"]}
                                    onClick={() => updateReviewStatus(review.id, "임시제한")}> 신고 </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}