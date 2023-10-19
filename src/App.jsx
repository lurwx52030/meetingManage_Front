import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navigation from './components/navigation/navigation';
import Attendance from './pages/attendance';
import Createmeeting from './pages/createMeeting/createMeeting';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Meeting from './pages/meeting/meeting';
import MeetingFile from './pages/meetingFile/meetingFile';
import MeetingMember from './pages/meetingMember/meetingMember';
import People from './pages/people/people';
import Personal from './pages/personal/personal';
import MeetingRoom from './pages/room/room';
import RoomDetails from './pages/roomDetails/roomDetails';
import Sign from './pages/sign/sign';
import UpdateMeeting from './pages/updateMeeting/updateMeeting';
import Updateuser from './pages/updateUser/updateUser';



const App = () => {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Sign" element={<Sign />} />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/Createmeeting" element={<Createmeeting />} />
          <Route path='/editMeeting' element={<UpdateMeeting />} />
          <Route path='/file' element={<MeetingFile />} />
          <Route path='/member' element={<MeetingMember />} />
          <Route path='/attendance' element={<Attendance />} />
          <Route path="/meetingRoom" element={<MeetingRoom />} />
          <Route path='/roomDetails' element={<RoomDetails />} />
          <Route path="/People" element={<People />} />
          <Route path='/editUser' element={<Updateuser />} />
          <Route path='/personal' element={<Personal />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;





