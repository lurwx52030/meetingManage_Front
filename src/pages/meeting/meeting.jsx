import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './meeting.css';



const Meeting = () => {

  // 查詢，使用 searchKeyword 和 selectedDate 進行篩選
  const handleSearch = () => {
    if (key !== '') {
      axios.get('http://localhost:5000/meeting',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
          }

        }
      )
        .then(res => {
          let result = res.data.data.filter(row => {
            return (
              row.id.toLowerCase().includes(key.toLowerCase()) || row.name.toLowerCase().includes(key.toLowerCase()) ||
              row.meetingRoom.toLowerCase().includes(key.toLowerCase())
            );
          })

          setRowData(result);
        });
    } else if (key === '') {
      axios.get('http://localhost:5000/meeting', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      })
        .then(res => {
          let result = res.data.data;

          if (selectedDate) {
            result = result.filter(row => {
              const startDate = new Date(row.start);
              const endDate = new Date(row.end);
              const selectedDateTime = new Date(selectedDate).getTime();

              // 計算開始時間前30分
              const startTimeMinus30Minutes = new Date(startDate);
              startTimeMinus30Minutes.setMinutes(startTimeMinus30Minutes.getMinutes() - 30);

              // 計算結束後時間30分
              const endTimePlus30Minutes = new Date(endDate);
              endTimePlus30Minutes.setMinutes(endTimePlus30Minutes.getMinutes() + 30);

              return (
                selectedDateTime >= startTimeMinus30Minutes.getTime() &&
                selectedDateTime <= endTimePlus30Minutes.getTime()
              );
            });
          }

          setRowData(result);
        });
    }
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
      valueFormatter: (params) => new Date(params.data.start).toLocaleString()
    },
    {
      headerName: '結束時間', field: 'end', filter: true, sortable: true,
      valueFormatter: (params) => new Date(params.data.end).toLocaleString()
    },
    { headerName: '地點', field: 'meetingRoom', filter: true },
    {
      headerName: '簽到簽退',
      field: 'signinout',
      filter: true,
      sortable: true,
      cellRenderer: (params) => (
        <Button onClick={() => navigate('/attendance', { state: params.data })} icon='calendar check' />
      ),
    },
    {
      headerName: '操作', field: 'operate', filter: true, sortable: true,
      cellRenderer: (params) => (
        <>
          <Button onClick={() => navigate('/editMeeting', { state: params.data })} icon='configure' />
          <Button onClick={() => deleteHandler(params.data.id)} icon='trash' />
          <Button onClick={() => navigate('/member', { state: params.data })} icon='users' />
        </>
      )
    },
    {
      headerName: '檔案管理', field: 'file', filter: true, sortable: true,
      cellRenderer: (params) => (
        <Button onClick={() => navigate('/file', { state: params.data })} icon='file' />
      )
    }
  ]);
  //對格子統一調整
  const defaultColDef = {
    flex: 1,
    resizable: true,
    cellStyle: { display: 'flex', justifyContent: 'start', alignItems: 'center' },
  }

  const getRowId = useMemo(() => {
    return (params) => params.data.id;
  }, []);


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

  const getMeetings = () => {
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
      }
    }).then(res => {
      setRowData(res.data.data)
    }).catch(err => {
      switch (err.response.status) {
        case 401:
          alert("請重新登入！")
          localStorage.removeItem("jwtToken")
          localStorage.removeItem('userid')
          setIsLogin(false)
          navigate('/')
          break;
        case 403:
          alert("您沒有權限！")
          navigate('/')
          break;
        default:
          alert(err.response.data.message)
          break;
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
    <div className='meetingContainer'>
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
      <div className='ag-theme-alpine center-table' style={{ height: '495px', width: '95vw' }}>
        <AgGridReact
          ref={agGridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection='multiple'//同時選擇多行
          animateRows={true} //整行式變動
          // pagination={true} // 分頁
          onGridReady={(event => {
            event.api.sizeColumnsToFit()
          })}
        />
      </div>
      <div className="button-container">
      </div>
    </div>
  );
};


export default Meeting;
