import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MyPage from './pages/myPage/MyPage';
import UserInfo from './pages/myPage/UserInfo';
import EditUser from './pages/myPage/EditUser';
import MyQna from './pages/myPage/MyQna';

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
         <Route path="/mypage" element={<MyPage />}>
          <Route index element={<UserInfo />} />
          <Route path="userinfo" element={<UserInfo />} />
          <Route path="edituser" element={<EditUser />} />
          <Route path="myqna" element={<MyQna />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
