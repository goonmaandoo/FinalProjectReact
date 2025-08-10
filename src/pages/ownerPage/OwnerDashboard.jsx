import style from "../../CSS/OwnerDashboard.module.css"
import styles from '../../CSS/Dashboard.module.css';
import { Link } from "react-router-dom";

export default function OwnerDashboard() {
    return (
        <>
            <div className={style["outbox"]}>

                {/* 메인 콘텐츠 */}
                <div className={style["rightbox"]}>

                    {/* 오늘 주문 */}
                    <div className={style["today_order"]}>
                        <div className={style["status_box"]}>
                            <h3>오늘 주문</h3>
                            <h4>153건</h4>
                        </div>
                    </div>

                    {/* 주문 건수, 총 주문 건수 */}
                    <div className={style["status_box_wrapper"]}>
                        <div className={style["status_box"]}>
                            <h3>오늘 주문건수</h3>
                            <h4>153건</h4>
                        </div>
                        <div className={style["status_box"]}>
                            <h3>총 주문건수</h3>
                            <h4>153건</h4>
                        </div>
                    </div>

                    {/* 공구방 */}
                    <div className={style["status_box_wrapper"]}>
                        <div className={style["status_box"]}>
                            <h3>진행 중인 공구방</h3>
                            <h4>3건</h4>
                        </div>
                        <div className={style["status_box"]}>
                            <h3>모집 중인 공구방</h3>
                            <h4>5건</h4>
                        </div>
                    </div>

                    {/* 최근 주문 */}
                    <div className={style["recent_order_box"]}>
                        <h3>최근 주문</h3>
                        {/* 주문 리스트*/}
                    </div>
                </div>
            </div>
            <div className={styles["dash_main_box"]}>
            <div className={styles["dash_box"]}>
                    <div className={styles["total_third"]}>
                    <div className={styles["total_title"]}>
                        <span><img src={`http://localhost:8080/image/imgfile/owner/today_finish.png`} />
                        </span>
                        <span className={styles["total_title"]}>진행 중인 주문</span>
                    </div>
                        <div className={styles["total_num"]}>?명</div>
                    </div>
                </div>
                <div className={styles["dash_box"]}>
                    <div className={styles["total_second"]}>
                        <div className={styles["total_title"]}>
                            <span><img src={`http://localhost:8080/image/imgfile/owner/today_order.png`} /></span>오늘 주문 건수</div>
                        <div className={styles["total_num"]}>?건</div>
                    </div>
                    <hr />
                    <div className={styles["total_second"]}>
                        <div className={styles["total_title"]}><span><img src={`http://localhost:8080/image/imgfile/owner/today_order.png`} /></span>총 주문 건수</div>
                        <div className={styles["total_num"]}>?건</div>
                    </div>
                </div>
                <div className={styles["dash_box"]}>
                    <div className={styles["total_second"]}>
                        <div className={styles["total_title"]}>
                            <span><img src={`http://localhost:8080/image/imgfile/owner/room_ing.png`} /></span>진행 중인 공구방</div>
                        <div className={styles["total_num"]}>?건</div>
                    </div>
                    <hr />
                    <div className={styles["total_second"]}>
                        <div className={styles["total_title"]}><span><img src={`http://localhost:8080/image/imgfile/owner/room_ing.png`} /></span>모집 중인 공구방</div>
                        <div className={styles["total_num"]}>?건</div>
                    </div>
                </div>
        </div>
        </>
    );
}
