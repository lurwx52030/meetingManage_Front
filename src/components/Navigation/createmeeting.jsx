import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './createmeeting.css'; // 導入CSS



const CreateMeeting = () => {
    const [name, setname] = useState('');
    const [start, setstart] = useState('');
    const [end, setend] = useState('');
    const [meetingRoomId, setmeetingRoomId] = useState('');
    const [creatorId, setcreatorId] = useState(localStorage.getItem('userid'));
    const [notificationTime, setnotificationTime] = useState(0);

    const { isLogin, setIsLogin } = useIsLoginStore();

    const [meetingRooms, setmeetingRooms] = useState([])
    useEffect(() => {
        fetch('http://localhost:5000/meeting-room', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status) {
                    if (res.status === 200) {
                        setmeetingRooms(res.data);
                    }
                }

                if (res.statusCode) {
                    if (res.statusCode === 401) {
                        alert("請重新登入！")
                        localStorage.removeItem("jwtToken")
                        localStorage.removeItem('userid')
                        setIsLogin(false)
                        navigate('/')
                    }
                }
            })
            .catch(err => {
            })
    }, [])


    const navigate = useNavigate();

    //會議通知radio
    const [announcement, setAnnouncement] = useState('');
    const onOptionChange = e => {
        setAnnouncement(e.target.value)
    }

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

        fetch('http://localhost:5000/meeting', {
            method: 'POST',
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
                        alert('新增會議成功!')
                        navigate('/meeting')
                        break;
                    default:
                        console.log(res)
                        alert(res.message)
                        break;
                }
            })
    }



    return (
        <form onSubmit={handleSubmit}>
            <div className="createmeeting">
                <h2>建立會議</h2>
                <div className='createmeeting_row'>
                    <div>
                        <label><b>會議名稱：</b></label>
                        <input type="text" value={name} onChange={(e) => setname(e.target.value)} />
                    </div>
                </div>
                <div className='createmeeting_row'>
                    <div className='announcement-container'>
                        <label><b>會議通知：</b></label>
                        <input type="radio" name="announcement" value="Open" id="open" checked={announcement === "Open"} onChange={onOptionChange} />
                        <label htmlFor='open'>開啟</label>
                        <input type="radio" name="announcement" value="Close" id="close" checked={announcement === "Close"} onChange={onOptionChange} />
                        <label htmlFor='close'>關閉</label>
                        {announcement === 'Open' && (
                            <select className="custom-select" id="shopSearchSelect">
                                <option value={notificationTime} onChange={(e) => setnotificationTime(setnotificationTime(parseInt(e.target.value)))}>請選擇時間</option>
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
                        <select className="custom-select" id="shopSearchSelect" onChange={(e) => setmeetingRoomId(e.target.value)}>
                            <option value=''>請選擇會議地點</option>
                            {
                                meetingRooms.map(meetingRoom => {
                                    return <option key={meetingRoom.id} value={meetingRoom.id}>{meetingRoom.name}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className='createmeeting_row'>
                    <button type="create"><b>建立</b></button>
                </div>
            </div>
        </form>
    );
};

export default CreateMeeting;





