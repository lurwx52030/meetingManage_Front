import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Personal.css'; // 導入CSS

const Personal = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const userid = localStorage.getItem('userid')


  const navigate = useNavigate();
  const location = useLocation()


  useEffect(() => {
    axios.get(
      `http://localhost:5000/user/${userid}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      }).then((res) => {
        if (res.data.status === 200) {
          let data = res.data.data
          console.log(data)
          setAccount(data.account)
        }
      })
  }, [])


  const handlechange = (e) => {
    e.preventDefault();

    const data = {
      account,
      password
    }
  
    axios.put(
      `http://localhost:5000/user/account/${userid}`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then((res) => {
        alert(`${userid}帳密更改成功！\n請重新登入`)
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('userid')
        navigate("/login");
      })
      .catch((error) => {
        console.log(error)
      });
  }



  return (
    <div className="personal-container">
      <h2>個人資料</h2>
      <form className="form-container" onSubmit={handlechange}>
        <div className='row-personal'>
          <div>
            <label><b>帳號</b></label><br></br>
            <input type="text" value={account} onChange={(e) => setAccount(e.target.value)} />
          </div>
        </div>
        <div className='row-personal'>
          <div>
            <label><b>密碼</b></label><br></br>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        <div className='personal-buttons'>
          <button type="submit"><b>更改</b></button>
        </div>
      </form>
    </div>
  );
};

export default Personal;

