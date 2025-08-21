import styles from "../CSS/SearchPage.module.css";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function SearchPage() {
  const params = new URLSearchParams(location.search);
  const keyword = params.get("keyword");
  const [category, setCategory] = useState("전체");
  const [roomData, setRoomData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [storeData, setStoreData] = useState([]);

    useEffect(() => {
        axios.get(`/api/room/keyword/${keyword}`)
            .then(res => {
                setRoomData(res.data);
            })
            .catch(console.error);
        axios.get(`/api/store/keyword/${keyword}`)
            .then(res => {
                setStoreData(res.data);
            })
            .catch(console.error);
        axios.get(`/api/menu/keyword/${keyword}`)
            .then(res => {
                setMenuData(res.data);
            })
            .catch(console.error);
    }, [keyword])

  // //채팅방에 사용자 있는지 확인
  // const roomClick = async (e, roomId) => {
  //     e.preventDefault();

  //     if (!user) {
  //         alert("로그인이 필요합니다.");
  //         return;
  //     }
  //     const { data } = await supabase.from("room_join").select("*").eq("room_id", roomId).eq("user_id", userId);

  //     if (data.length > 0) {
  //         window.location.href = `/delivery-moa/room/${roomId}`;
  //     } else {
  //         const confirmJoin = window.confirm("이 공구방에 참여하시겠습니까?");
  //         if (confirmJoin) {
  //             window.location.href = `/delivery-moa/room/${roomId}`;
  //         }
  //     }
  // }

  return (
    <main className={styles["main_box"]}>
      <div className={styles["main_container"]}>
        <div className={styles["keyword_result"]}>
          "{keyword}"에 대한 검색결과
        </div>
        <hr />
        <div className={styles["search_hitory_box"]}>
          <div>
            <ul className={styles["search_category"]}>
              {["전체", "가게", "메뉴", "공구방"].map((tab) => (
                <li
                  key={tab}
                  className={category === tab ? styles["active_tab"] : ""}
                  onClick={() => {
                    setCategory(tab);
                    window.scrollTo({ top: 0 });
                  }}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </div>
          {(category === "전체" || category === "가게") && (
            <>
              <div className={styles["search_keyword"]}>가게</div>
              <hr />
              {storeData.length > 0 ? (
                (category === "전체" ? storeData.slice(0, 4) : storeData).map(
                  (item) => (
                    <Link key={item.id} to={`/store/${item.id}`}>
                      <div className={styles["search_result"]}>
                        <img
                          className={styles["search_store_img"]}
                          src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/store/store_${item.id}.jpg`}
                          alt={`${item.storeName}`}
                        ></img>
                        <div className={styles["search_store_detail"]}>
                          <div>
                            <div className={styles["search_store_name"]}>
                              {item.storeName}
                            </div>
                            <ul className={styles["search_ul"]}>
                              <li>
                                <span className={styles["star"]}>★</span>
                                <span className={styles["score"]}>
                                  4.9(1689)
                                </span>
                              </li>
                              <li>210m</li>
                              <li>25~40분</li>
                            </ul>
                            <div className={styles["search_delivery"]}>
                              배달비 무료
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                )
              ) : (
                <div className={styles["search_noResult"]}>
                  검색 결과가 없습니다.
                </div>
              )}
            </>
          )}
          {(category === "전체" || category === "메뉴") && (
            <>
              <div className={styles["search_keyword"]}>메뉴</div>
              <hr />
              {menuData.length > 0 ? (
                (category === "전체" ? menuData.slice(0, 4) : menuData).map(
                  (item) => (
                    <Link key={item.id} to={`/store/${item.storeId}`}>
                      <div className={styles["search_result"]}>
                        <img
                          className={styles["search_store_img"]}
                          src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/${item.folder}/${item.filename}`}
                          alt={`${item.menuName}`}
                        ></img>
                        <div className={styles["search_store_detail"]}>
                          <div>
                            <div className={styles["search_store_name"]}>
                              {item.menuName}
                            </div>
                            <div className={styles["search_menu_name"]}>
                              {item.storeName}
                            </div>
                            <div className={styles["search_menu_price"]}>
                              {item.menuPrice}원
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                )
              ) : (
                <div className={styles["search_noResult"]}>
                  검색 결과가 없습니다.
                </div>
              )}
              {category === "전체" && menuData.length > 4 && (
                <div className={styles["more"]}>
                  <button
                    onClick={() => {
                      setCategory("메뉴");
                      window.scrollTo({ top: 0 });
                    }}
                  >
                    더보기
                  </button>
                </div>
              )}
            </>
          )}
          {(category === "전체" || category === "공구방") && (
            <>
              <div className={styles["search_keyword"]}>공구방</div>
              <hr />
              {roomData.filter((room) => room.status == "모집중").length > 0 ? (
                (category === "전체"
                  ? roomData
                      .filter((room) => room.status == "모집중")
                      .slice(0, 4)
                  : roomData
                )
                  .filter((room) => room.status == "모집중")
                  .map((item) => (
                    <Link
                      key={item.id}
                      to={`/room/${item.id}`}
                      onClick={(e) => roomClick(e, item.id)}
                    >
                      <div className={styles["search_result"]}>
                        <img
                          className={styles["search_store_img"]}
                          src={`https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/imgfile/store/store_${item.storeId}.jpg`}
                          alt={`${item.storeId}`}
                        ></img>
                        <div className={styles["search_store_detail"]}>
                          <div>
                            <div className={styles["search_store_name"]}>
                              {item.roomName}
                            </div>
                            <div className={styles["search_menu_name"]}>
                              {item.roomAddress}
                            </div>
                            <div className={styles["search_status"]}>
                              {item.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
              ) : (
                <div className={styles["search_noResult"]}>
                  검색 결과가 없습니다.
                </div>
              )}
              {category === "전체" &&
                roomData.filter(
                  (room) => room.status !== "삭제" && room.status !== "종료"
                ).length > 4 && (
                  <div className={styles["more"]}>
                    <button
                      onClick={() => {
                        setCategory("공구방");
                        window.scrollTo({ top: 0 });
                      }}
                    >
                      더보기
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
