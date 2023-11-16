import React from 'react';
import './home.css';


const Home = () => {
  return (
    <div className="home">
      <div className='background1'>
      </div>
      <div className='background'>
          <h1 style={{zIndex: '-1'}}>會議管理系統</h1>
          <h2 style={{zIndex: '-1'}}>即時發送會議通知 一鍵簽到</h2>
      </div>
    </div>
  );
};

export default Home;
