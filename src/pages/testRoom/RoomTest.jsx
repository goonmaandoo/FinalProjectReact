import styles from './RoomTest.module.css';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectAllRoom } from './roomFunction/selectAllRoom';
import axios from "axios";

export default function RoomTest() {
    const [room, setRoom] = useState(null);
    const [joinedUser, setJoinedUser] = useState(null);
    const [readyPeople, setReadyPeople] = useState(null);
    const [allReady, setAllReady] = useState(false);
    const [pollingReady, setPollingReady] = useState(true);
    const [chatLog, setChatLog] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatBodyRef = useRef(null);
    const [menuList, setMenuList] = useState([]);
    const [cart, setCart] = useState([]);
    const totalPrice = cart.reduce((sum, item) => sum + (item.menuPrice * item.quantity), 0);
    const user = useSelector((state) => state.auth.user);
    const roomId = 1;

    // ✅ 채팅 메시지 폴링
    useEffect(() => {
        if (!user) return;
        console.log("유저:", user);
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/room/${roomId}/chat`);
                setChatLog(response.data);
            } catch (error) {
                console.error("채팅 메시지 가져오기 실패:", error);
            }
        };

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 2000);

        return () => clearInterval(intervalId);
    }, [user, roomId]);

    // ✅ 채팅 로그 업데이트 시 스크롤 최하단 이동
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatLog]);

    // ✅ 채팅 전송 함수
    const handleSendMessage = async () => {
        if (!inputMessage.trim()) {
            console.log("메시지 전송 실패: 메시지가 비어있음.");
            return;
        }

        const newMessage = {
            roomId,
            userId: user.id,
            chat: inputMessage,
            createdAt: new Date(),
        };

        try {
            await axios.post(`/api/room/${roomId}/chat`, newMessage);
            setInputMessage('');
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    };

    // ✅ 방 정보 불러오기
    useEffect(() => {
        if (!user) return;
        const fetchRoom = async () => {
            try {
                const roomData = await selectAllRoom(roomId);
                if (typeof roomData.users === 'string') {
                    roomData.users = JSON.parse(roomData.users);
                }
                console.log("룸정보", roomData);
                console.log("스토어아이디", roomData.storeId);
                setJoinedUser(Array.isArray(roomData.users) ? roomData.users.length : 0);
                setRoom(roomData);
                setReadyPeople(roomData.ready_people || 0);
                if (roomData.storeId) {
                    console.log("스토어아이디2", roomData.storeId);
                    const menuResponse = await axios.get(`/api/menu/store/${roomData.storeId}`);
                    console.log("메뉴 데이터", menuResponse);
                    console.log("메뉴s", menuResponse.menuName);
                    setMenuList(menuResponse.data);
                }
            } catch (error) {
                console.error("룸 불러오기 실패:", error);
            }
        };
        fetchRoom();
    }, [user, roomId]);
    // 준비 상태 폴링
    useEffect(() => {
        if (!roomId || !pollingReady) {
            console.log("폴링 스탑");
            return;
        } 

        const fetchReadyPeople = async () => {
            try {
                const response = await axios.get(`/api/room/${roomId}/readyStatus`);
                setReadyPeople(response.data); 
            } catch (error) {
                console.error("준비 인원 가져오기 실패:", error);
            }
        };

        fetchReadyPeople(); // 최초 1회 실행
        const intervalId = setInterval(fetchReadyPeople, 2000); // 2초마다 polling

        return () => clearInterval(intervalId); // cleanup
    }, [roomId, pollingReady]);
    // ✅ 모든 유저 준비 상태 확인
    useEffect(() => {
        if (!room?.users) return;
        console.log("룸유저레디", room.users);
        const everyoneReady = room.users.every(user => user.ready === true);
        setAllReady(everyoneReady);
    }, [room?.users]);

    // ✅ 준비 상태 토글 함수
    const handleReadyToggle = async (userId) => {
        if (!room || !room.users) return;
        if (cart.length === 0) {
            alert("메뉴를 먼저 선택해주세요.");
            return;
        }

        const user = room.users.find(u => Number(u.userId) === Number(userId));
        if (!user) return;

        const newReadyState = !user.ready;
        const delta = newReadyState ? 1 : -1;

        const updatedUsers = room.users.map(u =>
            Number(u.userId) === Number(userId) ? { ...u, ready: newReadyState } : u
        );

        try {
            // 1. 방 users 업데이트
            await axios.put('/api/room/updateReady', {
                id: roomId,
                users: JSON.stringify(updatedUsers),
            });

            // 2. 준비 인원 수 증감 API 호출
            await axios.put(`/api/room/${roomId}/readyCount`, null, {
                params: { delta },
            });

            // 3. 최신 방 정보 다시 불러오기
            const updatedRoom = await selectAllRoom(roomId);
            if (typeof updatedRoom.users === 'string') {
                updatedRoom.users = JSON.parse(updatedRoom.users);
            }
            setRoom(updatedRoom);
            setReadyPeople(updatedRoom.ready_people || 0);

        } catch (error) {
            console.error("준비 상태 업데이트 실패:", error);
        }
    };
    // 담기 버튼
    const addToCart = (menu) => {
        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === menu.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...menu, quantity: 1 }];
            }
        });
    };
    const increaseQuantity = (id) => {
        setCart(prevCart => prevCart.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const decreaseQuantity = (id) => {
        setCart(prevCart => prevCart
            .map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
            .filter(item => item.quantity > 0) // 수량 0이면 장바구니에서 제거
        );
    };
    // 최종 주문
    const handleFinalOrder = () => {
        alert("최종주문 버튼");
        console.log("준비인원", readyPeople);
        console.log("참여인원", joinedUser);
        if (joinedUser === readyPeople) {
            alert("전원 준비 완료");
            setPollingReady(false);
            return;
        } else {
            alert("전원 준비 x");
            return
        }

        const finalOrder = cart.map(item => ({
            id: item.id,
            img_id: item.imageId,          // camelCase ➝ snake_case
            quantity: item.quantity,
            store_id: item.storeId,
            menu_name: item.menuName,
            menu_price: item.menuPrice
        }));

        console.log("🧾 변환된 카트 데이터:", simplifiedCart);

        // 여기에 API 요청 등 넣으면 됨
        alert("최종주문 완료!");
    };
    return (
        <div className={styles.roomContainer}>
            {/* 왼쪽 영역 */}
            <div className={styles.leftColumn}>
                <div className={styles.titleWrapper}>
                    <p>{room?.roomName}</p>
                </div>

                {/* 참여 유저 */}
                <div className={styles.memberWrapper}>
                    <p className={styles.sectionTitle}>참여 유저</p>
                    <div className={styles.scrollContainer}>
                        <ul className={styles.memberList}>
                            {room?.users?.length > 0 ? (
                                room.users.map((member, idx) => {
                                    const isLeader = room?.leaderId && member.userId.toString() === room.leaderId.toString();
                                    return (
                                        <li key={idx} className={styles.memberItem}>
                                            <img
                                                src={member.profileurl}
                                                alt={member.nickname}
                                                className={styles.memberProfile}
                                            />
                                            <p className={styles.memberNickname}>
                                                {member.nickname}
                                                {isLeader && (
                                                    <span className={styles.leaderTag}>방장</span>
                                                )}
                                            </p>
                                            <div className={styles.readyContainer}>
                                                <p className={member.ready ? styles.readyDone : styles.readyNotDone}>
                                                    {member.ready ? "준비완료" : ""}
                                                </p>
                                            </div>
                                            {isLeader && (
                                                <button
                                                    className={styles.finalOrderBtn}
                                                    disabled={!allReady}
                                                    onClick={handleFinalOrder}
                                                    style={{
                                                        backgroundColor: allReady ? 'green' : 'gray',
                                                        cursor: allReady ? 'pointer' : 'not-allowed',
                                                    }}
                                                >
                                                    최종주문
                                                </button>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <li>참여자가 없습니다.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* 채팅창 */}
                <div className={styles.chatWrapper}>
                    <p className={styles.sectionTitle}>채팅창</p>
                    <div className={styles.chatBody} ref={chatBodyRef}>
                        {chatLog.map((chat, idx) => (
                            <div key={idx} className={styles.chatMessage}>
                                <img src={chat.profileurl} alt={chat.nickname} />
                                <div className={styles.chatContentLeft}>
                                    <span className={styles.nickname}>{chat.nickname}</span>
                                    <span className={styles.chatText}>{chat.chat}</span>
                                </div>
                                <div className={styles.chatRightSection}>
                                    <span>{new Date(chat.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                    <button
                                        className={styles.reportButton}
                                        onClick={() => alert('신고 기능은 나중에 구현됩니다.')}
                                    >
                                        🚨
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.chatInput}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSendMessage();
                            }}
                        />
                        <button onClick={handleSendMessage}>입력</button>
                    </div>
                </div>
            </div>

            {/* 오른쪽 영역 */}
            <div className={styles.menuWrapper}>
                <div>
                    <p>가게메뉴</p>
                </div>
                <div className={styles.menuList}>
                    {menuList.length > 0 ? (
                        menuList.map(menu => (
                            <div key={menu.id} className={styles.menuItem}>
                                <p className={styles.menuName}>{menu.menuName}</p>
                                <p className={styles.menuPrice}>{menu.menuPrice.toLocaleString()}원</p>
                                <button className={styles.addToCartBtn} onClick={() => addToCart(menu)}>담기</button>
                            </div>
                        ))
                    ) : (
                        <p>메뉴가 없습니다.</p>
                    )}
                </div>
                <div>
                    담은메뉴
                </div>
                {cart.map(item => (
                    <div key={item.id} className={styles.cartItem}>
                        <span>{item.menuName}</span>
                        <span>{item.menuPrice ? item.menuPrice.toLocaleString() : '0'}원</span>
                        <div className={styles.quantityControls}>
                            <button onClick={() => decreaseQuantity(item.id)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => increaseQuantity(item.id)}>+</button>
                        </div>
                    </div>
                ))}
                <div>
                    <p>총 금액: {totalPrice.toLocaleString()}원</p>
                </div>
                <div>
                    <button onClick={() => handleReadyToggle(user.id)}>{room?.users?.find(u => Number(u.userId) === Number(user.id))?.ready ? '준비취소' : '준비완료'}</button>
                </div>
            </div>
        </div>
    );
}