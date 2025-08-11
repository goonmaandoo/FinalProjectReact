import styles from '../../CSS/StoreManagement.module.css';
import { useState, useEffect } from 'react';

export default function ReviewAdmin({ roleFilter }) {

    return (
        <>
            {roleFilter !== "all" ?
                <div className={styles["store_box"]}>
                    <div className={styles["total_third"]}>
                        <div className={styles["total_title"]}>{roleFilter === "ban" ? "숨긴 댓글" : "신고된 댓글"}</div>
                        <div className={styles["total_num"]}>?</div>
                    </div>
                    <img src={`http://localhost:8080/image/imgfile/admin/${roleFilter}_review.png`} />
                </div>
                :
                <>
                    <div className={styles["store_box"]}>
                        <div className={styles["total_third"]}>
                            <div className={styles["total_title"]}>총 댓글수</div>
                            <div className={styles["total_num"]}>?</div>
                        </div>
                        <img src={`http://localhost:8080/image/imgfile/admin/total_review.png`} />
                    </div>
                    <div className={styles["store_box"]}>
                        <div className={styles["total_third"]}>
                            <div className={styles["total_title"]}>숨긴 댓글</div>
                            <div className={styles["total_num"]}>?</div>
                        </div>
                        <img src={`http://localhost:8080/image/imgfile/admin/ban_review.png`} />
                    </div>
                    <div className={styles["store_box"]}>
                        <div className={styles["total_third"]}>
                            <div className={styles["total_title"]}>신고된 댓글</div>
                            <div className={styles["total_num"]}>?</div>
                        </div>
                        <img src={`http://localhost:8080/image/imgfile/admin/stop_review.png`} />
                    </div>
                </>}
        </>
    )
}