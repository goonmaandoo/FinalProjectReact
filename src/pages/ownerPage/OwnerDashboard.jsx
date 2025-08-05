import style from "../../CSS/OwnerDashboard.module.css"
import OwnerHeader from "./OwnerHeader"
import { Link } from "react-router-dom";

export default function OwnerDashboard() {
    return (
        <> 
            <OwnerHeader />
            <div className={style["outbox"]}>
                {/* 사이드 메뉴 */}
                <div className={style["leftbox"]}>
                    <ul>
                        <li><Link to="/ownerdashboard">대시보드</Link></li>
                        <li><Link to="/storeregister">가게등록</Link></li>
                        <li><Link to="/ownermenuedit">메뉴</Link></li>
                        <li><Link to="/deliverystate">배달접수/현황</Link></li>
                        <li><Link to="/reviewmanagement">리뷰관리</Link></li>
                        <li><Link to="/orderyesno">주문접수/취소</Link></li>
                    </ul>
                </div>

                {/* 메인 콘텐츠 */}
                <div className={style["rightbox"]}>
                    <h2>대시보드</h2>
                    <h3>실시간 주문과 매출을 확인하세요</h3>

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
