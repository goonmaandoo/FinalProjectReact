import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyPage from './pages/myPage/MyPage';
import UserInfo from './pages/myPage/UserINfo';
import Login from "./pages/loginPage/Login";
import RegisterCheck from "./pages/loginPage/RegisterCheck";
import OwnerRegister from "./pages/loginPage/OwnerRegister";
import UserRegister from "./pages/loginPage/UserRegister";

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <div>{message}</div>
      <BrowserRouter>
        <Routes>
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/userinfo" element={<UserInfo />}gi />
          <Route path="/login" element={<Login />} />
          <Route path="/ownerusercheck" element={<RegisterCheck />} />
          <Route path="/ownerregister" element={<OwnerRegister />} />
          <Route path="/userregister" element={<UserRegister />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;