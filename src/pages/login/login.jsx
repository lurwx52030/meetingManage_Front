import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './login.css'; // 導入CSS

const Login = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const { isLogin, setIsLogin } = useIsLoginStore()

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    // 簡單的登入邏輯，要視實際情況
    e.preventDefault()
    const user = { account, password };
    fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res)
        switch (res.status) {
          case 200:
            //save token
            window.localStorage.setItem("jwtToken", res["access_token"])
            window.localStorage.setItem("userid", res["id"])

            setIsLogin(true);
            console.log(isLogin);
            navigate('/');
            break;
          default:
            return Promise.reject(res);
        }
      })
      .catch(e => {
        alert(e.message)
      })
  };

  return (
    <div className="root-container ">
      <h2>會員登入</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className='loginContainer'>
          <div>
            <b>帳號</b>
            <input type="text" value={account} onChange={(e) => setAccount(e.target.value)} />
          </div>
          <div>
            <b>密碼</b>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className='buttons'>
            <input type="submit" value="登入" />
            <button onClick={() => navigate('/Sign')} >註冊會員</button>
            {/* <button type="sign" onClick={() => navigate('/Sign')}><b>註冊會員</b></button> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;

