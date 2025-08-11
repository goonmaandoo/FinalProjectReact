import style from "../../CSS/ReviewManagement.module.css";
import { useEffect, useState } from "react";
import FormattedDate from "../../component/funtion/common/FormattedDate";
import { useDispatch, useSelector } from 'react-redux';

export default function ReviewManagement() {

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [reviews, setReviews] = useState([]);
    const [avgScore, setAvgScore] = useState(0);
    const [newReviewCount, setNewReviewCount] = useState(0);

    const ownerId = user.id;

    useEffect(() => {
        fetch(`http://localhost:8080/api/review/selectReviewByOwner/${ownerId}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data);

                // 평균 점수 계산
                if (data.length > 0) {
                    const total = data.reduce((sum, review) => sum + review.score, 0);
                    setAvgScore((total / data.length).toFixed(1));
                }

                // "새 리뷰": 최근 7일 이내 작성된 리뷰
                const recent = data.filter(r => {
                    const created = new Date(r.createdAt);
                    const now = new Date();
                    // 현재 시간과 리뷰 작성 시간의 차이를 일(day) 단위로 계산
                    const diffDays = (now - created) / (1000 * 60 * 60 * 24);
                    return diffDays <= 7;

                });
                setNewReviewCount(recent.length);
            })
            .catch(err => console.error("리뷰 불러오기 실패:", err));
    }, [ownerId]);

    return (
        <>
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
                                <p className={style["review_date"]}><FormattedDate dateString={review.createdAt} /></p>
                                <p>{review.comments}</p>

                                <div className={style["review_managebtn"]}>
                                    <button className={style["review_hidebtn"]}> 숨김 </button>
                                    <button className={style["review_reportbtn"]}> 신고 </button>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
