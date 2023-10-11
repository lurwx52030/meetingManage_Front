import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navigation from './components/navigation/navigation';
import Createmeeting from './pages/createMeeting/createMeeting';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Meeting from './pages/meeting/meeting';
import MeetingFile from './pages/meetingFile/meetingFile';
import MeetingMember from './pages/meetingMember/meetingMember';
import People from './pages/people/people';
import Personal from './pages/personal/personal';
import MeetingRoom from './pages/room/room';
import Sign from './pages/sign/sign';
import UpdateMeeting from './pages/updateMeeting/updateMeeting';
import Updateuser from './pages/updateUser/updateUser';



const App = () => {
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





