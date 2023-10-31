import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './personal.css'; // 導入CSS

const Personal = () => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const userid = localStorage.getItem('userid')


  const navigate = useNavigate();
  const location = useLocation();

  const { isLogin, setIsLogin } = useIsLoginStore();


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
          setAccount(data.account)
        }
      }).catch(err => {
        console.log(err.response)
        switch (err.response.status) {
          case 401:
            alert("請重新登入！")
            localStorage.removeItem("jwtToken")
            localStorage.removeItem('userid')
            setIsLogin(false)
            navigate('/')
            break;
          default:
            alert(err.response.data.message)
            break;
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
    <form onSubmit={handlechange}>
      <div className="personalProfile">
        <h2 style={{ width: "30%", height: "20%" }}>個人資料</h2>
        <div style={{ width: "30%", height: "80%" }}>
          <div className='createmeeting_row'>
            <div>
              <label><b>帳號</b></label><br></br>
              <input type="text" value={account || ''} onChange={(e) => setAccount(e.target.value)} />
            </div>
          </div>
          <div className='createmeeting_row'>
            <div>
              <label><b>密碼</b></label><br></br>
              <input type="password" value={password || ''} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className='createmeeting_row'>
            <button className="meetingb" type="submit"><b>更改</b></button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Personal;

