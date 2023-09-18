import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react'; //記得install
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from 'semantic-ui-react';
import binicon from '../../image/bin.png';
import calendaricon from '../../image/calendar.png';
import wrenchicon from '../../image/wrench.png';
import './Meeting.css';


//查詢
const Meeting = () => {
  // const [searchKeyword, setSearchKeyword] = useState('');
  // const [selectedDate, setSelectedDate] = useState('');

  // 查詢，使用 searchKeyword 和 selectedDate 進行篩選
  const handleSearch = () => {
  };

  //表格
  const gridRef = useRef();
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const url = ' http://localhost:5000/meeting';




  const [columnDefs, setColumnDefs] = useState([ //sortable:排序//filter:過濾器//editable:可編輯的
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
        <Button onClick={() => handleLook(params.data.name)}>
          <img src={calendaricon} className="calendaricon" alt="calendaricon" />
          </Button>
      ),
      cellStyle: () => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      })
    },
    {
      headerName: '操作', field: 'meetingid', cellRenderer: (params) => (
        <div>
          <Button className="delete-button" onClick={() => handleDeleteClick(params.data.id)}><img src={binicon} className="binicon" alt="binicon" /></Button>
          <Button className="edit-button" onClick={() => handleEditClick(params.data.id)}><img src={wrenchicon} className="wrenchicon" alt="wrenchicon" /></Button>
        </div>
      )
    }
  ]);
  //對格子統一調整
  const defaultColDef = {
    flex: 1,
  }
  const onGridReady = (params) => {
    setGridApi(params)
  }

  //回傳選取資料
  const cellClickedListener = useCallback(event => {
    console.log('cellClicked', event);
  });

  const getRowId = useMemo(() => {
    return (params) => params.data.id;
  }, []);

  useEffect(() => {
    getMeetings()
  }, [])

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
      }
    })
    // fetch(url, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
    //   }
    // })
    //   .then(resp => resp.json())
    //   .then(resp => {
    //     setRowData(resp.data);
    //   })
    //   .catch(error => {
    //     if (error.status===401) {
    //       console.log('!!!')
    //     }
    //   });
  }

  //------------------------------------------------------------------------------
  const handleLook = (params) => {
    // 查看按鈕事件
    console.log("查看簽到簽退", params);
  };

  //刪除

  const handleDeleteClick = (meetingid) => {
    const deleteUrl = `${url}/${encodeURIComponent(meetingid)}`;

    const confirm = window.confirm(`您確定要刪除這個會議嗎?`);
    if (confirm) {
      fetch(deleteUrl, { method: "DELETE" })
        .then(resp => resp.json())
        .then(resp => {
          console.log("Delete Response:", resp);
          getMeetings();
        })
        .catch(error => {
          console.error("Error deleting meeting:", error);
        });
    }
  };





  //編輯
  const handleEditClick = (meetingid) => {
    // fetch(url+`/${meetingid}`,{method:"UPDATE"}).then(resp => resp.json()).then(resp => getMeetings())
  };
  //----------------------------------------------------------------------------- 

  //   // 表格适应页面大小
  //   function onTotalGridReady(params) {
  //     gridOptions.api.sizeColumnsToFit();//调整表格大小自适应
  // }


  return (
    <div className='meetingContainer'>
      <h2>會議清單</h2>
      <div className='search'>
        <input
          type="text"
          placeholder="...搜尋"
        // value={searchKeyword}
        // onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <input
          type='date'
        // value={selectedDate}
        // onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={handleSearch}>查詢</button>
      </div>
      <div className='ag-theme-alpine center-table' style={{ width: '95%' }}>
        <AgGridReact ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          rowSelection='multiple'//同時選擇多行
          onCellClicked={cellClickedListener}
          getRowId={getRowId}
          domLayout='autoHeight'
        >
        </AgGridReact>
      </div>
      <div className="button-container">
      </div>

    </div>
  );
};


export default Meeting;
