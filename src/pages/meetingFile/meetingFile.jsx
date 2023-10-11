import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { useIsLoginStore } from '../../store/useIsLoginStore';

function MeetingFile() {
    // 查詢
    const handleSearch = () => {
        if (key !== '') {
            axios.get(`http://localhost:5000/meeting-file/${location.state.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                    }
                }
            )
                .then(res => {
                    let result = res.data.data.filter(row => row.name.toLowerCase().includes(key.toLowerCase()));
                    setFiles(result);
                });
        } else if (key === '') {
            axios.get(`http://localhost:5000/meeting-file/${location.state.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
                }
            })
                .then(res => {
                    let result = res.data.data;
                    setFiles(result);
                });
        }
    };

    //表格
    const [gridApi, setGridApi] = useState(null);
    const fileRef = useRef()
    const [files, setFiles] = useState([]);
    const [uploadFiles, setUploadFiless] = useState([]);
    const [key, setKey] = useState('');
    const agGridRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();

    const [size, setSize] = useState([0, 0]);

    const { isLogin, setIsLogin } = useIsLoginStore();

    const [columnDefs, setColumnDefs] = useState([ //sortable:排序//filter:過濾器//editUserable:可編輯的
        { headerName: '序號', field: 'id', filter: true, sortable: true, checkboxSelection: true },
        // { headerName: '上傳時間', field: 'uploadTime', filter: true, sortable: true },
        {
            headerName: '檔名', field: 'name', filter: true, sortable: true,
            cellRenderer: (params) => (
                <a href={params.data.download}>
                    {params.data.name}
                </a>
            )
        },
        {
            headerName: '操作', field: 'operate', cellRenderer: (params) => (
                <div>
                    <Button onClick={() => {
                        const confirm = window.confirm(`您確定要刪除${params.data.name}嗎?`);
                        if (confirm) {
                            deleteHandler(params.data.name)
                        }
                    }} icon='trash' />
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
        getfiles()
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

    const onUpload = (e) => {
        e.preventDefault();
        const body = new FormData();
        if (uploadFiles) {
            console.log(uploadFiles);
            if (uploadFiles.length === 0) {
                alert('請選擇一個檔案');
                return;
            }
            [...uploadFiles].forEach((file, i) => {
                body.append('file', file, file.name)
            });
            fetch(`http://localhost:5000/meeting-file/${location.state.id}`, {
                method: 'POST',
                body,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    switch (res.status) {
                        case 200:
                            alert('上傳成功');
                            fileRef.current.file = null
                            fileRef.current.value = null
                            setUploadFiless([]);
                            getfiles();
                            break;
                        default:
                            return Promise.reject(res);
                    }
                })
                .catch(e => {
                    console.log(e)
                    switch (e.statusCode) {
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
    }


    const getfiles = () => {
        // localhost:5000/meeting-member/meeting/M030
        axios.get(`http://localhost:5000/meeting-file/${location.state.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            setFiles(res.data.data)
        }).catch(err => {
            console.log(err)
            if (err.response.status === 401) {
                alert("請重新登入！")
                localStorage.removeItem("jwtToken")
                localStorage.removeItem('userid')
                setIsLogin(false)
                navigate('/')
            }
        })
    }

    //------------------------------------------------------------------------------
    const handleLook = (params) => {
    };


    //刪除
    const deleteHandler = (file) => {
        // localhost:5000/meeting-member/meeting/M030
        axios.delete(`http://localhost:5000/meeting-file/${file}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
            }
        }).then(res => {
            switch (res.data.status) {
                case 200:
                    alert('刪除成功');
                    getfiles();
                    break;
                default:
                    alert(res.message)
                    break;
            }
        }).catch(err => {
            console.log(err)
            if (err.response.status === 401) {
                alert("請重新登入！")
                localStorage.removeItem("jwtToken")
                localStorage.removeItem('userid')
                setIsLogin(false)
                navigate('/')
            }
        })
    };

    return (
        <div className='meetingContainer'>
            <h2 style={{ display: 'block' }}>會議檔案-{location.state.name}</h2>
            <div className='search'>
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
                    onClick={handleSearch}>
                    查詢
                </button>
                <form onSubmit={onUpload}>
                    <div style={{ marginTop: '10px' }}>
                        <input
                            type="file"
                            ref={fileRef}
                            onChange={(e) => {
                                setUploadFiless(e.target.files)
                            }}
                            multiple
                        />
                        <button
                            style={{ marginLeft: '5px' }}
                            className='meetingb'
                            type='submit'
                        >
                            <BsFillCloudArrowUpFill />
                            上傳
                        </button>
                        <button
                            style={{ marginLeft: '5px' }}
                            className='meetingb'
                            onClick={() => { navigate('/meeting') }}
                        >
                            返回
                        </button>
                    </div>
                </form>
            </div>
            <div className='ag-theme-alpine' style={{ height: '100vw', width: '80vw' }}>
                <AgGridReact
                    ref={agGridRef}
                    rowData={files}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
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

export default MeetingFile;