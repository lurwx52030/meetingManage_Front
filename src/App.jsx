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
import MeetingFile from './components/Navigation/meetingFile';
import MeetingMember from './components/Navigation/meetingMember';
import UpdateMeeting from './components/Navigation/updatemeeting';
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
        <Route path='/editUser' element={<Updateuser />} />
        <Route path='/editMeeting' element={<UpdateMeeting />} />
        <Route path='/personal' element={<Personal />} />
        <Route path='/member' element={<MeetingMember />} />
        <Route path='/file' element={<MeetingFile />} />
      </Routes>
    </Router>
  );
};

export default App;





