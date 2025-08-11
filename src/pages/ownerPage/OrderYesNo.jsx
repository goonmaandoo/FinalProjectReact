import style from "../../CSS/OwnerDashboard.module.css"
import { Link } from "react-router-dom";

export default function OrderYesNo() {
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
        </>
    );
}
