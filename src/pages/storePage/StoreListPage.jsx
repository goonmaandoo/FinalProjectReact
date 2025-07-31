import styles from '../../CSS/StoreListPage.module.css'
import { useState, useEffect, useRef } from "react";

export default function StoreListPage(){
    const [category, setCategory] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
    const categoryRef = useRef(null);

    useEffect(() => {
            //카테고리 조회
            fetch('http://localhost:8080/store/categoryId')
            .then(res => {
                if (!res.ok) throw new Error('서버 에러');
                return res.json();
            })
            .then(data => setCategory(data))
            .catch(console.error);
        },[]);

    // 버튼 스크롤
    const scrollRight = () => {
        if (categoryRef.current) {
            categoryRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
    };
    const scrollLeft = () => {
        if (categoryRef.current) {
            categoryRef.current.scrollBy({ left: -200, behavior: "smooth" });
        }
    };
    
    return(
        <div className={styles["storelist_body"]}>
            <div className={styles["circle_category_outer"]}>
                <button className={styles["scroll_button"]} onClick={scrollLeft}>
                    <img src="http://localhost:8080/image/imgfile/main_img/backbtn.png" alt="왼쪽" />
                </button>
                <div className={styles["circle_category_wrap"]} ref={categoryRef}>
                    {category.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedCategoryId(item.id)}
                            className={selectedCategoryId === item.id ? styles["selected"] : ""}
                        >
                            <div className={styles["circle_with_text"]}>
                                <div className={styles["circle"]}>
                                    <img src={
                                            item.id === "1"
                                                ? "https://localhost:8080/image/imgfile/category/All.png"
                                                : `https://localhost:8080/image/imgfile/category/${item.category}.png`
                                        }
                                        alt={`${item.category}`}
                                    />
                                </div>
                                <div className={styles["circle_text"]}>{item.category}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <button className={styles["scroll_button"]} onClick={scrollRight}>
                    <img src="http://localhost:8080/image/imgfile/main_img/backbtn2.png" alt="오른쪽" />
                </button>
            </div>
            <div className={styles["second_body"]}>
                <div className={styles["storelist_wrap"]}>
                    {/* {filteredStores.length > 0 ? (
                        filteredStores.map((item) => (
                            <Link key={item.id} to={`/store/${item.id}`} onClick={(e) => storeClick(e, item.id)}>
                                <div className={styles["img_explain_wrap"]}>
                                    <div className={styles["storesquare_img"]}>
                                        <img src={`${storeUrl}${item.id}.jpg`} alt={`${item.store_name} 이미지`} />
                                    </div>
                                    <div className={styles["storeexplain"]}>
                                        <h2>{item.store_name}</h2>
                                        <h4>가게 위치: {item.store_address}</h4>
                                        <h5>배달비: <span className={styles["deliveryfree"]}>무료배달</span></h5>
                                        <h5>최소 주문: {item.min_price}원</h5>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className={styles.room_no_result}>
                            주문 가능한 가게가 없습니다.
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    )
}