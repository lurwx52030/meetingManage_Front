import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react'; //記得install
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './Meeting.css';


//查詢
const Meeting = () => {

  // 查詢，使用 searchKeyword 和 selectedDate 進行篩選
  const handleSearch = () => {
  };

  //表格
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [key, setKey] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const agGridRef = useRef()
  const url = ' http://localhost:5000/meeting';

  const navigate = useNavigate();

  const [size, setSize] = useState([0, 0]);

  const { isLogin, setIsLogin } = useIsLoginStore();

  const [columnDefs, setColumnDefs] = useState([ //sortable:排序//filter:過濾器//editUserable:可編輯的
    { headerName: '會議ID', field: 'id', filter: true, sortable: true, checkboxSelection: true },
    { headerName: '會議名稱', field: 'name', filter: true, sortable: true },
    {
      headerName: '開始時間', field: 'start', filter: true, sortable: true,
      cellRenderer: (params) => {
        return <div>{new Date(params.data.start).toLocaleString()}</div>
      }
    },
    {
      headerName: '結束時間', field: 'end', filter: true, sortable: true,
      cellRenderer: (params) => {
        return <div>{new Date(params.data.end).toLocaleString()}</div>
      }
    },
    { headerName: '地點', field: 'meetingRoom', filter: true },
    {
      headerName: '簽到簽退',
      field: 'signinout',
      cellRenderer: (params) => (
        <Button onClick={() => handleLook(params.data.name)} icon='calendar check' />
      ),
    },
    {
      headerName: '操作', field: 'operate', cellRenderer: (params) => (
        <div>
          <Button onClick={() => navigate('/editMeeting',{state:params.data})} icon='configure' />
          <Button onClick={() => deleteHandler(params.data.id)} icon='trash' />
        </div>
      )
    },
    {
      headerName: '檔案管理', field: 'file', cellRenderer: (params) => (
        <div className="button-container">
          <Button onClick={() => handleUpload(params.data.id)} icon='file' />
        </div>
      )
    }
  ]);
  //對格子統一調整
  const defaultColDef = {
    flex: 1,
    resizable: true
  }

  //回傳選取資料
  const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event);
  });

  const getRowId = useMemo(() => {
    return (params) => params.data.id;
  }, []);

  // useeffect
  useEffect(() => {
    window.addEventListener('resize', resizeUpdate)
    getMeetings()

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


  //上傳檔案
  const handleUpload = (id) => {
    console.log(id)
  }

  const getMeetings = () => {
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
      }
    }).then(res => {
      setRowData(res.data.data)
    }).catch(err => {
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
    // 查看按鈕事件
    console.log("查看簽到簽退", params);
  };


  //刪除
  const deleteHandler = (meetingid) => {
    const deleteUrl = `${url}/${encodeURIComponent(meetingid)}`;

    const confirm = window.confirm(`您確定要刪除這個會議嗎?`);
    if (confirm) {
      axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      }).then(res => {
        if (res.data.status) {
          if (res.data.status === 200) {
            alert('刪除成功');
            getMeetings();
          }
        }
      }).catch(err => {
        if (err.response.status === 401) {
          alert("請重新登入！")
          localStorage.removeItem("jwtToken")
          localStorage.removeItem('userid')
          setIsLogin(false)
          navigate('/')
        }
      })
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
      <h2>會議清單</h2>
      <div className='search'>
        <input
          type="text"
          placeholder="...搜尋"
          onChange={(e) => {
            setKey(e.target.value)
          }}
        />
        <input
          type='datetime-local'
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button className='meetingb' onClick={handleSearch}>查詢</button>
      </div>
      <div className='ag-theme-alpine center-table' style={{ height: '100vw', width: '100vw' }}>
        <AgGridReact
          ref={agGridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={(event => {
            event.api.sizeColumnsToFit()
          })}
          rowSelection='multiple'//同時選擇多行
          animateRows={true} //整行式變動
        />
      </div>
      <div className="button-container">
      </div>
    </div>
  );
};


export default Meeting;
