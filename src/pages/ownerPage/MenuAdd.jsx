import style from "../../CSS/OwnerMenuEdit.module.css";
import { useState } from "react";
import axios from "axios";

export default function MenuAdd({ user, imageId, onComplete, onTabChange }) {
    const [newStoreId, setNewStoreId] = useState("");
    const [newImageId, setImageId] = useState(""); // 업로드된 이미지 ID 저장
    const [newMenuName, setNewMenuName] = useState("");
    const [newMenuPrice, setNewMenuPrice] = useState("");
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleMenuInsert = async () => {
        if (!newStoreId || !newMenuName || !newMenuPrice) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        setIsUploading(true);

        try {
            const newMenu = {
                storeId: parseInt(newStoreId),
                menuName: newMenuName,
                menuPrice: parseInt(newMenuPrice),
                imageId: newImageId ? parseInt(newImageId) : null // 이미지 ID 포함
            };

            console.log("메뉴 등록 데이터:", newMenu);
            const menuResponse = await axios.post("api/menu/menuInsertByOwner", newMenu);

            alert("메뉴가 추가되었습니다.");

            // 입력 필드 초기화
            setNewStoreId("");
            setNewMenuName("");
            setNewMenuPrice("");
            setFile(null);
            setImageId(""); // 이미지 ID도 초기화
            setUrl("");

            // 부모 컴포넌트에 완료 알림 (전체메뉴로 이동)
            if (onTabChange) {
                onTabChange("전체메뉴");
            }
            if (onComplete) {
                onComplete();
            }
        } catch (err) {
            console.error("메뉴 추가 실패:", err);
            alert("메뉴 추가에 실패했습니다: " + (err.response?.data || err.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("파일을 선택하세요!");
            return;
        }

        if (!newStoreId) {
            alert("가게번호를 먼저 입력해주세요!");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("storeId", newStoreId);

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

    return (
        <>
            <div className={style["menu_button"]}>
                <button onClick={() => onTabChange("전체메뉴")}> 전체메뉴 </button>
                <button onClick={() => onTabChange("메뉴추가")} className={style["active"]}> 메뉴 추가 </button>
            </div>
            <div className={style["insert_menu"]}>
                <div className={style["image_insert"]}>
                    <input
                        className={style["storeNum"]}
                        type="text"
                        placeholder="가게번호를 입력해주세요"
                        value={newStoreId}
                        onChange={(e) => setNewStoreId(e.target.value)}
                        disabled={isUploading}
                    /><br />
                    <p>메뉴 사진 추가하기</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />

                    {url && (
                        <div>
                            <p> 업로드된 이미지 </p>
                            <img src={url} alt="업로드된 이미지" style={{maxWidth: "200px", maxHeight: "200px"}} />
                        </div>
                    )}
                    <button onClick={handleUpload} disabled={isUploading || !newStoreId}>
                        {isUploading ? "업로드 중..." : "이미지등록하기"}
                    </button>
                </div>
                <div className={style["insertmenu_info"]}>
                    <input
                        type="text"
                        placeholder="메뉴명"
                        value={newMenuName}
                        onChange={(e) => setNewMenuName(e.target.value)}
                        disabled={isUploading}
                    /><br />

                    <input
                        type="number"
                        placeholder="가격"
                        value={newMenuPrice}
                        onChange={(e) => setNewMenuPrice(e.target.value)}
                        disabled={isUploading}
                    /><br />

                    <button
                        type="button"
                        className={style["insertmenu_button"]}
                        onClick={handleMenuInsert}
                        disabled={isUploading}
                    >
                        {isUploading ? "추가 중..." : "추가하기"}
                    </button>
                </div>
            </div>
        </>
    );
}