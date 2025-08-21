import style from "../../CSS/Owner/OwnerMenuEdit.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import MenuAdd from "./MenuAdd";
import MenuEdit from "./MenuEdit";

export default function OwnerMenuEdit() {
    const user = useSelector((state) => state.auth.user);
    const [menuList, setMenuList] = useState([]);
    const [storeId, setStoreId] = useState("");
    const [selectedTab, setSelectedTab] = useState("전체메뉴");
    const [selectedMenu, setSelectedMenu] = useState(null);

    // 페이지네이션
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

    // 메뉴 리스트 새로고침
    const refreshMenuList = () => {
        if (!user || !user.id) return;

        axios.get(`api/menu/ownerWithImage/${user.id}`)
            .then(res => {
                setMenuList(res.data);
                if (res.data.length > 0) {
                    setStoreId(res.data[0].storeId);
                }
            })
            .catch(console.error);
    };

    useEffect(() => {
        if (!user || !user.id) {
            console.log("로그인된 사장님 정보가 없습니다.");
            return;
        }
        refreshMenuList();
    }, [user]);

    const handleMenuDelete = (menuId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.get(`api/menu/menuDeleteByOwner/${menuId}`)
                .then((res) => {
                    if (res.data > 0) {
                        alert("메뉴가 삭제되었습니다.");
                        refreshMenuList();
                    } else {
                        alert("삭제에 실패했습니다.");
                    }
                })
                .catch((err) => {
                    console.error("메뉴 삭제 실패:", err);
                    alert("메뉴 삭제에 실패했습니다.");
                });
        }
    };


    const handleMenuAddComplete = () => {
        refreshMenuList();
    };


    const handleMenuEditComplete = () => {
        setSelectedTab("전체메뉴");
        setSelectedMenu(null);
        refreshMenuList();
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        if (tab !== "메뉴수정") {
            setSelectedMenu(null);
        }
    };

    return (
        <div className={style["outbox"]}>
            <div className={style["rightbox"]}>
                <div className={style["right_content"]}>
                    {selectedTab === "전체메뉴" && (
                        <>
                            <div className={style["menu_button"]}>
                                <button onClick={() => handleTabChange("전체메뉴")} className={style["active"]}> 전체메뉴 </button>
                                <button onClick={() => handleTabChange("메뉴추가")}> 메뉴 추가 </button>
                            </div>
                            <div className={style["all_menu"]}>
                                {currentMenuList.length > 0 ? (
                                    currentMenuList.map(menu => (
                                        <div key={menu.id} className={style["menu_card"]}>
                                            <img
                                                src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/${menu.folder}/${menu.filename}`}
                                                alt="메뉴 이미지"
                                                className={style["menu_image"]}
                                            />
                                            <div className={style["menu_info"]}>
                                                <p>{menu.menuName}</p>
                                                <div className={style.menu_status}
                                                    style={{
                                                        backgroundColor: menu.status === '품절' ? '#808080' : '#04b310'
                                                    }}>
                                                    <p>{menu.status}</p>
                                                </div>
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
                        <MenuAdd
                            user={user}
                            storeId={storeId}
                            onComplete={handleMenuAddComplete}
                            onTabChange={handleTabChange}
                        />
                    )}

                    {selectedTab === "메뉴수정" && (
                        <MenuEdit
                            selectedMenu={selectedMenu}
                            user={user}
                            onComplete={handleMenuEditComplete}
                            onTabChange={handleTabChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}