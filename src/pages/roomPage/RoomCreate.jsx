import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import style from "../../CSS/RoomCreate.module.css";

export default function RoomCreate() {
  const navigate = useNavigate();
  const { store_id } = useParams();

  const [roomName, setRoomName] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const [roomAddress, setRoomAddress] = useState('');
  const [roomDetailAddress, setRoomDetailAddress] = useState('');
  const [maxPeople, setMaxPeople] = useState(6);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setAuthUser(res.data))
    .catch(() => setAuthUser(null));
  }, []);

  const handleCreateRoom = async () => {
    if (!roomName) {
      alert('공구방 이름을 입력하세요.');
      return;
    }
    if (maxPeople < 2) {
      alert('인원수는 2명 이상이어야 합니다.');
      return;
    }
    if (!authUser || !authUser.id) {
      alert('로그인이 필요합니다.');
      return;
    }

    const roomData = {
      roomName,
      roomAddress,
      roomAddressDetail,
      maxPeople,
      leaderId: authUser.id,
      storeId: parseInt(store_id),
      status: '모집중',
      users: authUser.id,
    };

    try {
      const response = await axios.post('/room/create', roomData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert(`공구방 생성 완료! ID: ${response.data}`);
      navigate(`/room/${response.data}`);
    } catch (error) {
      alert('공구방 생성 실패: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className={style['container']}>
      <div className={style['room_create_page_box']}>
        <h1>공구방 생성</h1>

        <div className={style['input_label_box']}>
          <div className={style['label_box']}>공구방 이름</div>
          <input
            className={style['input_box']}
            type="text"
            placeholder="공구방 이름"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        <div className={style['input_label_box']}>
          <div className={style['label_box']}>공구방 주소</div>
          <input
            className={style['input_box']}
            type="text"
            placeholder="공구방 주소"
            value={roomAddress}
            onChange={(e) => setRoomAddress(e.target.value)}
          />
        </div>

        <div className={style['input_label_box']}>
          <div className={style['label_box']}>공구방 상세 주소</div>
          <input
            className={style['input_box']}
            type="text"
            placeholder="공구방 상세 주소"
            value={roomDetailAddress}
            onChange={(e) => setRoomDetailAddress(e.target.value)}
          />
        </div>

        <div className={style['input_label_box']}>
          <div className={style['label_box']}>공구방 인원수</div>
          <input
            className={style['input_box']}
            type="number"
            placeholder="공구방 인원수"
            value={maxPeople}
            min={2}
            onChange={(e) => setMaxPeople(parseInt(e.target.value))}
          />
        </div>

        <input
          className={[style['input_box'], style['input_button_box']].join(' ')}
          type="button"
          value="생성"
          onClick={handleCreateRoom}
        />
      </div>
    </div>
  );
}
