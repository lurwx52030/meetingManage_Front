import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { useBackendurlStore } from '../../store/backendUrlStore';
import { useIsLoginStore } from '../../store/useIsLoginStore';

function MeetingMember() {
    // 查詢，使用 employeeID 和 emoploeeName 進行篩選
    const handleSearch = () => {
        if (key !== '') {
            agGridRef.current.api.setQuickFilter(key)
        } else if (key === '') {
            agGridRef.current.api.setQuickFilter();
        }
    };

    //表格
    const [gridApi, setGridApi] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectEmployee, setSelectEmployee] = useState('');
    const [key, setKey] = useState('');
    const agGridRef = useRef()

    const navigate = useNavigate();
    const location = useLocation();

    const [size, setSize] = useState([0, 0]);

    const { isLogin, setIsLogin } = useIsLoginStore();
    const { backendurl } = useBackendurlStore();

    const [columnDefs, setColumnDefs] = useState([ //sortable:排序//filter:過濾器//editUserable:可編輯的
        { headerName: '員工id', field: 'id', filter: true, sortable: true, checkboxSelection: true },
        { headerName: '員工姓名', field: 'name', filter: true, sortable: true },
        {
            headerName: '操作', field: 'operate', cellRenderer: (params) => (
                <div>
                    <Button onClick={() => deleteHandler(params.data.id)} icon='trash' />
                </div>
            )
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
        getEmployees()
        getMembers()
        return () => {
            // remove Listener when component destroy
            window.removeEventListener('resize', resizeUpdate);
        }
    }, [])

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


    const handleAdd = () => {
        console.log({
            meetingId: location.state.id,
            employeeId: selectEmployee
        })
        axios.post(`${backendurl}/meeting-member`, {
            meetingId: location.state.id,
            employeeId: selectEmployee
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            switch (res.data.status) {
                case 200:
                    getMembers();
                    break;
                default:
                    alert(res.message)
                    break;
            }
        }).catch(err => {
            console.log(err.response)
            switch (err.response.status) {
                case 401:
                    alert("請重新登入！")
                    localStorage.removeItem("jwtToken")
                    localStorage.removeItem('userid')
                    setIsLogin(false)
                    navigate('/')
                    break;
                default:
                    alert(err.response.data.message)
                    break;
            }
        })
    }

    const getEmployees = () => {
        axios.get(`${backendurl}/user/employee`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            setEmployees(res.data.data)
        }).catch(err => {
            switch (err.response.status) {
                case 401:
                    alert("請重新登入！")
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem('userid');
                    setIsLogin(false);
                    navigate('/');
                    break;
                default:
                    alert(`status=${err.response.data.statusCode}\nmessage=${err.response.data.message}`);
                    break;
            }
        })
    }

    const getMembers = () => {
        // localhost:5000/meeting-member/meeting/M030
        axios.get(`${backendurl}/meeting-member/meeting/${location.state.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            setMembers(res.data.data)
        }).catch(err => {
            console.log(err)
            switch (err.response.status) {
                case 401:
                    alert("請重新登入！")
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem('userid');
                    setIsLogin(false);
                    navigate('/');
                    break;
                default:
                    alert(`status=${err.response.data.statusCode}\nmessage=${err.response.data.message}`);
                    break;
            }
        })
    }

    //------------------------------------------------------------------------------
    const handleLook = (params) => {
    };


    //刪除
    const deleteHandler = (employee) => {
        // localhost:5000/meeting-member/meeting/M030
        axios.delete(`${backendurl}/meeting-member/${location.state.id}/${employee}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            switch (res.data.status) {
                case 200:
                    getMembers();
                    break;
                default:
                    alert(res.message)
                    break;
            }
        }).catch(err => {
            console.log(err)
            switch (err.response.status) {
                case 401:
                    alert("請重新登入！")
                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem('userid');
                    setIsLogin(false);
                    navigate('/');
                    break;
                default:
                    alert(`status=${err.response.data.statusCode}\nmessage=${err.response.data.message}`);
                    break;
            }
        })
    };

    return (
        <div className='meetingContainer'>
            <h2 style={{ display: 'block' }}>會議參與者-{location.state.name}</h2>
            <div>
                <div>
                    <input
                        type="text"
                        placeholder="...搜尋"
                        onChange={(e) => {
                            setKey(e.target.value)
                        }}
                    />
                    <button
                        style={{ marginLeft: '5px' }}
                        className='meetingb'
                        onClick={handleSearch}
                    >
                        查詢
                    </button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <select
                        value={selectEmployee}
                        onChange={(e) => setSelectEmployee(e.target.value)}
                    >
                        <option value=''>請選擇員工</option>
                        {
                            employees.map(employee => {
                                return <option key={employee.id} value={employee.id}>{employee.name}</option>
                            })
                        }
                    </select>
                    <button
                        style={{ marginLeft: '5px' }}
                        className='meetingb'
                        onClick={handleAdd}
                    >
                        新增
                    </button>


                    <button
                        style={{ marginLeft: '5px' }}
                        className='meetingb'
                        onClick={() => {
                            navigate('/meeting')
                        }}
                    >
                        返回
                    </button>
                </div>
            </div>
            <div className='ag-theme-alpine' style={{ height: '460px', width: '95vw' }}>
                <AgGridReact
                    ref={agGridRef}
                    rowData={members}
                    columnDefs={columnDefs}
                    rowSelection='multiple'//同時選擇多行
                    animateRows={true} //整行式變動
                    onGridReady={(event => {
                        event.api.sizeColumnsToFit()
                    })}
                />
            </div>
            <div className="button-container">
            </div>
        </div>
    );
}

export default MeetingMember;