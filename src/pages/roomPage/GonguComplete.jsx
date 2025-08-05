import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import thousands from "thousands";
import styles from "../../CSS/GonguComplete.module.css";

export default function GonguComplete() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [roomInfo, setRoomInfo] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. 공구방 정보 조회
        const roomRes = await axios.get("/api/room/allRoomSelect");
        const room = roomRes.data.find(r => r.id === parseInt(roomId));
        if (!room) throw new Error("해당 공구방을 찾을 수 없습니다.");
        setRoomInfo(room);

        // 2. order 테이블에서 room_id 기준 전체 주문 조회
        const orderRes = await axios.get("/api/order/getOrderListByRoom", {
          params: { roomId: room.id }
        });
        const orders = orderRes.data;

        // 3. 주문 내역 파싱 및 메뉴 정보 수집
        const userIdSet = new Set();
        orders.forEach(order => {
          let parsedItems = [];
          try {
            const parsed = JSON.parse(order.roomOrder);
            parsedItems = parsed.menu || []; // 메뉴 배열 접근
          } catch {
            parsedItems = [];
          }
          order.parsedItems = parsedItems;
          userIdSet.add(order.userId);
        });

        // 4. 메뉴 정보 조회
        let menus = [];
        if (room.storeId) {
          const menuRes = await axios.get(`/menu/storeMenu/${room.storeId}`);
          menus = menuRes.data;
        }

        // 5. 사용자 닉네임 조회
        const userIds = Array.from(userIdSet);
        let userProfiles = [];
        if (userIds.length > 0) {
          const userProfilePromises = userIds.map(uid =>
            axios.get(`/api/users/getUserAddress/${uid}`)
          );
          const results = await Promise.all(userProfilePromises);
          userProfiles = results.map(r => r.data);
        }

        const getUserName = userId => {
          const user = userProfiles.find(u => u.id === userId);
          return user?.nickname || "이름 없음";
        };

        // 6. 주문 내역 매핑
        orders.forEach(order => {
          order.items = order.parsedItems.map(item => {
            const matched = menus.find(m => m.menuName === item.name);
            return {
              menu_name: item.name,
              menu_price: item.price,
              quantity: item.count,
              ...(matched ? { menuId: matched.id } : {})
            };
          });
        });

        // 7. 유저별로 주문 그룹화
        const grouped = new Map();
        orders.forEach(order => {
          const userId = order.userId;
          const nickname = getUserName(userId);

          if (!grouped.has(userId)) {
            grouped.set(userId, {
              user_id: userId,
              nickname,
              orders: []
            });
          }

          grouped.get(userId).orders.push(order);
        });

        setParticipants(Array.from(grouped.values()));
        setLoading(false);
      } catch (err) {
        console.error("공구완료 페이지 로딩 오류:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [roomId]);

  const goToGroupPurchase = () => {
    if (roomInfo?.id) {
      navigate(`/room/${roomInfo.id}`);
    } else {
      navigate("/mainpage");
    }
  };

  const goToReview = () => {
    if (roomInfo?.id) {
      navigate(`/review/${roomInfo.id}`);
    } else {
      alert("room_id가 없어 리뷰 페이지로 이동할 수 없습니다.");
    }
  };

  if (loading)
    return <div className={styles.orderInfo}>주문 정보를 불러오는 중...</div>;
  if (error)
    return <div className={styles.orderInfo}>오류 발생: {error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>공구방 정보</h2>
      <div className={styles.infoRow}>
        <div className={styles.infoLabel}>공구방 이름</div>
        <div className={styles.infoValue}>{roomInfo?.roomName || "공구방 이름 없음"}</div>
      </div>

      <br />

      <h2 className={styles.header}>참여자별 주문 내역</h2>
      {participants.map(part => (
        <div key={part.user_id} className={styles.orderInfo}>
          <h3>{part.nickname} 님의 주문</h3>

          {part.orders.map(order => (
            <div key={order.orderId} className={styles.orderItems}>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>주문번호</div>
                <div className={styles.infoValue}>{order.orderId}</div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>주문 일자</div>
                <div className={styles.infoValue}>
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>총 금액</div>
                <div className={styles.infoValue}>{thousands(order.totalPrice || 0)}원</div>
              </div>

              <h4>상품 내역</h4>
              {order.items.map((item, i) => (
                <div key={i} className={styles.orderItem}>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>상품명</div>
                    <div className={styles.infoValue}>{item.menu_name}</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>수량</div>
                    <div className={styles.infoValue}>{item.quantity}개</div>
                  </div>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>금액</div>
                    <div className={styles.infoValue}>{thousands(item.menu_price)}원</div>
                  </div>
                </div>
              ))}
              <hr />
            </div>
          ))}
        </div>
      ))}

      <div className={styles.notice}>
        <p>
          <i className="fas fa-info-circle"></i> 주문이 만족스러웠다면 리뷰를 남겨주세요!
        </p>
      </div>

      <div className={styles.buttons}>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={goToReview}>
          리뷰 작성하기
        </button>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={goToGroupPurchase}>
          공구방 바로가기
        </button>
      </div>
    </div>
  );
}
