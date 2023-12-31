import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBackendurlStore } from '../../store/backendUrlStore';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './login.css'; // 導入CSS

const Login = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const { isLogin, setIsLogin } = useIsLoginStore();
  const { backendurl } = useBackendurlStore();


  const navigate = useNavigate();
  const handleSubmit = (e) => {
    // 簡單的登入邏輯，要視實際情況
    e.preventDefault()
    const user = { account, password };
    fetch(`${backendurl}/auth/login`, {
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
      <h2 style={{ marginLeft:'8%' ,marginTop:'115px'}}>會員登入</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className='loginContainer' style={{marginRight:'130%'}}>
          <div>
            <b>帳號</b>
            <input style={{marginBottom:'25px'}} type="text" value={account} onChange={(e) => setAccount(e.target.value)} />
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

