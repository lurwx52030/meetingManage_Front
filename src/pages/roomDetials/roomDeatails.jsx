import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
    Calendar, dayjsLocalizer
} from 'react-big-calendar';
import { useLocation, useNavigate } from "react-router-dom";
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './roomdeatails.css';



const Roomdeatails = () => {

    const [meetingRooms, setmeetingRooms] = useState([]);
    const { isLogin, setIsLogin } = useIsLoginStore();
    const navigate = useNavigate()
    const location = useLocation();




    //GET會議資料
    useEffect(() => {
        fetch(`http://localhost:5000/meeting/room/${location.state.id}`, {
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
    }, [])

    //自適應大小
    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    };


    return (
        <div
            className="roomDeatailContainer"
            style={{ height: '100vh' }}
        >
            <h2>會議室借用狀況-{location.state.name}</h2>
            <div style={{ height: "80%", width: '80%' }}>
                <Calendar
                    localizer={dayjsLocalizer(dayjs)}
                    events={meetingRooms}
                    eventPropGetter={(event, start, end, isSelected) => {
                        let current = new Date()
                        console.log(start)
                        console.log(current < start)
                        console.log(current > start && current < end)
                        console.log(current > start)
                    }}
                    startAccessor='start'
                    endAccessor='end'
                    defaultView='week'
                />
            </div>
        </div>
    );
};

export default Roomdeatails