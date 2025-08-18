import style from "../../CSS/OwnerMenuEdit.module.css";
import { useState } from "react";
import axios from "axios";

export default function MenuAdd({ user, storeId, onComplete, onTabChange }) {
    const [newStoreId, setNewStoreId] = useState(storeId || "");
    const [newMenuName, setNewMenuName] = useState("");
    const [newMenuPrice, setNewMenuPrice] = useState("");
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleMenuInsert = async () => {
        if (!newStoreId || !newMenuName || !newMenuPrice) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        setIsUploading(true);

        try {
            // 1. 먼저 메뉴를 등록 (이미지 없이)
            const newMenu = {
                storeId: parseInt(newStoreId),
                menuName: newMenuName,
                menuPrice: parseInt(newMenuPrice)
            };

            console.log("메뉴 등록 데이터:", newMenu);
            const menuResponse = await axios.post("http://localhost:8080/menu/menuInsertByOwner", newMenu);

            // 2. 이미지가 있으면 메뉴 수정으로 이미지 추가
            if (file) {
                // 새로 등록된 메뉴 목록을 가져와서 방금 추가된 메뉴 찾기
                const menuListResponse = await axios.get(`http://localhost:8080/menu/owner/${user.id}`);
                const menuList = menuListResponse.data;
                
                // 방금 등록한 메뉴 찾기 (같은 이름과 가격을 가진 메뉴 중 가장 최근 것)
                const newlyAddedMenu = menuList
                    .filter(menu => menu.menuName === newMenuName && menu.menuPrice === parseInt(newMenuPrice))
                    .sort((a, b) => b.id - a.id)[0]; // ID 기준 내림차순 정렬 후 첫번째

                if (newlyAddedMenu) {
                    const formData = new FormData();
                    formData.append("id", newlyAddedMenu.id);
                    formData.append("storeId", newStoreId);
                    formData.append("menuName", newMenuName);
                    formData.append("menuPrice", newMenuPrice);
                    formData.append("status", "판매중"); // 기본값
                    formData.append("file", file);

                    console.log("이미지 업데이트 중..., 메뉴 ID:", newlyAddedMenu.id);
                    await axios.put("http://localhost:8080/menu/menuUpdateByOwner", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log("이미지 업데이트 완료");
                }
            }
            
            alert("메뉴가 추가되었습니다.");
            
            // 입력 필드 초기화
            setNewStoreId(storeId || "");
            setNewMenuName("");
            setNewMenuPrice("");
            setFile(null);
            
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
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // 파일 크기 체크 (5MB 제한)
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert("파일 크기는 5MB를 초과할 수 없습니다.");
                return;
            }
            // 파일 형식 체크
            if (!selectedFile.type.startsWith('image/')) {
                alert("이미지 파일만 업로드 가능합니다.");
                return;
            }
            setFile(selectedFile);
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
                    {file && <p>선택된 파일: {file.name}</p>}
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