import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MyPage from './pages/myPage/MyPage';
import UserInfo from './pages/myPage/UserINfo';
import RegisterCheck from "./pages/RegisterCheck";
import OwnerRegister from "./pages/OwnerRegister";
import UserRegister from "./pages/UserRegister";
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/mypage" element={<MyPage />} />
          <Route index element={<UserInfo />} />
          <Route path="userinfo" element={<UserInfo />} />
          <Route path="/ownerusercheck" element={<RegisterCheck />} />
          <Route path="/ownerregister" element={<OwnerRegister />} />
          <Route path="/userregister" element={<UserRegister />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
