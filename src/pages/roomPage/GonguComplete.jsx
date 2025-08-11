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
        const room = roomRes.data.find((r) => r.id === parseInt(roomId));
        if (!room) throw new Error("해당 공구방을 찾을 수 없습니다.");
        setRoomInfo(room);

        // 2. 주문 조회
        const orderRes = await axios.get("/api/orders/getOrderListByRoom", {
          params: { roomId: room.id },
        });
        const orders = orderRes.data;

        // 3. 주문 내역 파싱 및 사용자 ID 수집
        const userIdSet = new Set();
        orders.forEach((order) => {
          // roomOrder가 이미 객체 상태이므로 바로 접근
          const parsedItems = order.roomOrder?.menu || [];
          order.parsedItems = parsedItems;
          userIdSet.add(order.userId);
        });

        // 4. 메뉴 정보 조회
        let menus = [];
        if (room.storeId) {
          const menuRes = await axios.get(`/menu/storeMenu/${room.storeId}`);
          menus = menuRes.data;
          console.log("menus:", menus);
        }

        // 5. 사용자 닉네임 조회 (POST 방식)
        const userIds = Array.from(userIdSet);
        let userProfiles = [];
        if (userIds.length > 0) {
          try {
            const userRes = await axios.post("/api/users/findUsersByIds", userIds);
            userProfiles = userRes.data.filter(
              (data) =>
                data && data.id !== null && data.nickname !== null
            );
          } catch (e) {
            console.error("유저 닉네임 조회 실패:", e);
            userProfiles = [];
          }
        }
        console.log("userProfiles:", userProfiles);

        const getUserName = (userId) => {
          const user = userProfiles.find((u) => String(u.id) === String(userId));
          return user?.nickname || `이름 없음 (ID: ${userId})`;
        };

        // 6. 주문 내역 매핑 (menus가 배열인지 꼭 체크)
        orders.forEach((order) => {
          order.items = order.parsedItems.map((item) => {
            const matched =
              Array.isArray(menus) &&
              menus.find(
                (m) =>
                  m.menuName.trim().toLowerCase() === item.name.trim().toLowerCase()
              );
            return {
              menu_name: item.name,
              menu_price: item.price || 0,
              quantity: item.count || 0,
              ...(matched ? { menuId: matched.id } : {}),
            };
          });
        });

        // 7. 유저별로 주문 그룹화
        const grouped = new Map();
        orders.forEach((order) => {
          const userId = order.userId;
          const nickname = getUserName(userId);

          if (!grouped.has(userId)) {
            grouped.set(userId, {
              user_id: userId,
              nickname,
              orders: [],
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

  if (loading) return <div className={styles.orderInfo}>주문 정보를 불러오는 중...</div>;
  if (error) return <div className={styles.orderInfo}>오류 발생: {error}</div>;

 return (
  <div className={styles.container}>
    <div className={styles.checkIcon}>
      <i className="fas fa-check-circle"></i>
    </div>

    <h2 className={styles.mainTitle}>공구가 완료되었습니다!</h2>
    <p className={styles.subText}>
      공구방 배달이 완료되었습니다. 전체 주문 내역을 확인하세요.
    </p>

<section className={styles.roomInfo}>
  <h3 className={styles.sectionTitle}>공구방 정보</h3>
  <div className={styles.roomDetails}>
    <div className={styles.detailItem}>
      <span className={styles.label}>공구방 ID: </span>
      <span className={styles.value}>{roomInfo?.id || "-"}</span>
    </div>
    <div className={styles.detailItem}>
      <span className={styles.label}>공구방 이름: </span>
      <span className={styles.value}>{roomInfo?.roomName || "-"}</span>
    </div>
    <div className={styles.detailItem}>
      <span className={styles.label}>참여 인원: </span>
      <span className={styles.value}>{participants.length}명</span>
    </div>
  </div>
</section>


    {participants.map((part) => (
      <section key={part.user_id} className={styles.participantOrder}>
        <h3>{part.nickname} 님의 주문</h3>
        {part.orders.map((order) => (
          <div key={order.orderId} className={styles.orderBlock}>
            <div className={styles.orderInfoRow}>
              <span>주문번호</span>
              <span>{order.orderId}</span>
            </div>
            <div className={styles.orderInfoRow}>
              <span>주문 일자</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className={styles.orderInfoRow}>
              <span>총 금액</span>
              <span>{thousands(order.totalPrice || 0)}원</span>
            </div>

            <div className={styles.itemsHeader}>상품 내역</div>
            {order.items?.map((item, i) => (
              <div key={i} className={styles.itemRow}>
                <span>{item.menu_name}</span>
                <span>{item.quantity}개</span>
                <span>{thousands(item.menu_price)}원</span>
              </div>
            ))}
          </div>
        ))}
      </section>
    ))}

    <div className={styles.footerNotice}>
      © 주문이 만족스러웠다면 리뷰를 작성해 주세요!
    </div>

    <div className={styles.buttonGroup}>
      <button className={styles.btnPrimary} onClick={goToReview}>
        리뷰 작성하기
      </button>
      <button className={styles.btnSecondary} onClick={goToGroupPurchase}>
        공구방 바로가기
      </button>
    </div>
  </div>
);
}