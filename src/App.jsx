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



function App() {

  const location = useLocation();
  const isMainPage = location.pathname === "/mainpage";

  return (
    <div>
      {isMainPage ? (
        <MainHeader/>
      ) : (
        <Header/>
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

          <Route path="/login" element={<Login />} />
          <Route path="/ownerusercheck" element={<RegisterCheck />} />
          <Route path="/ownerregister" element={<OwnerRegister />} />
          <Route path="/userregister" element={<UserRegister />} />

          
          <Route path="*" element={<Error404Page/>} />
        </Routes>
        <Footer/>
    </div>
  );
}

export default App;