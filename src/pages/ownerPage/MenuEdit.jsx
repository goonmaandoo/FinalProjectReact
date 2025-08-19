import style from "../../CSS/OwnerMenuEdit.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MenuEdit({ selectedMenu, user, onComplete, onTabChange }) {
    const [editedMenuName, setEditedMenuName] = useState("");
    const [editedMenuPrice, setEditedMenuPrice] = useState("");
    const [editedMenuStatus, setEditedMenuStatus] = useState("판매중");
    const [file, setFile] = useState(null);

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
    formData.append("storeId", selectedMenu.storeId); // 이 값이 있는지 확인!
    formData.append("menuName", editedMenuName);
    formData.append("menuPrice", editedMenuPrice);
    formData.append("status", editedMenuStatus);
    
    if (file) {
        formData.append("file", file);
    }

    // FormData 내용 로그 확인
    console.log("=== 전송할 데이터 ===");
    for (let [key, value] of formData.entries()) {
        console.log(key, ":", value);
    }

    axios.put(`http://localhost:8080/menu/menuUpdateByOwner`, formData, {
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
        console.error("상세 오류:", err.response); // 더 자세한 오류 확인
        alert("메뉴 수정에 실패했습니다.");
    });
};

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
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
                    <label> 메뉴 이미지 수정하기 </label>
                    <input 
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {file && <p>선택된 파일: {file.name}</p>}
                    
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