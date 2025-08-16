import style from "../../CSS/OwnerMenuEdit.module.css";
import { useState } from "react";
import axios from "axios";

export default function MenuAdd({ user, storeId, onComplete, onTabChange }) {
    const [newStoreId, setNewStoreId] = useState(storeId || "");
    const [newImageId, setNewImageId] = useState("");
    const [newMenuName, setNewMenuName] = useState("");
    const [newMenuPrice, setNewMenuPrice] = useState("");
    const [file, setFile] = useState(null);
    const [folder, setFolder] = useState("");

    const handleMenuInsert = () => {
        if (!newStoreId || !newMenuName || !newMenuPrice) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        const newMenu = {
            storeId: newStoreId,
            // imageId: newImageId,
            menuName: newMenuName,
            menuPrice: newMenuPrice
        };

        axios.post("http://localhost:8080/menu/menuInsertByOwner", newMenu)
            .then(() => {
                alert("메뉴가 추가되었습니다.");
                // 입력 필드 초기화
                setNewStoreId(storeId || "");
                // setNewImageId("");
                setNewMenuName("");
                setNewMenuPrice("");
                setFile(null);
                setFolder("");
                
                // 부모 컴포넌트에 완료 알림 (전체메뉴로 이동)
                if (onTabChange) {
                    onTabChange("전체메뉴");
                }
                if (onComplete) {
                    onComplete();
                }
            })
            .catch((err) => {
                console.error("메뉴 추가 실패:", err);
                alert("메뉴 추가에 실패했습니다.");
            });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFolderChange = (e) => {
        setFolder(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            alert("파일을 선택하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
            const res = await axios.post("http://localhost:8080/menuImageInsertByOwner", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("서버 응답:", res.data);
            alert("업로드 성공! image_id: " + res.data.id);
            setNewImageId(res.data.id); // 이미지 ID 설정
        } catch (err) {
            console.error(err);
            alert("업로드 실패");
        }
    };

    return (
        <>
            <div className={style["menu_button"]}>
                <button onClick={() => onTabChange("전체메뉴")}> 전체메뉴 </button>
                <button onClick={() => onTabChange("메뉴추가")} className={style["active"]}> 메뉴 추가 </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={style["insert_menu"]}>
                    <div className={style["image_insert"]}>
                        <input 
                            className={style["storeNum"]}
                            type="text"
                            placeholder="가게번호를 입력해주세요"
                            value={newStoreId}
                            onChange={(e) => setNewStoreId(e.target.value)}
                        /><br />
                        <p> 메뉴 사진 추가하기</p>
                        <input type="file"></input>
                    </div>
                    <div className={style["insertmenu_info"]}>
                        <input
                            type="text"
                            placeholder="메뉴명"
                            value={newMenuName}
                            onChange={(e) => setNewMenuName(e.target.value)}
                        /><br />

                        <input
                            type="text"
                            placeholder="가격"
                            value={newMenuPrice}
                            onChange={(e) => setNewMenuPrice(e.target.value)}
                        /><br />

                        <button 
                            type="button"
                            className={style["insertmenu_button"]}
                            onClick={handleMenuInsert}
                        >
                            추가하기
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}