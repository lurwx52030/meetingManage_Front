import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BsWindowStack } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { useBackendurlStore } from '../../store/backendUrlStore';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './room.css';

const MeetingRoom = () => {

  const [rowData, setRowData] = useState([]);
  const [key, setKey] = useState('');
  const { isLogin, setIsLogin } = useIsLoginStore();
  const {backendurl}=useBackendurlStore();
  const agGridRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {

    window.addEventListener('resize', resizeUpdate)
    getMeetingRooms()
    return () => {
      // remove Listener when component destroy
      window.removeEventListener('resize', resizeUpdate);
    }
  }, [])

  const getMeetingRooms = () => {
    axios.get(`${backendurl}/meeting-room`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
      }
    }).then(res => {
      setRowData(res.data.data)
    }).catch(err => {
      // if (err.response.status === 401) {
      //   localStorage.removeItem("jwtToken")
      //   localStorage.removeItem('userid')
      //   alert("請重新登入！")
      //   setIsLogin(false)
      // }
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

  const handleSearch = (key) => {
    if (key !== '') {
      agGridRef.current.api.setQuickFilter(key)
    } else if (key === '') {
      agGridRef.current.api.setQuickFilter();
    }
  };

  const columnDefs = [
    { headerName: '編號', field: 'id', filter: true, sortable: true, checkboxSelection: true },
    { headerName: '會議室名稱', field: 'name', filter: true, sortable: true },
    { headerName: '地點', field: 'location', filter: true, getQuickFilterText: '', sortable: true },
    {
      headerName: '操作', field: 'operate', cellRenderer: (params) => {
        return (
          <div className="button-container">
            <button
              className="look2-button"
              onClick={() => {
                navigate('/roomDetails', { state: params.data })
              }}
            >
              <BsWindowStack />
            </button>
          </div>
        )
      }
    }
  ];

  return (
    <div className="meetingContainer">
      <h2>會議室</h2>
      <div className="search">
        <input
          type="text"
          placeholder="...搜尋"
          onChange={(e) => setKey(e.target.value)}
        />
        <button className='meetingb' style={{ marginLeft: "5px" }} onClick={() => handleSearch(key)}>查詢</button>
      </div>
      <div className="ag-theme-alpine" style={{ height: '495px', width: '95vw' }}>
        <AgGridReact
          ref={agGridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection='multiple'//同時選擇多行
          animateRows={true} //整行式變動
          onGridReady={(event => {
            event.api.sizeColumnsToFit()
          })}
        />
      </div>
    </div>
  );
};

export default MeetingRoom;