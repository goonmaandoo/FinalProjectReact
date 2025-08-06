import style from "../../CSS/OwnerDashboard.module.css"
import OwnerHeader from "./OwnerHeader"
import { Link } from "react-router-dom";

export default function StoreRegister() {
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
                    <h2>가게등록</h2>
                    <h3>가게 등록을 신청하세요</h3>

                    {/* 카테고리 선택 + 가게대표이미지 선택 */}
                    <div className={style["category_firstimg"]}>
                        <div className={style["category_select"]}>
                            <h3>카테고리</h3>
                            <select>
                                <option> 카테고리 선택 </option>
                                <option> 피자 </option>
                                <option> 한식 </option>
                                <option> 분식 </option>
                                <option> 중식 </option>
                            </select>
                        </div>
                        <div className={style["store_firstimg"]}>
                            <h3> 가게 대표 이미지 </h3>
                        </div>
                    </div>

                    {/* 가게이름, 주소, 최소주문가격, 전화번호 */}
                    <div className={style["store_info"]}>

                        <h3>가게이름</h3>
                        <input type="text"
                            placeholder="가게이름" />

                        <h3>주소 </h3>
                        <input type="text"
                            placeholder="가게도로명주소" />

                        <h3>최소주문가격 </h3>
                        <input type="text"
                            placeholder="최소주문가격" />

                        <h3>전화번호 </h3>
                        <input type="text"
                            placeholder="전화번호" />
                    </div>
                    <div className={style["button-wrapper"]}>
                        <button> 신청하기 </button>
                    </div>
                    

                </div>
            </div>
        </>
    );
}
