import styles from '../../CSS/Admin/StoreManagement.module.css';
import style from '../../CSS/Admin/AdminPage.module.css';
import { useState, useEffect } from 'react';

export default function ReviewAdmin() {
    const [subReviewBtn, setSubReviewBtn] = useState("all");

    return (
        <>
            <div>
                <div className={style["side_menu_box"]}>
                    <div className={style["side_title"]}>댓글관리</div>
                    <div className={style["side_btn"]}>
                        <button className={subReviewBtn === "all" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubReviewBtn("all"); }}>전체</button>
                        <button className={subReviewBtn === "ban" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubReviewBtn("ban"); }}>숨김</button>
                        <button className={subReviewBtn === "stop" ? style["active_btn"] : style["unactive_btn"]} onClick={() => { setSubReviewBtn("stop"); }}>신고</button>
                    </div>
                </div>
                <div className={style["side_detail"]}>공구방과 음식점 리뷰 댓글을 관리하세요</div>
            </div>
            {subReviewBtn !== "all" ?
                <div className={styles["store_box"]}>
                    <div className={styles["total_third"]}>
                        <div className={styles["total_title"]}>{subReviewBtn === "ban" ? "숨긴 댓글" : "신고된 댓글"}</div>
                        <div className={styles["total_num"]}>?</div>
                    </div>
                    <img src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/admin/${subReviewBtn}_review.png`} />
                </div>
                :
                <>
                    <div className={styles["store_box"]}>
                        <div className={styles["total_third"]}>
                            <div className={styles["total_title"]}>총 댓글수</div>
                            <div className={styles["total_num"]}>?</div>
                        </div>
                        <img src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/admin/total_review.png`} />
                    </div>
                    <div className={styles["store_box"]}>
                        <div className={styles["total_third"]}>
                            <div className={styles["total_title"]}>숨긴 댓글</div>
                            <div className={styles["total_num"]}>?</div>
                        </div>
                        <img src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/admin/ban_review.png`} />
                    </div>
                    <div className={styles["store_box"]}>
                        <div className={styles["total_third"]}>
                            <div className={styles["total_title"]}>신고된 댓글</div>
                            <div className={styles["total_num"]}>?</div>
                        </div>
                        <img src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/admin/stop_review.png`} />
                    </div>
                </>}
        </>
    )
}