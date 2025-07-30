import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyPage from './pages/myPage/MyPage';
import UserInfo from './pages/myPage/UserINfo';

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
          <Route path="/mypage/userinfo" element={<UserInfo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
햣