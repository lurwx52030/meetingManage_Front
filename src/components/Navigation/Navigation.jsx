import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './Navigation.css';

const Navigation = () => {
  const { isLogin, setIsLogin } = useIsLoginStore();


  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/"><b>HOME</b></Link></li>
        <li className="submenu">
          <b className="underline"><u>會議管理</u></b>
          <ul className="dropdown-menu">
            <li><Link to="/Createmeeting">建立會議</Link></li>
            <li><Link to="/meeting">會議清單</Link></li>
          </ul>
        </li>
        <li><Link to="/meetingRoom"><b><u>會議室</u></b></Link></li>
        <li><Link to="/People"><b><u>人員管理</u></b></Link></li>
        <li className='user'>
          {
            (isLogin) ? (
              <UserDropDown />
            ) : (
              <Link className='login' to="/login">login</Link>
            )
          }
        </li>
      </ul>
    </nav>
  );
};

const UserDropDown = () => {
  const { isLogin, setIsLogin } = useIsLoginStore();
  const navigate = useNavigate()

  const options = [
    { key: 'edit', icon: 'edit', text: 'Edit Post', value: 'edit' },
    { key: 'delete', icon: 'delete', text: 'Remove Post', value: 'delete' },
    { key: 'hide', icon: 'hide', text: 'Hide Post', value: 'hide' },
  ]

  const LogoutHandler = () => {
    localStorage.removeItem('jwtToken');
    setIsLogin(false)
    navigate('/')
  }

  return (
    <Dropdown icon='user'>
      <Dropdown.Menu direction='left'>
        <Dropdown.Item
          icon='address card'
          onClick={() => {
            navigate('/personal',{state:{id:localStorage.getItem('userid')}})
          }}
          text='Profile'
        />
        <Dropdown.Item
          icon='sign out'
          text='Logout'
          onClick={() => LogoutHandler()}
        />
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Navigation;

