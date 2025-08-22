import { useState } from "react";
import style from "../../CSS/Owner/StoreRegister.module.css"
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StoreRegister() {
    const [activeTab, setActiveTab] = useState("info"); // info 또는 image

    const [menuCategoryId, setMenuCategoryId] = useState("");
    const [storeName, setStoreName] = useState("");
    const [storeAddress, setStoreAddress] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [tel, setTel] = useState("");
    const [ownerId, setOwnerId] = useState("");

    const [file, setFile] = useState(null);
    const [id, setId] = useState("");
    const [url, setUrl] = useState("");

    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    const handleSubmit = async () => {
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

        if (isNaN(minPrice)) {
            alert("최소주문가격은 숫자만 입력해주세요.");
            return;
        }

        try {
            const response = await axios.post("api/store/storeInsert", {
                menuCategoryId,
                storeName,
                storeAddress,
                minPrice,
                tel,
                ownerId: user.id,
            });

            alert("가게 등록 성공!");
            navigate("/ownerpage");
        } catch (error) {
            console.error(error);
            alert("등록 중 오류 발생");
        }
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("파일을 선택하세요!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", id);

        try {
            const res = await fetch("api/files/upload/storeByOwner", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("업로드 실패");

            const url = await res.text();
            setUrl(url);
            alert("업로드 성공!");
        } catch (err) {
            console.error(err);
            alert("업로드 실패");
        }
    };

    return (
        <div className={style["outbox"]}>

            {/* 상단 탭 버튼 */}
            <div className={style["tab-buttons"]}>
                <button 
                    className={activeTab === "info" ? style["active"] : ""} 
                    onClick={() => setActiveTab("info")}
                >
                    가게 정보
                </button>
                <button 
                    className={activeTab === "image" ? style["active"] : ""} 
                    onClick={() => setActiveTab("image")}
                >
                    가게 이미지
                </button>
            </div>

            {/* 가게 정보 탭 */}
            {activeTab === "info" && (
                <div className={style["rightbox"]}>
                    <div className={style["category_firstimg"]}>
                        <div className={style["category_select"]}>
                            <h3>카테고리</h3>
                            <select value={menuCategoryId} onChange={(e) => setMenuCategoryId(e.target.value)}>
                                <option value=""> 카테고리를 선택하세요 </option>
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
                    </div>

                    <div className={style["store_info"]}>
                        <h3>가게이름</h3>
                        <input type="text" placeholder="가게이름" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                        <h3>주소</h3>
                        <input type="text" placeholder="가게도로명주소" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
                        <h3>최소주문가격</h3>
                        <input type="text" placeholder="최소주문가격" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                        <h3>전화번호</h3>
                        <input type="text" placeholder="전화번호" value={tel} onChange={(e) => setTel(e.target.value)} />
                    </div>

                    <div className={style["button-wrapper"]}>
                        <button className={style["store_register_button"]} onClick={handleSubmit}>등록하기</button>
                    </div>
                </div>
            )}

            {/* 가게 이미지 탭 */}
            {activeTab === "image" && (
                <div className={style["rightbox"]}>
                    <div className={style["store_firstimg"]}>
                        <h3>가게 대표 이미지</h3>
                        <label>
                            <input type="file" onChange={handleFileChange} />
                            <p>이미지는 jpg형식의 파일로 올려주세요.</p>
                        </label>
                        <input type="text" placeholder="가게번호" onChange={(e) => setId(e.target.value)} />
                        <p>가게관리에서 가게번호를 정확히 입력해주세요.</p>
                        <button onClick={handleUpload}>등록</button>
                    </div>
                </div>
            )}

        </div>
    );
}
