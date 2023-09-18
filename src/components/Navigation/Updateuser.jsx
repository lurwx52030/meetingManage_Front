import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './Updateuser.css'; // 導入CSS


const Updateuser = () => {

  // const { id, name, account } = useParams();
  const [id, setId] = useState('');
  const [uname, setUname] = useState('');
  const [uaccount, setUaccount] = useState('');
  const navigate = useNavigate();
  const location = useLocation()


  //修改使用者資料(未完成)
  const submitActionHandler = (e) => {
    e.preventDefault();
    axios.get(
      `http://localhost:5000/user/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
      .then(res => {
        let user = res.data.data
        console.log(user)
        axios.put(
          `http://localhost:5000/user/${user.id}`,
          {
            name: uname,
            account: uaccount
          },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
          })
          .then((res) => {
            alert("使用者 " + id + " 更新成功!")
            navigate("/People");
          })
          .catch((error) => {
            alert("更新用戶 " + id + " 時出現錯誤：" + error)
          });
      })
      .catch(err => {
        console.log(err)
      });
  };


  useEffect(() => {
    setId(location.state.id)
    setUaccount(location.state.account)
    setUname(location.state.name)
  }, []);

  return (
    <div className="update-container">
      <h2>修改資料</h2>
      <form className="updateform-container" onSubmit={submitActionHandler}>
        <div className='row'>
          <div>
            <label><b>員工編號</b></label><br></br>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
        </div>
        <div className='row'>
          <div>
            <label><b>帳號</b></label><br></br>
            <input type="text" value={uaccount} onChange={(e) => setUaccount(e.target.value)} />
          </div>
        </div>
        <div className='row'>
          <div>
            <label><b>姓名</b></label><br></br>
            <input type="text" value={uname} onChange={(e) => setUname(e.target.value)} />
          </div>
        </div>
        <div className='buttons'>
          <button type="submit">確認</button>
          <button onClick={() => navigate('/People')}>取消</button>
        </div>
      </form>
    </div>
  );
};

export default Updateuser


