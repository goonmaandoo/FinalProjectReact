import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import MyPage from './pages/myPage/MyPage';
import UserInfo from './pages/myPage/UserINfo';
import MainPage from './pages/MainPage';
import MainHeader from './components/header/MainHeader';
import Header from './components/header/Header'
import Login from "./pages/loginPage/Login";
import RegisterCheck from "./pages/loginPage/RegisterCheck";
import OwnerRegister from "./pages/loginPage/OwnerRegister";
import UserRegister from "./pages/loginPage/UserRegister";

function App() {
  const [message, setMessage] = useState('');

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
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/userinfo" element={<UserInfo />}gi />
          <Route path="/login" element={<Login />} />
          <Route path="/ownerusercheck" element={<RegisterCheck />} />
          <Route path="/ownerregister" element={<OwnerRegister />} />
          <Route path="/userregister" element={<UserRegister />} />
        </Routes>
    </div>
  );
}

export default App;