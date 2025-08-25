import style from "../../CSS/Owner/MenuEdit.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MenuEdit({ selectedMenu, storeId, user, onComplete, onTabChange }) {
    const [editedMenuName, setEditedMenuName] = useState("");
    const [editedMenuPrice, setEditedMenuPrice] = useState("");
    const [editedMenuStatus, setEditedMenuStatus] = useState("판매중");
    const [file, setFile] = useState(null);
    const [newImageId, setImageId] = useState("");
    const [newStoreId, setNewStoreId] = useState(storeId || "");
    const [isUploading, setIsUploading] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (selectedMenu) {
            setEditedMenuName(selectedMenu.menuName);
            setEditedMenuPrice(selectedMenu.menuPrice);
            setEditedMenuStatus(selectedMenu.status || "판매중");
        }
    }, [selectedMenu]);

    const handleMenuUpdate = () => {
        const formData = new FormData();
        formData.append("id", selectedMenu.id);
        formData.append("storeId", selectedMenu.storeId);
        formData.append("menuName", editedMenuName);
        formData.append("menuPrice", editedMenuPrice);
        formData.append("status", editedMenuStatus);

        if (newImageId) {
            formData.append("imageId", newImageId);
        }

        axios.put(`api/menu/menuUpdateByOwner`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                alert("메뉴가 수정되었습니다.");
                setFile(null);
                if (onComplete) {
                    onComplete();
                }
            })
            .catch((err) => {
                console.error("상세 오류:", err.response);
                alert("메뉴 수정에 실패했습니다.");
            });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("파일을 선택하세요!");
            return;
        }


        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("storeId", selectedMenu.storeId);

        try {
            // 파일 업로드 (fetch로 서버 저장)
            const res = await fetch("api/files/upload/menuByOwner", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const responseData = await res.json();
            console.log("서버 응답:", responseData);

            // 서버에서 받은 데이터로 상태 업데이트
            setUrl(responseData.url);
            setImageId(responseData.imageId.toString()); // imageId 상태 업데이트

            alert("업로드 성공!");

        } catch (err) {
            console.error("업로드 에러:", err);
            alert("업로드 실패: " + err.message);
        } finally {
            setIsUploading(false);
        }
    };


    if (!selectedMenu) {
        return (
            <>
                <div className={style["menu_button"]}>
                    <button onClick={() => onTabChange("전체메뉴")}> 전체메뉴 </button>
                    <button onClick={() => onTabChange("메뉴추가")}> 메뉴 추가 </button>
                    <button onClick={() => onTabChange("메뉴수정")} className={style["active"]}> 메뉴 수정 </button>
                </div>
                <div className={style["edit_menu"]}>
                    <p>수정할 메뉴를 선택해주세요.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <div className={style["menu_button"]}>
                <button onClick={() => onTabChange("전체메뉴")}> 전체메뉴 </button>
                <button onClick={() => onTabChange("메뉴추가")}> 메뉴 추가 </button>
            </div>
            <div className={style["edit_menu"]}>
                <div className={style["edit_menu_image"]}>
                    <img
                        src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/${selectedMenu.folder}/${selectedMenu.filename}`}
                        alt="메뉴 이미지"
                        className={style["menu_image"]}
                    />
                </div>
                <div>
                    <div className={style["store_firstimg"]}>
                        <h3>수정할 메뉴 이미지</h3>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <button className={style["insertmenu_button"]} onClick={handleUpload}>등록</button>
                    </div>

                    <label>메뉴명</label><br />
                    <input
                        type="text"
                        value={editedMenuName}
                        onChange={(e) => setEditedMenuName(e.target.value)}
                        className={style["edit_input"]}
                    /><br />

                    <label>가격</label><br />
                    <input
                        type="number"
                        value={editedMenuPrice}
                        onChange={(e) => setEditedMenuPrice(e.target.value)}
                        className={style["edit_input"]}
                    /><br />

                    <label>상태</label><br />
                    <div className={style["radio_group"]}>
                        <input
                            type="radio"
                            id="status-available"
                            name="status"
                            value="판매중"
                            checked={editedMenuStatus === "판매중"}
                            onChange={(e) => setEditedMenuStatus(e.target.value)}
                        />
                        <label htmlFor="status-available">판매중</label>

                        <input
                            type="radio"
                            id="status-soldout"
                            name="status"
                            value="품절"
                            checked={editedMenuStatus === "품절"}
                            onChange={(e) => setEditedMenuStatus(e.target.value)}
                            style={{ marginLeft: "20px" }}
                        />
                        <label htmlFor="status-soldout">품절</label>
                    </div>

                    <br />
                    <button
                        className={style["insertmenu_button"]}
                        onClick={handleMenuUpdate}
                    >
                        수정하기
                    </button>
                </div>

            </div>
        </>
    );
}