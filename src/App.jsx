import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MyPage from './pages/myPage/MyPage';
import UserInfo from './pages/myPage/UserINfo';
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/mypage" element={<MyPage />} />
            <Route index element={<UserInfo />} />
          <Route path="userinfo" element={<UserInfo />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
