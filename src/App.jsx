import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./redux/user";
import axios from "axios";

import MyPage from "./pages/myPage/MyPage";
import CashCharge from "./pages/cash/CashCharge";
import EditUser from "./pages/myPage/EditUser";
import MyQna from "./pages/myPage/MyQna";
import UserInfo from "./pages/myPage/UserInfo";
import MainPage from "./pages/MainPage";
import MainHeader from "./components/header/MainHeader";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Login from "./pages/loginPage/Login";
import RegisterCheck from "./pages/loginPage/RegisterCheck";
import OwnerRegister from "./pages/loginPage/OwnerRegister";
import UserRegister from "./pages/loginPage/UserRegister";
import StoreListPage from "./pages/storePage/StoreListPage";
import StoreDetail from "./pages/storePage/StoreDetail";
import SelectRoom from "./pages/storePage/SelectedRoom";
import OrderComplete from "./pages/orders/OrderComplete";
import GonguComplete from "./pages/roomPage/GonguComplete";
import StarRating from "./pages/roomPage/StarRating";
import RoomCreate from "./pages/roomPage/RoomCreate";
import AllRoom from "./pages/roomPage/AllRoom";
import SearchPage from "./pages/SearchPage";
import Error404Page from "./pages/Error404Page";
import LoginCheck from "./components/user/loginCheck";
import MoaPolicy1 from "./pages/footerPage/MoaPolicy1";
import MoaPolicy2 from "./pages/footerPage/MoaPolicy2";
import MoaPolicy3 from "./pages/footerPage/MoaPolicy3";
import MoaPolicy4 from "./pages/footerPage/MoaPolicy4";
import SafetyGuide from "./pages/footerPage/SafetyGuide";
import Hamburger from "./components/Hamburger";
import PasswordCheck from "./pages/myPage/PasswordCheck";
import AuthQna from "./pages/Auth/AuthQna";
import MyReview from "./pages/myPage/MyReview";
import RoomTest from "./pages/testRoom/RoomTest";

import OrderList from "./pages/myPage/OrderList";
import ForgotPassword from "./pages/loginPage/ForgotPassword";
import OwnerDashboard from "./pages/ownerPage/OwnerDashboard";
import StoreRegister from "./pages/ownerPage/StoreRegister";
import OwnerMenuEdit from "./pages/ownerPage/OwnerMenuEdit";
import DeliveryState from "./pages/ownerPage/DeliveryState";
import ReviewManagement from "./pages/ownerPage/ReviewManagement";
import OrderYesNo from "./pages/ownerPage/OrderYesNo";
import AdminPage from "./pages/Admin/AdminPage";
import Dashboard from "./pages/Admin/Dashboard";
import StoreManagement from "./pages/Admin/StoreManagement";
import UserManagement from "./pages/Admin/UserManagement";
import Active from "./pages/Admin/ActiveManagement";
import OwnerStoreList from "./pages/ownerPage/OwnerStoreList";
import OwnerPage from "./pages/ownerPage/OwnerPage";
import OrderManagement from "./pages/Admin/OrderManagement";
import ReviewAdmin from "./pages/Admin/ReviewAdmin";
import ReportManagement from "./pages/Admin/ReportManagement";
import RoomManagement from "./pages/Admin/RoomManagement";
import UpdateStatus from "./pages/Admin/UpdateStatus";

function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (e) {
    console.error("토큰 파싱 실패", e);
    return null;
  }
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const isMainPage = location.pathname === "/mainpage";
  const isOwnerPage = location.pathname === "/ownerpage";
  const isAdminPage = location.pathname === "/adminpage";
  const isUpdatePage = location.pathname === "/updatestatus";
  const showHeader = !isAdminPage && !isOwnerPage && !isUpdatePage;

  // 로그인 상태 유지 및 유저 정보 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (!decoded) return;

      axios
        .get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const user = res.data;
          dispatch(loginSuccess(user, token));
        })
        .catch((err) => {
          console.error("유저 정보 불러오기 실패", err);
          dispatch(logout());
        });
    }
  }, [dispatch]);

  // 1시간 후 자동 로그아웃 타이머 설정
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const decoded = parseJwt(token);
    if (!decoded?.exp) return;

    const now = Date.now();
    const expiry = decoded.exp * 1000;
    const remainingTime = expiry - now;

    if (remainingTime <= 0) {
      dispatch(logout());
      alert("로그인 시간이 만료되어 자동으로 로그아웃되었습니다.");
      navigate("/mainpage");
      return;
    }

    const timeout = setTimeout(() => {
      dispatch(logout());
      alert("1시간이 지나 자동으로 로그아웃되었습니다.");
      navigate("/mainpage");
    }, remainingTime);

    return () => clearTimeout(timeout);
  }, [dispatch, navigate]);

  const toggleMenu = (e) => {
    e?.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {showHeader &&
        (isMainPage ? (
          <MainHeader toggleMenu={toggleMenu} />
        ) : (
          <Header toggleMenu={toggleMenu} />
        ))}

      <Routes>
        <Route path="/" element={<Navigate to="/mainpage" replace />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/roomPage/AllRoom" element={<AllRoom />} />
        <Route
          path="/room/create/:storeId"
          element={
            <LoginCheck>
              <RoomCreate />
            </LoginCheck>
          }
        />
        <Route path="/ordercomplete/:orderId" element={<OrderComplete />} />
        <Route path="/gongucomplete/:roomId" element={<GonguComplete />} />
        <Route path="/rating/:room_id" element={<StarRating />} />
        <Route
          path="/mypage"
          element={
            <LoginCheck>
              <MyPage />
            </LoginCheck>
          }
        >
          <Route index element={<UserInfo />} />
          <Route path="userinfo" element={<UserInfo />} />
          <Route path="edituser" element={<EditUser />} />
          <Route path="passwordcheck" element={<PasswordCheck />} />
          <Route path="myqna" element={<MyQna />} />
          <Route path="orderlist" element={<OrderList />} />
          <Route path="myreview" element={<MyReview />} />
        </Route>

        <Route path="/cash/cashcharge" element={<CashCharge />} />
        <Route path="/room/:room_id" element={<RoomTest />} />

        <Route path="/storelist/:categoryId" element={<StoreListPage />} />
        <Route path="/store/:storeId" element={<StoreDetail />} />
        <Route path="/selectroom/:storeId" element={<SelectRoom />} />
        <Route
          path="/roomcreate"
          element={
            <LoginCheck>
              <RoomCreate />
            </LoginCheck>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/ownerusercheck" element={<RegisterCheck />} />
        <Route path="/ownerregister" element={<OwnerRegister />} />
        <Route path="/userregister" element={<UserRegister />} />
        <Route path="/forgotpw" element={<ForgotPassword />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/auth/qna" element={<AuthQna />} />
        <Route path="/moapolicy1" element={<MoaPolicy1 />} />
        <Route path="/moapolicy2" element={<MoaPolicy2 />} />
        <Route path="/moapolicy3" element={<MoaPolicy3 />} />
        <Route path="/moapolicy4" element={<MoaPolicy4 />} />
        <Route path="/safetyguide" element={<SafetyGuide />} />
        <Route path="*" element={<Error404Page />} />
        <Route path="/ownerdashboard" element={<OwnerDashboard />} />
        <Route path="/storeregister" element={<StoreRegister />} />
        <Route path="/ownerstorelist" element={<OwnerStoreList />} />
        <Route path="/ownermenuedit" element={<OwnerMenuEdit />} />
        <Route path="/deliverystate" element={<DeliveryState />} />
        <Route path="/reviewmanagement" element={<ReviewManagement />} />
        <Route path="/orderyesno" element={<OrderYesNo />} />

        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/ownerpage" element={<OwnerPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/storeManagement" element={<StoreManagement />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/active" element={<Active />} />
        <Route path="/ordermanagement" element={<OrderManagement />} />
        <Route path="/reviewadmin" element={<ReviewAdmin />} />
        <Route path="/reportmanagement" element={<ReportManagement />} />
        <Route path="/roommanagement" element={<RoomManagement />} />
        <Route path="/updatestatus" element={<UpdateStatus />} />
      </Routes>

      {isOpen && <Hamburger isOpen={isOpen} onClose={() => setIsOpen(false)} />}
      {showHeader && <Footer />}
    </div>
  );
}

export default App;
