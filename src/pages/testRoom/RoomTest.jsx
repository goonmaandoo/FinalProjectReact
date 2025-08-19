import styles from './RoomTest.module.css';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectAllRoom } from './roomFunction/selectAllRoom';
import { updateRoomStatus } from './roomFunction/updateRoomStatus';
import { deleteOrder } from './roomFunction/deleteOrder';
import { handleLeaveRoom } from './roomFunction/leaveRoom';
import { selectRoomJoin } from './roomFunction/selectRoomJoin';
import { getInRoom } from './roomFunction/getInRoom';
import { changeRoomStatus } from './roomFunction/changeRoomStatus';
import { countingJoin } from './roomFunction/countingJoin';
import OrderConfirmModal from './OrderconfirmModal';
import OrderCompleteModal from './OrderCompleteModal';
import ReportModal from './ReportModal';
import axios from "axios";

export default function RoomTest() {
    const [room, setRoom] = useState(null);
    const [allReady, setAllReady] = useState(false);
    const [pollingReady, setPollingReady] = useState(true);
    const [status, setStatus] = useState(null);
    const [chatLog, setChatLog] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const chatBodyRef = useRef(null);
    const [menuList, setMenuList] = useState([]);
    const [cart, setCart] = useState([]);
    const [orderId, setOrderId] = useState(null);

    // 주문 확인 및 주문 완료 모달 상태 관리
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showOrderCompleteModal, setShowOrderCompleteModal] = useState(false);

    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [leader, setLeader] = useState(false);
    const [kickId, setKickId] = useState(null);
    const totalPrice = cart.reduce((sum, item) => sum + (item.menuPrice * item.quantity), 0);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const { room_id: roomId } = useParams();
    const basic_profile = "http://localhost:8080/image/profileImg/mypagePerson.png";

    // 룸 신규 or 참여중 check
    useEffect(() => {
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate("/login");
            return;
        }
        const fetchRoomJoin = async () => {
            try {
                // 1. 방 정보와 강퇴 여부를 먼저 확인
                const roomData = await selectAllRoom(roomId);
                if (typeof roomData.users === 'string') {
                    roomData.users = JSON.parse(roomData.users);
                }

                // 🚨 강퇴된 유저인지 즉시 확인
                if (roomData.kickId && Number(roomData.kickId) === Number(user.id)) {
                    alert("강퇴되었던 방입니다. 입장할 수 없습니다.");
                    navigate("/mainpage");
                    return;
                }

                // 2. 현재 유저가 이미 참여 중인지 확인
                const data = await selectRoomJoin(roomId, user.id);
                const isAlreadyJoined = data.some(item => item.usersId === user.id);

                // 이미 참여중인 경우, 신규 입장 로직을 건너뜁니다.
                if (isAlreadyJoined) {
                    console.log("이미 참여중입니다.");
                    return;
                }

                // 3. 방이 꽉 찼는지 확인
                const maxed = await countingJoin(roomId);
                if (maxed) {
                    alert("방이 꽉 찼습니다.");
                    navigate("/mainpage");
                    return;
                }

                // 4. 위의 모든 조건을 통과하면 신규 유저로 입장 처리
                console.log("신규 유저 방 입장");
                const newUser = {
                    nickname: user?.nickname,
                    pickup: false,
                    profileurl: user?.profileUrl,
                    rating: user?.userRating,
                    ready: false,
                    userId: user?.id
                };
                const updatedUsers = [...roomData.users, newUser];
                await getInRoom(roomId, updatedUsers, user.id, navigate);

                console.log("신규 방 입장 완료");
                setRoom(prev => ({ ...prev, users: updatedUsers }));

            } catch (error) {
                console.error("방 입장 처리 중 오류 발생:", error);
                alert("방 입장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                navigate("/mainpage");
            }
        };

        fetchRoomJoin();
    }, [user, roomId, navigate]);

    // 방 유저 목록 및 상태 갱신 (폴링)
    const fetchRoomUsers = async () => {
        try {
            const updatedRoom = await selectAllRoom(roomId);
            if (typeof updatedRoom.users === 'string') {
                updatedRoom.users = JSON.parse(updatedRoom.users);
            }
            const userStillInRoom = updatedRoom.users.some(u => Number(u.userId) === Number(user.id));
            if (!userStillInRoom) {
                navigate("/mainpage");
                return;
            }
            const everyoneReady = updatedRoom.users.every(user => user.ready === true);
            setRoom(prev => ({
                ...prev,
                users: updatedRoom.users,
                ready_people: updatedRoom.ready_people,
                kickId: updatedRoom.kickId
            }));
            setStatus(updatedRoom.status);
            setAllReady(everyoneReady);
            if (updatedRoom.status === '주문 완료') {
                navigate(`/rating/${roomId}`);
            }
        } catch (error) {
            console.error("room 정보 갱신 실패:", error);
        }
    };

    // 채팅 메시지 폴링
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
        console.log("챗로그", chatLog);
        return () => clearInterval(intervalId);
    }, [user, roomId]);

    // 채팅 로그 업데이트 시 스크롤 최하단 이동
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatLog]);

    // 채팅 전송 함수
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

    // 방 정보 불러오기
    useEffect(() => {
        if (!user) return;
        const fetchRoom = async () => {
            try {
                const roomData = await selectAllRoom(roomId);
                if (typeof roomData.users === 'string') {
                    roomData.users = JSON.parse(roomData.users);
                }
                console.log("룸정보", roomData);
                console.log("킥아이디 설정", kickId);
                console.log("스토어아이디", roomData.storeId);
                if (roomData.leaderId === user?.id) {
                    setLeader(true);
                    console.log("나는 리더")
                } else {
                    console.log("나는 일반")
                }
                setRoom(roomData);
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
        }
        fetchRoom();
    }, [user, roomId]);

    // 🔁 준비 상태 폴링: room 전체 정보 주기적으로 받아오기
    useEffect(() => {
        if (!roomId || !pollingReady) {
            console.log("폴링스탑");
            return;
        }
        fetchRoomUsers();
        const intervalId = setInterval(fetchRoomUsers, 2000); // 2초마다 갱신
        return () => clearInterval(intervalId);
    }, [roomId, pollingReady]);

    //준비 취소 및 order delete
    const cancelOrder = async () => {
        if (!orderId) {
            alert("주문id가 없습니다.");
            return;
        }
        try {
            await deleteOrder(orderId);
            console.log("주문 취소!");
            setOrderId(null);
            // 🔁 ready false로 변경
            const updatedUsers = room.users.map(u =>
                Number(u.userId) === Number(user.id) ? { ...u, ready: false } : u
            );
            console.log("업데이트 유저", updatedUsers);
            await axios.put('/api/room/updateReady', {
                id: roomId,
                users: JSON.stringify(updatedUsers),
            });
            await axios.put(`/api/room/${roomId}/readyCount`, null, {
                params: { delta: -1 },
            });

            await fetchRoomUsers(); // 상태 동기화
        } catch (error) {
            console.error("주문 취소 중 오류", error);
        }
    };

    // 준비 완료 버튼 핸들러 (결제 확인 모달을 여는 역할)
    const handleReadyToggle = (userId) => {
        if (cart.length === 0) {
            alert("메뉴를 먼저 선택해주세요.");
            return;
        }
        // 이 함수가 결제 확인 모달을 열도록 설정
        setShowPaymentModal(true);
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
        console.log("메뉴 저장");
    };
    const increaseQuantity = (id) => {
        setCart(prevCart => prevCart.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    }
    const decreaseQuantity = (id) => {
        setCart(prevCart => prevCart
            .map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
            .filter(item => item.quantity > 0)
        );
    };

    // 최종 주문 (방장만 가능)
    const handleFinalOrder = () => {
        const updatedStatus = "주문진행중";
        alert("최종주문하시겠습니까?");
        console.log("올레디", allReady);
        if (allReady) {
            alert("주문 완료!");
            updateRoomStatus(roomId, updatedStatus);
            return;
        } else {
            alert("아직 메뉴를 고르고 있는 참여자가 있습니다.");
            return
        }
    };

    // 픽업 완료
    const pickedUp = async () => {
        alert("픽업버튼");
        if (!roomId) {
            alert("방 ID가 없습니다.");
            return;
        }

        try {
            // 해당 유저의 pickup 값을 true로 변경
            const updatedUsers = room.users.map(u =>
                Number(u.userId) === Number(user.id) ? { ...u, pickup: true } : u
            );

            // DB에 업데이트 (같은 updateReady API 사용)
            await axios.put('/api/room/updateReady', {
                id: roomId,
                users: JSON.stringify(updatedUsers),
            });

            await fetchRoomUsers(); // 상태 동기화
            console.log("픽업 완료!");
        } catch (error) {
            console.error("픽업 처리 중 오류", error);
        }
    };

    // 방 상태 변경 (방장만 가능)
    const changeStatus = async () => {
        if (!room || !room.status) {
            return;
        }
        try {
            alert(`방 상태를 "${status}"에서 변경합니다.`);
            await changeRoomStatus(room.id, status);
            // API 호출 후 방 정보를 다시 불러와서 UI를 갱신
            await fetchRoomUsers();
        } catch (error) {
            console.error("방 상태 변경 중 오류:", error);
            alert("방 상태 변경에 실패했습니다.");
        }
    }

    const report = (chat) => {
        setSelectedChat(chat);
        setShowReportModal(true);
    }
    const kickButton = async (targetUserId) => {
        if (!room || !room.users) return;
        try {
            console.log("강퇴 발생 방", roomId);
            console.log("강퇴할 유저 id", targetUserId);
            const updatedUsers = room.users.filter(u => Number(u.userId) !== Number(targetUserId));
            console.log("강퇴할객체", updatedUsers);
            await axios.put('/api/room/updateKick', {
                id: roomId,
                users: JSON.stringify(updatedUsers),
                kickId: targetUserId,
            });
            console.log("강퇴진행중");
            await axios.delete('/api/roomJoin/deleteRoomJoin', {
                data: {
                    roomId: roomId,
                    usersId: targetUserId,
                }
            });
            setKickId(targetUserId);
            alert("강퇴 완료");
            await fetchRoomUsers(); // 상태 갱신
        } catch (error) {
            console.error("강퇴 처리 중 오류:", error);
        }
    };
    useEffect(() => {
        if (!user || !room) {
            return;
        }
        if (room.kickId && Number(room.kickId) === Number(user.id)) {
            alert("강퇴되었습니다.");
            navigate("/mainpage");
        }
    }, [room, user, navigate]);

    return (
        <div className={styles.roomContainer}>
            {/* 왼쪽 영역 */}
            <div className={styles.leftColumn}>
                <div className={styles.titleWrapper}>
                    {/* ← 버튼 */}
                    <button
                        className={styles.leaveButton}
                        onClick={() => handleLeaveRoom({ room, user, roomId, navigate })}
                    >
                        <img
                            className={styles.backIcon}
                            src="http://localhost:8080/image/imgfile/main_img/backbtn.png"
                            alt="뒤로가기"
                        />
                    </button>
                    {/* 가운데 텍스트: 방 제목 + 상태 */}
                    <div className={styles.centerText}>
                        <span className={styles.roomName}>{room?.roomName}</span>
                        <span className={status === "모집중" ? styles.recruitingText : styles.statusText}>
                            {status}
                        </span>
                    </div>
                    {/* 주소 */}
                    <div className={styles.address}>{room?.roomAddress}</div>
                </div>
                {/* 참여 유저 */}
                <div className={styles.memberWrapper}>
                    <div className={styles.sectionTitle}>참여 유저</div>
                    <div className={styles.scrollContainer}>
                        <ul className={styles.memberList}>
                            {room?.users?.length > 0 ? (
                                room.users.map((member, idx) => {
                                    const isLeader = room?.leaderId && member.userId.toString() === room.leaderId.toString();
                                    let statusMessage = "";
                                    if (member.ready && member.pickup) {
                                        statusMessage = "픽업완료";
                                    } else if (member.ready && !member.pickup) {
                                        statusMessage = "준비완료";
                                    }
                                    return (
                                        <div key={idx} className={styles.memberItem}>
                                            <img
                                                src={member.profileurl ? `http://localhost:8080${member.profileurl}` : basic_profile}
                                                alt={member.nickname}
                                                className={styles.memberProfile}
                                            />
                                            <div className={styles.userInfoWrapper}>
                                                <p className={styles.memberNickname}>{member.nickname}</p>
                                                <img
                                                    className={styles.bearImage}
                                                    src={
                                                        member.rating >= 80
                                                            ? "http://localhost:8080/image/imgfile/main_img/good.png"
                                                            : member.rating < 30
                                                                ? "http://localhost:8080/image/imgfile/main_img/bad.png"
                                                                : "http://localhost:8080/image/imgfile/main_img/soso.png"
                                                    }
                                                    alt="곰등급"
                                                />
                                                {isLeader && (
                                                    <span className={styles.leaderTag}>방장</span>
                                                )}
                                            </div>
                                            <div className={styles.readyContainer}>
                                                <p className={statusMessage ? styles.readyDone : styles.readyNotDone}>
                                                    {statusMessage}
                                                </p>
                                            </div>
                                            {isLeader && (
                                                <div className={styles.leaderActions}>
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
                                                    <button className={styles.statusButton} onClick={changeStatus}>
                                                        {status === "모집중" ? "모집마감" : "모집중"}
                                                    </button>
                                                </div>
                                            )}
                                            {!isLeader && leader && (
                                                <button className={styles.kickButton} onClick={() => kickButton(member.userId)}>강퇴</button>
                                            )}
                                        </div>
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
                    <div className={styles.chatHeader}>
                        <p className={styles.sectionTitle}>채팅</p>
                        <img
                            className={styles.chatIcon}
                            src="http://localhost:8080/image/imgfile/main_img/chatemoji.png"
                        />
                    </div>
                    <div className={styles.chatBody} ref={chatBodyRef}>
                        {chatLog.map((chat, idx) => (
                            <div key={idx} className={styles.chatMessage}>
                                <img src={chat.profileUrl ? `http://localhost:8080${chat.profileUrl}` : basic_profile} alt={chat.nickname} />
                                <div className={styles.chatContentLeft}>
                                    <div className={styles.nickname}>{chat.nickname}</div>
                                    <div className={styles.chatText}>{chat.chat}</div>
                                </div>
                                <div className={styles.chatRightSection}>
                                    <span>{new Date(chat.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                    <button
                                        className={styles.reportButton}
                                        onClick={() => report(chat)}>
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
                        <button className={styles.chatInputButton} onClick={handleSendMessage}>입력</button>
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
                                <button className={styles.addToCartBtn} onClick={() => addToCart(menu)}><img
                                    className={styles.circle_pencil}
                                    src="http://localhost:8080/image/imgfile/main_img/cart.png"
                                /></button>
                            </div>
                        ))
                    ) : (
                        <p>메뉴가 없습니다.</p>
                    )}
                </div>
                <div className={styles.cartWrapper}>
                    <div className={styles.cartTitle}>
                        담은메뉴
                    </div>
                    {cart.length > 0 ? (
                        cart.map(item => (
                            <div key={item.id} className={styles.cartItem}>
                                <span className={styles.itemName}>{item.menuName}</span>
                                <span>{item.menuPrice.toLocaleString()}원</span>
                                <div className={styles.quantityControls}>
                                    <button className={styles.quantityButtons} onClick={() => decreaseQuantity(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button className={styles.quantityButtons} onClick={() => increaseQuantity(item.id)}>+</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>선택한 메뉴가 없습니다.</p>
                    )}
                </div>
                <div>
                    <p>총 금액: {totalPrice.toLocaleString()}원</p>
                </div>
                <div className={styles.fixedButtonWrapper}>
                    {status !== "모집중" ? (
                        <button className={styles.readyButton} onClick={pickedUp}>픽업완료</button>
                    ) : (
                        room?.users?.find(u => Number(u.userId) === Number(user.id))?.ready ? (
                            <button className={styles.readyButton} onClick={cancelOrder}>준비취소</button>
                        ) : (
                            <button className={styles.readyButton} onClick={() => handleReadyToggle(user.id)}>준비완료</button>
                        )
                    )}
                </div>
            </div>

            {/* 주문 확인 모달 */}
            <OrderConfirmModal
                user={user}
                visible={showPaymentModal}
                cart={cart}
                totalPrice={totalPrice}
                userId={user?.id}
                room={room}
                roomId={roomId}
                onSetOrderId={setOrderId}
                onRefreshRoomUsers={fetchRoomUsers}
                onClose={() => setShowPaymentModal(false)}
                // 결제 확인 모달이 완료되면, 주문 완료 모달을 띄우도록 설정
                onComplete={() => {
                setShowPaymentModal(false);
                setShowOrderCompleteModal(true);
                }}

            />

            {/* 주문 완료 모달 */}
            <OrderCompleteModal
                visible={showOrderCompleteModal}
                onClose={() => setShowOrderCompleteModal(false)}
                cart={cart}
                totalPrice={totalPrice}
                room={room}
                user={user}
            />

            {/* 신고 모달 */}
            <ReportModal
                visible={showReportModal}
                onClose={() => setShowReportModal(false)}
                chat={selectedChat}
                user={user}
            />
        </div>
    );
}