import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import React, { useEffect, useState } from 'react';
import {
    Calendar, dayjsLocalizer
} from 'react-big-calendar';
import { useLocation, useNavigate } from "react-router-dom";
import { RoomStateMessage } from '../../components/roomStateMessage';
import { useBackendurlStore } from '../../store/backendUrlStore';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './roomDetails.css';


const RoomDetails = () => {

    const [meetingRooms, setmeetingRooms] = useState([]);
    const { isLogin, setIsLogin } = useIsLoginStore();
    const { backendurl } = useBackendurlStore();
    const navigate = useNavigate();
    const location = useLocation();




    //GET會議資料
    useEffect(() => {
        dayjs.extend(isBetween)
        getMeetingsByMeetingRoom()
    }, [])

    const getMeetingsByMeetingRoom = () => {
        fetch(`${backendurl}/meeting/room/${location.state.id}`, {
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
                        const matching = res.data.map(data => {
                            return (
                                {
                                    id: data.id,
                                    title: data.name,
                                    start: new Date(data.start),
                                    end: new Date(data.end)
                                }
                            )
                        })
                            .sort((a, b) => (a.start > b.start ? 1 : -1));
                        setmeetingRooms(matching);
                        break;
                    default:
                        return Promise.reject(res);
                }
            })
            .catch(err => {
                switch (err.statusCode) {
                    case 401:
                        localStorage.removeItem("jwtToken")
                        localStorage.removeItem('userid')
                        alert("請重新登入！")
                        navigate("/")
                        setIsLogin(false)
                        break;
                    case 403:
                        alert("您沒有權限！")
                        navigate("/");
                        break;
                }
            })
    }

    //自適應大小
    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    };


    return (
        <div
            className="roomDetailContainer"
            style={{ height: '100%' }}
        >
            <h2>會議室借用狀況-{location.state.name}</h2>
            <div style={{ height: "80%", width: '80%', display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '95%' }}>
                    <Calendar
                        localizer={dayjsLocalizer(dayjs)}
                        events={meetingRooms}
                        components={{
                            day: true,
                            week: true,
                            year: true,
                            event: ({ event }) => {
                                const { title, start, end } = event
                                return (
                                    <div>
                                        <div style={{ fontSize: '85%' }}>{event.title}</div>
                                        <div style={{ fontSize: '85%' }}>{dayjs(start).format('HH:mm')}-{dayjs(end).format('HH:mm')}</div>
                                    </div>
                                )
                            },
                        }}
                        eventPropGetter={(event, start, end) => {
                            let backgroundColor = ''
                            let current = new Date()
                            if (current < start) {
                                backgroundColor = '#ffcccb'
                            } else if (current > end) {
                                backgroundColor = '#fff7b9'
                            } else if (dayjs(current).isBetween(start, end)) {
                                backgroundColor = '#c4fcbb'
                            }

                            return {
                                style: {
                                    backgroundColor,
                                    color: 'black'
                                }
                            }
                        }}
                        startAccessor='start'
                        endAccessor='end'
                        defaultView='week'
                    />
                </div>
                <div style={{ width: '5%' }}>
                    <RoomStateMessage color='#ffcccb' message='會議尚未開始' />
                    <RoomStateMessage color='#fff7b9' message='會議已結束' />
                    <RoomStateMessage color='#c4fcbb' message='正在開會中' />
                </div>
            </div>
        </div>
    );
};

export default RoomDetails