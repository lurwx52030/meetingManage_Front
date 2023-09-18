import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sign.css'; // 導入CSS

const Sign = () => {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [Password2, setPassword2] = useState('');
  const navigate=useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    // 簡單的登入邏輯，要視實際情況
    let user = { name, account, id, password };
    if (password === Password2) {
      fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
      })
        .then(res => res.json())
        .then(res => {
          alert('註冊成功！')
          navigate('/login')
        })
    } else {
      alert("兩次密碼不一致！")
    }
  };

  return (
    <div className="sign-container">
      <h2>註冊會員</h2>
      <form className="signform-container" onSubmit={handleSubmit}>
        <div className='row1'>
          <div>
            <label><b>姓名</b></label><br></br>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label><b>密碼</b></label><br></br>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        <div className='row1'>
          <div>
            <label><b>帳號</b></label><br></br>
            <input type="text" value={account} onChange={(e) => setAccount(e.target.value)} />
          </div>
          <div>
            <label><b>確認密碼</b></label><br></br>
            <input type="password" value={Password2} onChange={(e) => setPassword2(e.target.value)} />
          </div>
        </div>

        <div className='row1'>
          <div>
            <label><b>員工編號</b></label><br></br>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
        </div>

        <div className='button'>
          <input type="submit" value="註冊" />
        </div>

      </form>
    </div>
  );
};

export default Sign;

