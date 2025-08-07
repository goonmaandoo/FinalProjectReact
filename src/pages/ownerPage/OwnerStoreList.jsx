import style from "../../CSS/OwnerDashboard.module.css"
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


    useEffect(() => {
        if (!user || !user.id) {
            console.log("로그인된 사장님 정보 없음");
            return;
        }
        const ownerId = user.id;
        axios.get(`http://localhost:8080/store/storeByOwnerId/${ownerId}`)
            .then(res => {
                console.log("가게 리스트:", res.data);
                setStoreList(res.data);
            })
            .catch(err => {
                console.error("가게 불러오기 실패:", err);
            });
    }, [user]);

    const deletebutton = async (storeId) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;  // 취소하면 그냥 함수 종료

        try {
            await axios.get(`http://localhost:8080/store/storeDelete/${storeId}`)
            setStoreList(prevList => prevList.filter(store => store.id !== storeId));
        } catch (err) {
            console.error("가게 삭제 실패:", err);
        }
    }

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
            await axios.put("http://localhost:8080/store/storeUpdate", updatedStore);
            alert("수정 완료!");

            // 리스트 갱신
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

                {/* 메인 콘텐츠 */}
                <div className={style["rightbox"]}>

                    <div className={style["storelist"]}>
                        {storeList.length > 0 ? (
                            storeList.map((store) => (
                                <div key={store.id} className={style["store_card"]}>
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
                                            }); // 초기화
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

                                    {/* 수정 폼은 선택된 가게와 같을 때만 표시 */}
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

                </div>
            </div>
        </>
    );
}
