// // import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         {/* <img src={logo} className="App-logo" alt="logo" /> */}
//         {/* <p> */}
//           {/* Edit <code>src/App.js</code> and save to reload. */}
//         {/* </p> */}
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >

//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// --------------------------------------------------------------------------------------
// import React, { useState } from 'react';
// import MeetingList from './components/MeetingList';
// import CreateMeetingForm from './components/CreateMeetingForm';

// const App = () => {
//   const [meetings, setMeetings] = useState([]);

//   const addMeeting = (meeting) => {
//     setMeetings([...meetings, meeting]);
//   };

//   const deleteMeeting = (id) => {
//     setMeetings(meetings.filter((meeting) => meeting.id !== id));
//   };

//   return (
//     <div>
//       <h1>Meeting Manager</h1>
//       <CreateMeetingForm addMeeting={addMeeting} />
//       <MeetingList meetings={meetings} deleteMeeting={deleteMeeting} />
//     </div>
//   );
// };

// export default App;

import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Meeting from './components/Navigation/Meeting';
import Navigation from './components/Navigation/Navigation';
import People from './components/Navigation/People';
import Personal from './components/Navigation/Personal';
import MeetingRoom from './components/Navigation/Room';
import Sign from './components/Navigation/Sign';
import Updateuser from './components/Navigation/Updateuser';
import Createmeeting from './components/Navigation/createmeeting';
import Home from './components/Navigation/home';
import Login from './components/Navigation/login';
import { useIsLoginStore } from './store/useIsLoginStore';
// import Roomdeatails from './components/Navigation/Roomdeatails'


const App = () => {

  const { isLogin, setIsLogin } = useIsLoginStore()

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Sign" element={<Sign />} />
        <Route path="/Createmeeting" element={<Createmeeting />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/meetingRoom" element={<MeetingRoom />} />
        <Route path="/People" element={<People />} />
        <Route path='/edit' element={<Updateuser />} />
        <Route path='/personal' element={<Personal />} />
      </Routes>
    </Router>
  );
};

export default App;





