import React, { useEffect } from 'react';
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
import { useBackendurlStore } from './store/backendUrlStore';



const App = () => {

  // awake backend
  const { backendurl } = useBackendurlStore();

  let root = '';
  useEffect(() => { console.log(import.meta.env) }, []);

  if (import.meta.env.MODE === 'development') {
    root = '';
  } else {
    root = 'meetingManage_Front';
  }


  useEffect(() => {
    fetch(`${backendurl}/a`)
      .then((res) => res.json())
      .then(res => console.log('backend awake！'))
  })

  return (
    <Router basename={root}>
      <div style={{ width: '100%', height: '100%' }}>
        <Navigation />
        <div style={{ width: '100%', height: '80%' }}>
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
      </div>
    </Router>
  );
};

export default App;





