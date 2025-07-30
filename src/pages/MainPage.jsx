import styles from '../CSS/MainPage.module.css';
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';

export default function MainPage() {
    const [keyword, setKeyword] = useState('');
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    //검색창
    const onKeyDown = (e) => {
        if (e.key === "Enter") {
            search();
        }
    }
    const search = () => {
        if (!keyword.trim()) {
            alert("검색어를 입력하세요.");
            return;
        }
        navigate(`/`);
    };
    //공구방 조회
    useEffect(() => {
        fetch('http://localhost:8080/room/allWithCount')
        .then(res => {
            if (!res.ok) throw new Error('서버 에러');
            return res.json();
        })
        .then(data => setRooms(data))
        .catch(console.error);
    },[]);

    return (
        <>
            <main>
                <div className={styles["search_header"]}>
                    <div className={styles["search_box"]}>
                        <div className={styles["search_text"]}>오늘은 무엇을 함께 먹을까요?</div>
                        <div className={styles["search"]}>
                            <input
                                type="text"
                                id="searchKeyword"
                                className={styles["search_value"]}
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder="음식점 또는 메뉴를 검색해보세요"
                            />
                            <button onClick={search} className={styles["search_btn"]}>검색</button>
                        </div>
                    </div>
                </div>
                <div className={styles["body_box"]}>
                    <div className={styles["body_container"]}>
                        <div className={styles["food_category_wrap"]}>
                            <div className={styles["food_category"]}>음식 카테고리</div>
                            <Link to="/storelist">
                                <div className={styles["food_category_move"]}>전체보기→</div>
                            </Link>
                        </div>
                        <div className={styles["circle_category_wrap"]}>

                        </div>
                        <div className={styles["gongu_wrap"]}>
                            <div className={styles["gongu_list"]}>진행중인 공구방</div>
                            <div className={styles["gongu_list_move"]}>
                                <Link to="/roomPage/AllRoom">전체보기→</Link>
                            </div>
                        </div>
                        <div className={styles["gongu_list_wrap"]}>
                            {rooms.length === 0 ? (
                                <div className={styles["no_room_message"]}>참여 가능한 공구가 없습니다.</div>
                            ) : (
                                rooms.slice(0, 6).map((items) => (
                                    <Link key={items.id} to={`/room/${items.id}`} style={{ cursor: "pointer" }}>
                                        <div className={styles["gongu_with_text"]}>
                                            <img className={styles["square_img"]}
                                                src={`http://localhost:8080/image/imgfile/store/store_${items.storeId}.jpg`}
                                                alt={`${items.roomName} 이미지`} />
                                            <div className={styles["square"]}>
                                                <div className={styles["gongu_title"]}>{items.roomName}</div>
                                                <div className={styles["gongu_date"]}>{items.roomAddress}  {items.room_address_detail}
                                                </div>
                                                <progress className={styles["gongu_progress"]} value={items.joinCount} max={items.maxPeople}></progress>
                                                <div className={styles["gongu_bottom"]}>
                                                    <div style={{ display: "flex", alignItems: "center" }}>
                                                        <img src="http://localhost:8080/image/imgfile/main_img/octicon_people-24.png" />
                                                        <div className={styles["gongu_people"]}>{items.joinCount}/{items.maxPeople} 참여중</div>
                                                    </div>
                                                    <div className={styles["gongu_delivery"]}>배달비 무료</div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles["body_bottom"]}>
                    <div className={styles["body_bottom_container"]}>
                        <div className={styles["popular_text"]}>지금 인기있는 메뉴</div>
                        <div className={styles["popular_list_wrap"]}>

                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}