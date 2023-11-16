import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBackendurlStore } from '../../store/backendUrlStore';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './updatemeeting.css'; // 導入CSS

// yyyy-MM-ddThh:mm
// reference -> https://stackoverflow.com/questions/30166338/setting-value-of-datetime-local-from-date
Date.prototype.toDatetimeLocalString = function () {
    // return new Date(this.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 19)
    this.setMinutes(this.getMinutes() - this.getTimezoneOffset())
    return this.toISOString().slice(0, 16)
}


const UpdateMeeting = () => {
    const [name, setname] = useState('');
    const [start, setstart] = useState('');
    const [end, setend] = useState('');
    const [meetingRoomId, setmeetingRoomId] = useState('');
    const [creatorId, setcreatorId] = useState('');
    const [notificationTime, setNotificationTime] = useState(0);

    const { isLogin, setIsLogin } = useIsLoginStore();
    const { backendurl } = useBackendurlStore();

    const navigate = useNavigate();
    const location = useLocation();

    //會議通知radio
    const [announcement, setAnnouncement] = useState('');
    const onOptionChange = function (e) {
        console.log(e.target.value)
        setAnnouncement(e.target.value)
    }

    const [meetingRooms, setmeetingRooms] = useState([]);
    useEffect(() => {
        if (location.state.notificationTime && location.state.notificationTime > 0) {
            setAnnouncement('Open')
            setNotificationTime(location.state.notificationTime)
        }

        setname(location.state.name)
        setstart(new Date(location.state.start).toDatetimeLocalString())
        setend(new Date(location.state.end).toDatetimeLocalString())
        setcreatorId(location.state.creatorId)
        setmeetingRoomId(location.state.meetingRoomId)


        fetch(`${backendurl}/meeting-room`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                switch (res.status) {
                    case 200:
                        setmeetingRooms(res.data);
                        break;
                    default:
                        return Promise.reject(res);
                }
            }).catch(error => {
                switch (error.statusCode) {
                    case 401:
                        alert("請重新登入！")
                        localStorage.removeItem("jwtToken")
                        localStorage.removeItem('userid')
                        setIsLogin(false)
                        navigate('/login')
                        break;
                    default:
                        alert(error.message)
                        navigate('/meeting')
                        break;
                }
            })
            .catch(err => {
            })
    }, [])


    useEffect(() => {
        if (announcement === '') {
            return
        }

        if (announcement !== 'Open') {
            setNotificationTime(0)
        }
        console.log(announcement, notificationTime)
    }, [announcement, notificationTime])

    const handleSubmit = (e) => {
        e.preventDefault()
        const create = {
            name,
            start: (new Date(start)).toISOString(),
            end: (new Date(end)).toISOString(),
            meetingRoomId,
            creatorId,
            notificationTime
        };

        fetch(`${backendurl}/meeting/${location.state.id}`, {
            method: 'PUT',
            body: JSON.stringify(create),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                switch (res.status) {
                    case 200:
                        alert('修改會議成功!')
                        navigate('/meeting')
                        break;
                    default:
                        return Promise.reject(res);
                }
            })
            .catch(error => {
                alert(error.message)
            })
    }



    return (
        <form onSubmit={handleSubmit}>
            <div className="createmeeting">
                <h2 style={{ marginRight:'30%', width: "40%", height: "20%" ,marginBottom:'25px'}}>更新會議</h2>
                <div style={{ width: "40%", height: "80%" }}>
                    <div className='createmeeting_row'>
                        <div>
                            <label><b>會議名稱：</b></label>
                            <input style={{ height: '30px'}} type="text" value={name} onChange={(e) => setname(e.target.value)} />
                        </div>
                    </div>
                    <div className='createmeeting_row'>
                        <div className='announcement-container'>
                            <label><b>會議通知：</b></label>
                            <input type="radio" name="announcement" value="Open" id="open" checked={announcement === "Open"} onChange={onOptionChange} />
                            <label htmlFor='open'>開啟</label>
                            <input style={{marginLeft:'15px'}} type="radio" name="announcement" value="Close" id="close" checked={announcement === "Close"} onChange={onOptionChange} />
                            <label htmlFor='close'>關閉</label>
                            {announcement === 'Open' && (
                                <select
                                    style={{marginLeft:'15px'}}
                                    className="custom-select"
                                    id="shopSearchSelect"
                                    value={notificationTime}
                                    onChange={(e) => setNotificationTime(parseInt(e.target.value))}
                                >
                                    <option value="0">請選擇時間</option>
                                    <option value="5">5分鐘</option>
                                    <option value="10">10分鐘</option>
                                    <option value="15">15分鐘</option>
                                    <option value="30">30分鐘</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div className='createmeeting_row'>
                        <div className='meeting_start_time'>
                            <label><b>會議開始時間：</b></label>
                            <input type="datetime-local" value={start} onChange={(e) => setstart(e.target.value)}

                            />

                        </div>
                    </div>
                    <div className='createmeeting_row'>
                        <div className='meeting_end_time'>
                            <label><b>會議結束時間：</b></label>
                            <input type="datetime-local" value={end} onChange={(e) => setend(e.target.value)} />
                        </div>
                    </div>
                    <div className='createmeeting_row'>
                        <div>
                            <label><b>會議地點：</b></label>
                            <select className="custom-select" id="shopSearchSelect" value={meetingRoomId} onChange={(e) => setmeetingRoomId(e.target.value)}>
                                <option value=''>請選擇會議地點</option>
                                {
                                    meetingRooms.map(meetingRoom => {
                                        return <option key={meetingRoom.id} value={meetingRoom.id}>{meetingRoom.name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className='updatemeeting_row'>
                        <button style={{backgroundColor: 'aliceblue',border: 'none',borderRadius: '5px',color: '#0a0a0a',cursor:'pointer',fontSize:'16px'}} 
                        type="updatemeet"><b>更新</b></button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default UpdateMeeting;





