import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import MyPage from './pages/myPage/MyPage';
import EditUser from './pages/myPage/EditUser';
import MyQna from './pages/myPage/MyQna';
import UserInfo from './pages/myPage/UserInfo';
import MainPage from './pages/MainPage';
import MainHeader from './components/header/MainHeader';
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Login from "./pages/loginPage/Login";
import RegisterCheck from "./pages/loginPage/RegisterCheck";
import OwnerRegister from "./pages/loginPage/OwnerRegister";
import UserRegister from "./pages/loginPage/UserRegister";
import StoreListPage from "./pages/storePage/StoreListPage";
import StoreDetail from "./pages/storePage/StoreDetail";
import AllRoom from './pages/roomPage/AllRoom';
import Error404Page from './pages/Error404Page';
import LoginCheck from './components/user/loginCheck';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/user';
import axios from 'axios';
import MoaPolicy1 from './pages/footerPage/MoaPolicy1';
import MoaPolicy2 from './pages/footerPage/MoaPolicy2';
import MoaPolicy3 from './pages/footerPage/MoaPolicy3';
import MoaPolicy4 from './pages/footerPage/MoaPolicy4';
import SafetyGuide from './pages/footerPage/SafetyGuide';
import RoomCreate from './pages/roomPage/RoomCreate';

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload); // Base64 디코딩
    return JSON.parse(decodedPayload);
  } catch (e) {
    console.error('토큰 파싱 실패', e);
    return null;
  }
}

function App() {
  const location = useLocation();
  const isMainPage = location.pathname === "/mainpage";
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (!decoded) return;

      const email = decoded.sub;

      axios.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        const user = res.data;
        dispatch(loginSuccess(user, token));
      })
      .catch(err => {
        console.error("유저 정보 불러오기 실패", err);
        localStorage.removeItem("token");
      });
    }
  }, []);

  return (
    <div>
      {isMainPage ? (
        <MainHeader />
      ) : (
        <Header />
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/mainpage" replace />} />
        <Route path="/mainpage" element={<MainPage />} />

        <Route path="/roomPage/AllRoom" element={<AllRoom />} />
        <Route path="/mypage" element={<MyPage />}>
          <Route index element={<UserInfo />} />
          <Route path="userinfo" element={<UserInfo />} />
          <Route path="edituser" element={<EditUser />} />
          <Route path="myqna" element={<MyQna />} />
        </Route>

        <Route path="/storelist" element={<StoreListPage />} />
        <Route path="/store/:store_id" element={<StoreDetail />} />

        <Route path="/roomcreate" element={<RoomCreate/>} />

        <Route path="/login" element={<Login />} />
        <Route path="/ownerusercheck" element={<RegisterCheck />} />
        <Route path="/ownerregister" element={<OwnerRegister />} />
        <Route path="/userregister" element={<UserRegister />} />


        <Route path="/moapolicy1" element={<MoaPolicy1/>}/>
        <Route path="/moapolicy2" element={<MoaPolicy2/>}/>
        <Route path="/moapolicy3" element={<MoaPolicy3/>}/>
        <Route path="/moapolicy4" element={<MoaPolicy4/>}/>
        <Route path="safetyguide" element={<SafetyGuide/>}/>
        <Route path="*" element={<Error404Page />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
