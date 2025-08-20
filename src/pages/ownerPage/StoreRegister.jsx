import style from "../../CSS/Owner/OwnerDashboard.module.css"
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
    const [ownerId, setOwnerId] = useState("");

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const navigate = useNavigate();

    const handleSubmit = async () => {

        // 빈 항목 체크
        if (
            menuCategoryId.trim() === "" ||
            storeName.trim() === "" ||
            storeAddress.trim() === "" ||
            minPrice.trim() === "" ||
            tel.trim() === ""
        ) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        // 숫자인지 검사
        if (!minPrice.trim() || isNaN(minPrice)) {
            alert("최소주문가격은 숫자만 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post("/api/store/storeInsert", {
                menuCategoryId: menuCategoryId,
                storeName: storeName,
                storeAddress: storeAddress,
                minPrice: minPrice,
                tel: tel,
                ownerId: user.id,
            });

            alert("가게 등록 성공!");
            console.log(response.data);
            navigate("/ownerpage");
        } catch (error) {
            console.error(error);
            alert("등록 중 오류 발생");
        }
    }


    return (
        <>
            <div className={style["outbox"]}>

                {/* 메인 콘텐츠 */}
                <div className={style["rightbox"]}>

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
                        {/* <div className={style["store_firstimg"]}>
                            <h3> 가게 대표 이미지 </h3>
                            <label>
                                <input
                                    type="file"
                                    // onChange={handleFileChange}
                                />
                            </label>
                        </div> */}
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
                        <button className={style["store_register_button"]} onClick={handleSubmit}> 등록하기 </button>
                    </div>


                </div>
            </div>
        </>
    );
}
