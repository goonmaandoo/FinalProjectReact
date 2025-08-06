import style from "../../CSS/OwnerDashboard.module.css"
import OwnerHeader from "./OwnerHeader"
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

export default function StoreRegister() {
    const [menuCategoryId, setMenuCategoryId] = useState("");
    const [storeName, setStoreName] = useState("");
    const [storeAddress, setStoreAddress] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [tel, setTel] = useState("");
    const [ownerId, setOwnerId] = useState(""); // 예시: 로그인된 ownerId (임시 고정값)

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const navigate = useNavigate();

    const handleSubmit = async () => {

        // 빈 항목 체크
        if (
            menuCategoryId.trim() === 0 ||
            storeName.trim() === "" ||
            storeAddress.trim() === "" ||
            minPrice.trim() === "" ||
            tel.trim() === ""
        ) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        // 숫자인지 검사 (빈 문자열도 걸러주기 위해 trim 사용)
        if (!minPrice.trim() || isNaN(minPrice)) {
            alert("최소주문가격은 숫자만 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/store/storeInsert", {
                menuCategoryId: menuCategoryId,
                storeName: storeName,
                storeAddress: storeAddress,
                minPrice: minPrice,
                tel: tel,
                ownerId: user.id,
            });

            alert("가게 등록 성공!");
            console.log(response.data);
            navigate("/ownerdashboard");
        } catch (error) {
            console.error(error);
            alert("등록 중 오류 발생");
        }
    }


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
                            <select value={menuCategoryId} onChange={(e) => setMenuCategoryId(e.target.value)}>
                                <option value="2">피자</option>
                                <option value="3">한식</option>
                                <option value="4">분식</option>
                                <option value="5">중식</option>
                                <option value="6">일식</option>
                                <option value="7">디저트</option>
                                <option value="8">패스트푸드</option>
                                <option value="9">치킨</option>
                                <option value="10">양식</option>
                                <option value="11">찜/탕</option>
                                <option value="12">아시안</option>
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
                            placeholder="가게이름"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)} />

                        <h3>주소 </h3>
                        <input type="text"
                            placeholder="가게도로명주소"
                            value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />

                        <h3>최소주문가격 </h3>
                        <input type="text"
                            placeholder="최소주문가격"
                            value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />

                        <h3>전화번호 </h3>
                        <input type="text"
                            placeholder="전화번호"
                            value={tel} onChange={(e) => setTel(e.target.value)} />
                    </div>
                    <div className={style["button-wrapper"]}>
                        <button onClick={handleSubmit}> 등록하기 </button>
                    </div>


                </div>
            </div>
        </>
    );
}
