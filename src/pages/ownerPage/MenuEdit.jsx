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
        if (!editedMenuName || !editedMenuPrice) {
            alert("메뉴명과 가격을 모두 입력해주세요.");
            return;
        }

        const updatedMenu = {
            id: selectedMenu.id,
            menuName: editedMenuName,
            menuPrice: editedMenuPrice,
            status: editedMenuStatus
        };

        axios.put(`http://localhost:8080/menu/menuUpdateByOwner`, updatedMenu)
            .then(() => {
                alert("메뉴가 수정되었습니다.");
                
                // 부모 컴포넌트에 완료 알림
                if (onComplete) {
                    onComplete();
                }
            })
            .catch((err) => {
                console.error("메뉴 수정 실패:", err);
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
                        src={`http://localhost:8080/image/imgfile/${selectedMenu.folder}/${selectedMenu.filename}`}
                        alt="메뉴 이미지"
                        className={style["menu_image"]}
                    />
                </div>
                <div>
                    <label> 메뉴 이미지 수정하기 </label>
                    <input 
                        type="file"
                        onChange={handleFileChange}
                    />
                    
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