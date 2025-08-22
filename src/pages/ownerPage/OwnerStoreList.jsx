import style from "../../CSS/Owner/OwnerStoreList.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

export default function StoreManagement() {
    const user = useSelector((state) => state.auth.user);
    const [storeList, setStoreList] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [editForm, setEditForm] = useState({
        storeName: "",
        storeAddress: "",
        minPrice: "",
        tel: ""
    });

    // 로딩 상태
    const [loading, setLoading] = useState(true);

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // 현재 페이지에 해당하는 store 리스트 잘라내기
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStoreList = storeList.slice(indexOfFirstItem, indexOfLastItem);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(storeList.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        if (!user || !user.id) {
            console.log("로그인된 사장님 정보 없음");
            setLoading(false);
            return;
        }

        const ownerId = user.id;
        setLoading(true);
        axios.get(`api/store/storeByOwnerId/${ownerId}`)
            .then(res => {
                console.log("가게 리스트:", res.data);
                setStoreList(res.data);
            })
            .catch(err => {
                console.error("가게 불러오기 실패:", err);
            })
            .finally(() => setLoading(false));
    }, [user]);

    const deletebutton = async (storeId) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            await axios.get(`api/store/storeDelete/${storeId}`);
            setStoreList(prevList => prevList.filter(store => store.id !== storeId));
        } catch (err) {
            console.error("가게 삭제 실패:", err);
        }
    };

    const handleUpdate = async () => {
        if (!selectedStore) return;

        const updatedStore = {
            id: selectedStore.id,
            storeName: editForm.storeName.trim() === "" ? selectedStore.storeName : editForm.storeName,
            storeAddress: editForm.storeAddress.trim() === "" ? selectedStore.storeAddress : editForm.storeAddress,
            minPrice: editForm.minPrice.trim() === "" ? selectedStore.minPrice : editForm.minPrice,
            tel: editForm.tel.trim() === "" ? selectedStore.tel : editForm.tel
        };

        try {
            await axios.put("api/store/storeUpdate", updatedStore);
            alert("수정 완료!");
            setStoreList(prev =>
                prev.map(store =>
                    store.id === updatedStore.id ? { ...store, ...updatedStore } : store
                )
            );
            setSelectedStore(null);
        } catch (err) {
            console.error("수정 실패:", err);
            alert("수정 실패!");
        }
    };

    return (
        <>
            <div className={style["outbox"]}>
                <div className={style["rightbox"]}>
                    <div className={style["storelist"]}>
                        {loading ? (
                            <p>로딩중...</p>
                        ) : currentStoreList.length > 0 ? (
                            currentStoreList.map((store) => (
                                <div key={store.id} className={style["store_card"]}>
                                    <h5>가게번호: {store.id}</h5>
                                    <h4>{store.storeName}</h4>
                                    <p>최소주문금액: {store.minPrice}</p>
                                    <p>주소: {store.storeAddress}</p>
                                    <p>전화번호: {store.tel}</p>
                                    <button
                                        className={style["store_edit_button"]}
                                        onClick={() => {
                                            setSelectedStore(store);
                                            setEditForm({
                                                storeName: "",
                                                storeAddress: "",
                                                minPrice: "",
                                                tel: ""
                                            });
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        className={style["store_delete_button"]}
                                        onClick={() => deletebutton(store.id)}
                                    >
                                        삭제
                                    </button>

                                    {selectedStore && selectedStore.id === store.id && (
                                        <div className={style["store_edit_section"]}>
                                            <h3>가게 수정하기</h3>
                                            <p>
                                                가게 이름
                                                <input
                                                    type="text"
                                                    placeholder={store.storeName}
                                                    value={editForm.storeName}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, storeName: e.target.value })
                                                    }
                                                />
                                            </p>
                                            <p>
                                                최소주문금액
                                                <input
                                                    type="text"
                                                    placeholder={store.minPrice}
                                                    value={editForm.minPrice}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, minPrice: e.target.value })
                                                    }
                                                />
                                            </p>
                                            <p>
                                                주소
                                                <input
                                                    type="text"
                                                    placeholder={store.storeAddress}
                                                    value={editForm.storeAddress}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, storeAddress: e.target.value })
                                                    }
                                                />
                                            </p>
                                            <p>
                                                전화번호
                                                <input
                                                    type="text"
                                                    placeholder={store.tel}
                                                    value={editForm.tel}
                                                    onChange={(e) =>
                                                        setEditForm({ ...editForm, tel: e.target.value })
                                                    }
                                                />
                                            </p>
                                            <button className={style["update-btn"]} onClick={handleUpdate}>수정 완료</button>
                                            <button className={style["cancel-btn"]} onClick={() => setSelectedStore(null)}>닫기</button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>등록된 가게가 없습니다.</p>
                        )}
                    </div>

                    {/* 페이지네이션 버튼 */}
                    {!loading && totalPages > 1 && (
                        <div className={style["pagination"]}>
                            {pageNumbers.map((number) => (
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
                </div>
            </div>
        </>
    );
}
