import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../CSS/StarRating.module.css";
import { FaStar } from "react-icons/fa";

const StartRating = () => {
  const { room_id } = useParams();
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [ratings, setRatings] = useState({});
  const [roomInfo, setRoomInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(true);

  const basic_profile =
    "https://epfwvrafnhdgvyfcrhbo.supabase.co/storage/v1/object/public/profile-image/mypagePerson.png";

  const SERVER_BASE = "http://localhost:8080"; // 오라클 서버 기준

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
      } finally {
        setLoadingUser(false);
      }
    };
    fetchCurrentUser();
  }, []);
  
  // ✅ 방 정보 조회
  useEffect(() => {
    if (!room_id) return;

    const fetchRoomInfo = async () => {
      try {
        const res = await axios.get(`/api/room/${room_id}`);
        setRoomInfo(res.data);
      } catch (err) {
        console.error("방 정보 조회 실패:", err);
      } finally {
        setLoadingRoom(false);
      }
    };

    fetchRoomInfo();
  }, [room_id]);

  // ✅ 참여자 정보 조회 (자기 자신 제외)
  useEffect(() => {
    if (!room_id || !currentUserId) return;

    const fetchParticipants = async () => {
      try {
        const res = await axios.get(`/api/roomJoin/participants?roomId=${room_id}`);
        const otherUsers = res.data.filter((user) => user.id !== currentUserId);

        // MyPage 방식: DB 경로를 서버 URL과 결합
        const usersWithProfile = otherUsers.map((user) => ({
          ...user,
          profileUrl: user.profileUrl
            ? `${SERVER_BASE}${user.profileUrl}?t=${new Date().getTime()}`
            : null,
        }));

        setParticipants(usersWithProfile);
      } catch (err) {
        console.error("참여자 정보 조회 실패:", err);
      } finally {
        setLoadingParticipants(false);
      }
    };

    fetchParticipants();
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
            {
              userId: parseInt(userId),
              score: score,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
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

  const isLoading = loadingUser || loadingRoom || loadingParticipants;

  return (
    <div className={styles.container}>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <>
          <h2 className={styles.title}>
            {roomInfo ? `${roomInfo.roomName} 방의 사용자 평가하기` : "사용자 평가하기"}
          </h2>

          {participants.length === 0 ? (
            <p>⚠️ 방에 평가할 사용자가 없습니다.</p>
          ) : (
            <div className={styles.userList}>
              {participants.map((user) => (
                <div key={user.id} className={styles.userBox}>
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
                        key={n}
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
        </>
      )}
    </div>
  );
};

export default StartRating;
