import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineCheckSquare, AiOutlineFrown } from "react-icons/ai";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { RemarkModal } from '../../components/modals/RemarkModal';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './style.css';


function Attendance() {
    // 查詢，使用 employeeID 和 emoploeeName 進行篩選
    const handleSearch = () => {
        if (key !== '') {
            axios.get(`http://localhost:5000/meeting-member/meeting/${location.state.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                    }

                }
            )
                .then(res => {
                    let result = res.data.data.filter(row => {
                        return (
                            row.id.toLowerCase().includes(key.toLowerCase()) || row.name.toLowerCase().includes(key.toLowerCase())
                        );
                    })

                    setMembers(result);
                });
        } else if (key === '') {
            axios.get(`http://localhost:5000/meeting-member/meeting/${location.state.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
                .then(res => {
                    let result = res.data.data;
                    setMembers(result);
                });
        }
    };

    //表格
    const [gridApi, setGridApi] = useState(null);
    const [members, setMembers] = useState([]);
    const [selectEmployee, setSelectEmployee] = useState('');
    const [key, setKey] = useState('');
    const agGridRef = useRef();
    const [checkin, setCheckin] = useState(false);
    const [checkout, setCheckout] = useState(false);
    const socketRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const [size, setSize] = useState([0, 0]);
    const { isLogin, setIsLogin } = useIsLoginStore();


    const [columnDefs, setColumnDefs] = useState([ //sortable:排序//filter:過濾器//editUserable:可編輯的
        { headerName: '員工id', field: 'id', filter: true, sortable: true },
        { headerName: '員工姓名', field: 'name', filter: true, sortable: true },
        {
            headerName: '簽到/簽退', field: 'operate', cellRenderer: (params) => (
                <div>
                    <Button
                        className='signin-button'
                        style={{ backgroundColor: params.data.singin !== null ? '#42f55d' : '#e0e1e2 none' }}
                        onClick={() => checkinHandler(params.data.id)}
                    >
                        <AiOutlineCheckSquare />
                    </Button>
                    {/* <Button className='signout-button' onClick={() => signout(params.data.id)}  ><AiOutlineCheckSquare /></Button> */}
                    <Button
                        className='nosignin-button'
                        style={{ backgroundColor: params.data.singout !== null ? '#42f55d' : '#e0e1e2 none' }}
                        onClick={() => checkoutHandler(params.data.id)}
                    >
                        <AiOutlineFrown />
                    </Button>
                    {/* <Button className='nosignout-button' onClick={() => nosignout(params.data.id)}  ><AiOutlineCloseSquare /></Button> */}
                </div>
            )
        },
        {
            headerName: '備註', field: 'operate', cellRenderer: (params) => {
                return (<RemarkModal meeting={params.data} />)
            }
        },
    ]);

    //對格子統一調整
    const defaultColDef = {
        flex: 1,
        resizable: true
    }

    const getRowId = useMemo(() => {
        return (params) => params.data.id;
    }, []);


    useEffect(() => {
        window.addEventListener('resize', resizeUpdate)
        getMembers();
        getAttendanceState();
        // sleep 100ms
        (() => new Promise(resolve => setTimeout(resolve, 100)))()
        return () => {
            // remove Listener when component destroy
            window.removeEventListener('resize', resizeUpdate);
        }
    }, [])


    const socketOpen = useCallback(() => {
        console.log(location.state.id);
        const socket = new WebSocket('ws://localhost:5000');
        let x;
        socket.onopen = function (e) {
            console.log("[open] Connection established");
            console.log("Sending to server");

            socket.send(JSON.stringify({
                event: 'hello',
                data: location.state.id
            }))

            socketAttendanceState();
        };

        socket.onmessage = function (event) {
            const res = JSON.parse(event.data);
            console.log(res);
            if (res !== null && res !== undefined) {
                if (res.data instanceof Array) {
                    setMembers(res.data);
                }
            }
        }

        socket.onclose = function () {
            console.log('簽到簽退結束')
        }

        socketRef.current = socket;
    }, [location.state.id])

    useEffect(() => {
        console.log(checkin, checkout);
        if (checkin) {
            socketOpen();
        } else if (checkout) {
            socketOpen();
        } else {
            if (socketRef.current !== undefined && socketRef.current !== null && socketRef.current instanceof WebSocket) {
                socketRef.current.close();
                socketRef.current = null;
            }
        }
    }, [checkin, checkout, socketOpen])

    const socketAttendanceState = useCallback(() => {
        let counter = 0;
        let x = setInterval(function () {
            if (socketRef.current !== undefined && socketRef.current !== null && socketRef.current instanceof WebSocket) {
                socketRef.current.send(JSON.stringify({
                    event: 'member',
                    data: location.state.id
                }))
                console.log(counter, new Date());
                console.log(checkin, checkout)
                if (counter === 60 * location.state.checkLimit) {
                    counter = 0;
                    clearInterval(x);
                    socketRef.current.close();
                }
                counter++;
            } else {
                clearInterval(x);
            }
        }, 1000);

        return () => clearInterval(x);
    }, [checkin, checkout, location.state.checkLimit, location.state.id])

    const resizeUpdate = () => {
        autoSizeAll()
        sizeToFit()
    }


    const sizeToFit = useCallback(() => {
        agGridRef.current.api.sizeColumnsToFit();
    }, []);

    const autoSizeAll = useCallback((skipHeader) => {
        const allColumnIds = [];
        agGridRef.current.columnApi.getColumns().forEach((column) => {
            allColumnIds.push(column.getId());
        });
        agGridRef.current.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    }, []);

    const getMembers = () => {
        // localhost:5000/meeting-member/meeting/M030
        axios.get(`http://localhost:5000/meeting-member/meeting/${location.state.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            setMembers(res.data.data)
        }).catch(err => {
            console.log(err)
            if (err.response.status === 401) {
                alert("請重新登入！")
                localStorage.removeItem("jwtToken")
                localStorage.removeItem('userid')
                setIsLogin(false)
                navigate('/login')
            }
        })
    }

    const getAttendanceState = () => {
        axios.get(`http://localhost:5000/meeting/${location.state.id}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            }
        ).then(res => {
            const data = res.data.data
            setCheckin(data[0].isCheckin)
            setCheckout(data[0].isCheckout)
            console.log(data[0].isCheckin, data[0].isCheckout)
        }).catch(err => {
            console.log(err)
            if (err.response.status === 401) {
                alert("請重新登入！")
                localStorage.removeItem("jwtToken")
                localStorage.removeItem('userid')
                setIsLogin(false)
                navigate('/login')
            }
        })
    }

    const attendanceStateHandler = (type, id, state) => {
        axios.get(`http://localhost:5000/meeting/${type}/${id}/${!state ? 1 : 0}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            console.log(res.data.msg);

            const state = res.data.msg.includes("開啟") ? true : false;
            if (type === 'checkin') {
                setCheckin(state);
            } else if (type === 'checkout') {
                setCheckout(state);
            }
        }).catch(err => {
            if (err.response.status === 401) {
                alert("請重新登入！")
                localStorage.removeItem("jwtToken")
                localStorage.removeItem('userid')
                setIsLogin(false)
                navigate('/login')
            } else {
                alert(err.response.data.message)
            }
        })
    }

    const checkinHandler = (id) => {
        axios.get(`http://localhost:5000/meeting-member/signin/${location.state.id}/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
            if (err.response.status === 401) {
                alert("請重新登入！")
                localStorage.removeItem("jwtToken")
                localStorage.removeItem('userid')
                setIsLogin(false)
                navigate('/login')
            } else {
                alert(err.response.data.message)
            }
        })
    }
    const checkoutHandler = (id) => {
        axios.get(`http://localhost:5000/meeting-member/signout/${location.state.id}/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
            if (err.response.status === 401) {
                alert("請重新登入！")
                localStorage.removeItem("jwtToken")
                localStorage.removeItem('userid')
                setIsLogin(false)
                navigate('/login')
            } else {
                alert(err.response.data.message)
            }
        })
    }

    //自適應大小
    const onGridReady = (params) => {
        params.api.sizeColumnsToFit();
    };

    return (
        <div className='meetingContainer'>
            <h2 style={{ display: 'block' }}>簽到簽退-{location.state.name}</h2>
            <div className='searchContainer'>
                <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="...搜尋"
                        onChange={(e) => {
                            setKey(e.target.value)
                        }}
                    />
                    <button
                        style={{ marginLeft: '5px', }}
                        className='sinsoutb'
                        onClick={handleSearch}
                    >
                        查詢
                    </button>
                    <button
                        style={{ marginLeft: '5px' }}
                        className='sinsoutb'
                        onClick={() => {
                            navigate('/meeting')
                        }}
                    >
                        返回
                    </button>
                </div>
                <div className='attendanceBtns'>
                    <button
                        style={{ backgroundColor: checkin ? 'blue' : 'rgb(82, 80, 80)', margin: '0 2.5px' }}
                        className='sinsoutb'
                        onClick={() => {
                            attendanceStateHandler('checkin', location.state.id, checkin)
                        }}
                        disabled={checkout}
                    >
                        開啟/關閉簽到
                    </button>
                    <button
                        style={{ backgroundColor: checkout ? 'blue' : 'rgb(82, 80, 80)', margin: '0 2.5px' }}
                        className='sinsoutb'
                        onClick={() => {
                            attendanceStateHandler('checkout', location.state.id, checkout)
                        }}
                        disabled={checkin}
                    >
                        開啟/關閉簽退
                    </button>
                </div>
            </div>
            <div className='ag-theme-alpine center-table' style={{ height: '450px', width: '95vw' }}>
                <AgGridReact
                    ref={agGridRef}
                    rowData={members}
                    columnDefs={columnDefs}
                    rowSelection='multiple'//同時選擇多行
                    animateRows={true} //整行式變動
                    onGridReady={onGridReady}

                />
            </div>
            <div className="button-container">
            </div>
        </div>
    );
}

export default Attendance;