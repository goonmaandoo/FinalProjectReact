import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import MyPage from './pages/myPage/MyPage';
import UserInfo from './pages/myPage/UserINfo';
import MainPage from './pages/MainPage';
import MainHeader from './components/header/MainHeader';
import Header from './components/header/Header'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error(err));
  }, []);
  const location = useLocation();
  const isMainPage = location.pathname === "/mainpage";

  return (
    <div>
      {isMainPage ? (
        <MainHeader/>
      ) : (
        <Header/>
      )}
      <div>{message}</div>
        <Routes>
          <Route path="/" element={<Navigate to="/mainpage" replace />} />
          <Route path="/mainpage" element={<MainPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/userinfo" element={<UserInfo />}gi />
        </Routes>
    </div>
  );
}

export default App;