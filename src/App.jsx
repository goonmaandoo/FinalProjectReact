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
import Login from "./pages/loginPage/Login";
import RegisterCheck from "./pages/loginPage/RegisterCheck";
import OwnerRegister from "./pages/loginPage/OwnerRegister";
import UserRegister from "./pages/loginPage/UserRegister";
import AllRoom from './pages/roomPage/AllRoom';

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
          <Route path="/login" element={<Login />} />
          <Route path="/ownerusercheck" element={<RegisterCheck />} />
          <Route path="/ownerregister" element={<OwnerRegister />} />
          <Route path="/userregister" element={<UserRegister />} />
        </Routes>
    </div>
  );
}

export default App;