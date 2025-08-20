import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../CSS/StarRating.module.css";
import { FaStar } from "react-icons/fa";

const StarRating = () => {
  const { room_id } = useParams();
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [ratings, setRatings] = useState({});
  const [roomInfo, setRoomInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const basic_profile =
    "https://s3.us-east-1.amazonaws.com/delivery-bucket2025.08/profileImg/mypagePerson.png";

  const SERVER_BASE = "http://localhost:8080";

  // ✅ 현재 로그인 유저 조회
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(res.data.id);
      } catch (err) {
        console.error("현재 유저 정보 불러오기 실패:", err);
      }
    };
    fetchCurrentUser();
  }, []);

  // ✅ 방 정보 조회 및 참여자 세팅
  useEffect(() => {
    if (!room_id || !currentUserId) return;

    const fetchRoom = async () => {
      try {
        const res = await axios.get(`/api/room/${room_id}`);
        const room = res.data;
        setRoomInfo(room);

        if (room.usersInfo && room.usersInfo.length > 0) {
          const otherUsers = room.usersInfo.filter(
            (user) => Number(user.id) !== Number(currentUserId)
          );

          const usersWithProfile = otherUsers.map((user, idx) => ({
            ...user,
            profileUrl: user.profileUrl
              ? `${SERVER_BASE}${user.profileUrl}?t=${new Date().getTime()}`
              : null,
            key: `user-${user.id}-${idx}`, // ✅ 중복 key 방지
          }));

          setParticipants(usersWithProfile);
        } else {
          setParticipants([]);
        }
      } catch (err) {
        console.error("방 정보 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [room_id, currentUserId]);

  // ✅ 별점 클릭 처리
  const handleRating = (userId, value) => {
    setRatings((prev) => ({ ...prev, [userId]: value }));
  };

  // ✅ 제출 처리
  const handleSubmit = async () => {
    if (participants.length !== Object.keys(ratings).length) {
      alert("모든 사용자에게 별점을 주세요!");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await Promise.all(
        Object.entries(ratings).map(([userId, score]) =>
          axios.post(
            "/api/users/rating",
            { userId: Number(userId), score },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      alert("모든 별점 평가가 저장되었습니다.");
      navigate("/mainpage", { replace: true });
    } catch (err) {
      console.error("별점 저장 실패:", err);
      alert("별점 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {roomInfo
          ? `${roomInfo.roomName} 방의 사용자 평가하기`
          : "사용자 평가하기"}
      </h2>

      {participants.length === 0 ? (
        <p>⚠️ 방에 평가할 사용자가 없습니다.</p>
      ) : (
        <div className={styles.userList}>
          {participants.map((user) => (
            <div key={user.key} className={styles.userBox}>
              <img
                src={user.profileUrl || basic_profile}
                alt="프로필"
                className={styles.profileImage}
                onError={(e) => (e.target.src = basic_profile)}
              />
              <div className={styles.nickname}>{user.nickname}</div>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={`star-${user.id}-${n}`} // ✅ 별점 key도 고유하게
                    size={20}
                    className={
                      n <= (ratings[user.id] || 0)
                        ? styles.activeStar
                        : styles.inactiveStar
                    }
                    onClick={() => handleRating(user.id, n)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "저장 중..." : "제출하기"}
      </button>
    </div>
  );
};

export default StarRating;
