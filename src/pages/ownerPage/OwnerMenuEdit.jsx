import style from "../../CSS/Owner/OwnerMenuEdit.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function OwnerMenuEdit() {
    const user = useSelector((state) => state.auth.user);
    const [menuList, setMenuList] = useState([]);
    const [storeId, setStoreId] = useState("");
    const [imageId, setImageId] = useState("");
    const [selectedTab, setSelectedTab] = useState("전체메뉴");
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [editedMenuName, setEditedMenuName] = useState("");
    const [editedMenuPrice, setEditedMenuPrice] = useState("");
    const [editedMenuStatus, setEditedMenuStatus] = useState("판매중");
    const [newStoreId, setNewStoreId] = useState("");
    const [newImageId, setNewImageId] = useState("");
    const [newMenuName, setNewMenuName] = useState("");
    const [newMenuPrice, setNewMenuPrice] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMenuList = menuList.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(menuList.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        if (!user || !user.id) {
            console.log("로그인된 사장님 정보가 없습니다.");
            return;
        }

        const ownerId = user.id;
        axios.get(`http://localhost:8080/menu/ownerWithImage/${ownerId}`)
            .then(res => {
                setMenuList(res.data);
                if (res.data.length > 0) {
                    setStoreId(res.data[0].storeId);
                }
            })
            .catch(console.error);
    }, [user]);

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
                return axios.get(`http://localhost:8080/menu/ownerWithImage/${user.id}`);
            })
            .then((res) => {
                setMenuList(res.data);
                setSelectedTab("전체메뉴");
                setSelectedMenu(null);
            })
            .catch((err) => {
                console.error("메뉴 수정 실패:", err);
                alert("메뉴 수정에 실패했습니다.");
            });
    };
    const handleMenuInsert = () => {
        if (!newStoreId || !newMenuName || !newMenuPrice) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        const newMenu = {
            storeId: newStoreId,
            imageId: newImageId,
            menuName: newMenuName,
            menuPrice: newMenuPrice
        };


        axios.post("http://localhost:8080/menu/menuInsertByOwner", newMenu)
            .then(() => {
                alert("메뉴가 추가되었습니다.");
                setSelectedTab("전체메뉴");
                // 메뉴 리스트 다시 불러오기
                return axios.get(`http://localhost:8080/menu/ownerWithImage/${user.id}`);
            })
            .then((res) => {
                setMenuList(res.data);
                // 입력 필드 초기화
                setNewStoreId("");
                setNewImageId("");
                setNewMenuName("");
                setNewMenuPrice("");
            })
            .catch((err) => {
                console.error("메뉴 추가 실패:", err);
                alert("메뉴 추가에 실패했습니다.");
            });
    };

    const handleImageUpload = () => {
        if (!selectedFile || !newStoreId) {
            alert("가게번호와 이미지를 모두 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("folder", "store"+newStoreId);
        formData.append("filename", selectedFile);

        axios.post("http://localhost:8080/menuImageInsertByOwner", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(() => {
                alert("이미지 업로드 완료!");
            })
            .catch(err => {
                console.error(err);
                alert("이미지 업로드 실패");
            });
    };


    const handleMenuDelete = (menuId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.get(`http://localhost:8080/menu/menuDeleteByOwner/${menuId}`)
                .then((res) => {
                    if (res.data > 0) {
                        alert("메뉴가 삭제되었습니다.");
                        return axios.get(`http://localhost:8080/menu/ownerWithImage/${user.id}`);
                    } else {
                        alert("삭제에 실패했습니다.");
                    }
                })
                .then((res) => {
                    if (res) {
                        setMenuList(res.data);
                    }
                })
                .catch((err) => {
                    console.error("메뉴 삭제 실패:", err);
                    alert("메뉴 삭제에 실패했습니다.");
                });
        }
    };



    return (
        <div className={style["outbox"]}>
            <div className={style["rightbox"]}>
                <div className={style["menu_button"]}>
                    <button onClick={() => setSelectedTab("전체메뉴")}> 전체메뉴 </button>
                    <button onClick={() => setSelectedTab("메뉴추가")}> 메뉴 추가 </button>
                    <button onClick={() => setSelectedTab("메뉴수정")}> 메뉴 수정 </button>
                </div>

                <div className={style["right_content"]}>
                    {selectedTab === "전체메뉴" && (
                        <>
                            <div className={style["all_menu"]}>
                                {currentMenuList.length > 0 ? (
                                    currentMenuList.map(menu => (
                                        <div key={menu.id} className={style["menu_card"]}>
                                            <img
                                                src={`http://localhost:8080/image/imgfile/${menu.folder}/${menu.filename}`}
                                                alt="메뉴 이미지"
                                                className={style["menu_image"]}
                                            />
                                            <div className={style["menu_info"]}>
                                                <p>{menu.menuName}</p>
                                                {/* <div
                                                    className={`${style.menu_status} ${menu.status === "판매중" ? "" : style.menu_soldout
                                                        }`}
                                                >
                                                    <p>{menu.status || "판매중"}</p>
                                                </div> */}

                                            </div>
                                            <div className={style["menu_price"]}>
                                                <p>{menu.menuPrice}원</p>
                                            </div>
                                            <div className={style["menuCRUD_button"]}>
                                                <button
                                                    className={style["menu_edit"]}
                                                    onClick={() => {
                                                        setSelectedMenu(menu);
                                                        setSelectedTab("메뉴수정");
                                                    }}>
                                                    수정
                                                </button>
                                                <button className={style["menu_delete"]}
                                                    onClick={() => handleMenuDelete(menu.id)}>삭제</button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>등록된 메뉴가 없습니다.</p>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className={style["pagination"]}>
                                    {pageNumbers.map(number => (
                                        <button
                                            key={number}
                                            onClick={() => setCurrentPage(number)}
                                            className={currentPage === number ? style["active"] : ""}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {selectedTab === "메뉴추가" && (
                        <div className={style["insert_menu"]}>
                            <div className={style["image_insert"]}>
                                <input className={style["storeNum"]}
                                    type="text"
                                    placeholder="가게번호를 입력해주세요"
                                    value={newStoreId}
                                    onChange={(e) => setNewStoreId(e.target.value)}
                                /><br />
                                <p> 메뉴 사진 추가하기</p>
                                <label>
                                    <input
                                        type="file"
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                    />
                                </label>
                                <button onClick={handleImageUpload}> 이미지 등록하기 </button>
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

                                <button className={style["insertmenu_button"]}
                                    onClick={handleMenuInsert}>추가하기</button>
                            </div>
                        </div>
                    )}

                    {selectedTab === "메뉴수정" && (
                        <div className={style["edit_menu"]}>
                            {selectedMenu ? (
                                <>
                                    <div className={style["edit_menu_image"]}>
                                        <img
                                            src={`http://localhost:8080/image/imgfile/${selectedMenu.folder}/${selectedMenu.filename}`}
                                            alt="메뉴 이미지"
                                            className={style["menu_image"]}
                                        />
                                    </div>
                                    <div>
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
                                </>
                            ) : (
                                <p>수정할 메뉴를 선택해주세요.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
