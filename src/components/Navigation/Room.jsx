import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BsWindowStack } from "react-icons/bs";
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './Room.css';


const OperateCellRenderer = (params) => {
  const handleLook = () => {
    // 查看按鈕事件
    console.log('查看', params.data);
  };
  return (
    <div className="button-container">
      <button className="look2-button" onClick={() => handleLook(params.meetingid)}><BsWindowStack /></button>
    </div>
  );
};

const MeetingRoom = () => {

  const [rowData, setRowData] = useState([])
  const [key, setKey] = useState('')
  const { isLogin, setIsLogin } = useIsLoginStore();

  useEffect(() => {
    axios.get('http://localhost:5000/meeting-room', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
      }
    }).then(res => {
      setRowData(res.data.data)
    }).catch(err => {
      if (err.response.status === 401) {
        localStorage.removeItem("jwtToken")
        localStorage.removeItem('userid')
        alert("請重新登入！")
        setIsLogin(false)
      }
    })
  }, [])

  const handleSearch = (key) => {
    console.log(key)
    console.log(rowData)
    if (key !== '') {
      // rowData.forEach(row=>console.log(row.location.includes(key)||row.name.includes(key)))
      // setRowData(rowData.filter(row=>row.location.includes(key)||row.name.includes(key)))
      axios.get('http://localhost:5000/meeting-room')
        .then(res => {
          let result = res.data.data.filter(row => {
            return row.location.toLowerCase().includes(key.toLowerCase()) || row.name.toLowerCase().includes(key.toLowerCase())
          })
          setRowData(result)
        })
    } else if (key === "") {
      axios.get('http://localhost:5000/meeting-room').then(res => {
        setRowData(res.data.data)
      })
    }
  };

  const columnDefs = [
    { headerName: '編號', field: 'id', filter: true, sortable: true, checkboxSelection: true },
    { headerName: '會議室名稱', field: 'name', filter: true, sortable: true },
    { headerName: '地點', field: 'location', filter: true, sortable: true },
    { headerName: '操作', field: 'operate', cellRenderer: OperateCellRenderer }
  ];

  const frameworkComponents = {
    operateCellRenderer: OperateCellRenderer,
  };




  // const rowData = [
  //   { id: '1', name: '銷售組開會', where: 'A101' },
  //   { id: '2', name: '企劃組開會', where: 'A102' },
  // ];
  return (
    <div className="roomContainer">
      <h2>會議室</h2>
      <div className="search">
        <input
          type="text"
          placeholder="...搜尋"
          onChange={(e) => setKey(e.target.value)}
        />
        <button onClick={() => handleSearch(key)}>查詢</button>
      </div>
      <div className="ag-theme-alpine center-table" style={{ height: 500, width: '770px' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection='multiple'//同時選擇多行
          animateRows={true} //整行式變動
          frameworkComponents={frameworkComponents}
        // onCellClicked={cellClickedListener}

        />
      </div>
    </div>
  );
};

export default MeetingRoom;