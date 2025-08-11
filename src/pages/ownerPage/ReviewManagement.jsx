import style from "../../CSS/ReviewManagement.module.css"
import { Link } from "react-router-dom";

export default function ReviewManagement() {
    return (
        <>
            <div className={style["outbox"]}>

                {/* 메인 콘텐츠 */}
                <div className={style["rightbox"]}>

                    <div className={style["review_dashboard"]}>
                        <div className={style["all_review"]}>
                            <h2> ? 개</h2>
                            <h2 className={style["dashboard_name"]}> 전체리뷰 </h2>
                        </div>
                        <div className={style["avg_score"]}>
                            <h2> ? 개</h2>
                            <h2 className={style["dashboard_name"]}> 평균평점 </h2>

                        </div>
                        <div className={style["new_review"]}>
                            <h2> ? 개</h2>
                            <h2 className={style["dashboard_name"]}> 새리뷰 </h2>

                        </div>
                    </div>
                    <div className={style["review_list"]}>
                        <h2> 리뷰목록 </h2>
                        <div className={style["review_content"]}>
                            <p>어쩌구저쩌구</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
