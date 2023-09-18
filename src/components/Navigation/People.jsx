import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import binicon from '../../image/bin.png';
import wrenchicon from '../../image/wrench.png';
import './People.css';

const OperateCellRenderer = (params) => {
  const handleEditClick = () => {
    // 編輯按鈕事件
    console.log('修改资料', params.data);
  };

  const handleDeleteClick = () => {
    // 刪除按鈕事件
    console.log('删除资料', params.data);
  };

  return (
    <div className="button-container">
      <button className="edit1-button" onClick={() => handleEditClick(params.meetingid)}><img src={wrenchicon} className="wrenchicon" alt="wrenchicon" /></button>
      <button className="delete1-button" onClick={() => handleDeleteClick(params.meetingid)}><img src={binicon} className="binicon" alt="binicon" /></button>
    </div>
  );
};

const People = ({ loginData, setLoginData }) => {
  const frameworkComponents = {
    operateCellRenderer: OperateCellRenderer,
  };
  // const [searchTerm, setSearchTerm] = useState('');
  // 
  // const handleDeleteUser = (employeeId) => {
  // const updatedLoginData = loginData.filter(user => user.employeeId !== employeeId);
  // setLoginData(updatedLoginData);
  // };

  // const filteredUsers = loginData.filter(user => {
  // return (
  // user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  // user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
  // user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // });

  const handleSearch = () => {
    console.log(key)
    console.log(rowData)
    if (key !== '') {
      axios.get('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      })
        .then(res => {
          console.log(res.data.data)
          let result = res.data.data.filter(row => {
            return (
              row.id.toLowerCase().includes(key.toLowerCase()) || row.name.toLowerCase().includes(key.toLowerCase()) ||
              row.account.toLowerCase().includes(key.toLowerCase())
            );
          })
          setRowData(result);

        })
    } else if (key === "") {
      axios.get('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      }
      ).then(res => {
        setRowData(res.data.data)
      })
    }
  };


  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [key, setKey] = useState('')
  const url = 'http://localhost:5000/user'

  const navigate = useNavigate()

  const handleDeleteClick = (id) => {
    // 刪除按鈕事件
    const confirmDelete = window.confirm(`確定要刪除該${id}員工資料嗎？`);

    if (confirmDelete) {
      fetch(`http://localhost:5000/user/${id}`, {
        method: "delete", headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
        .then(resp => resp.json())

        .then(resp => {
          setRowData(rowData.filter(item => item.id !== id));
          alert('刪除成功');
        })
        .catch(error => {
          console.error("刪除失敗", error);
        });
    }

  };

  const handleEditClick = (data) => {
    console.log(data)
    navigate('/edit', { state: data })
  };

  const columnDefs = [
    { headerName: '編號', field: 'id', filter: true, sortable: true, checkboxSelection: true },
    { headerName: '員工編號', field: 'emid', filter: true, sortable: true },
    { headerName: '帳號', field: 'account', filter: true, sortable: true },
    { headerName: '姓名', field: 'name', filter: true, sortable: true },
    {
      headerName: '修改/刪除', field: 'operate', cellRenderer: (params) => (
        <div className="button-container">
          <button
            className="edit1-button"
            onClick={() => handleEditClick(params.data)}
          >
            <img src={wrenchicon} className="wrenchicon" alt="wrenchicon" />
          </button>
          <button
            className="delete1-button"
            onClick={() => handleDeleteClick(params.data.id)}
          >
            <img src={binicon} className="binicon" alt="binicon" />
          </button>
        </div>
      )
      , cellRendererParams: {
        onDeleteClick: handleDeleteClick,
      },
    }
  ];

  // const cellClickedListener = useCallback( event => {
  //   console.log('cellClicked', event);
  // });

  useEffect(() => {
    getUsers()
  }, [])


  const getUsers = () => {
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    }).then(resp => resp.json()).then(resp => setRowData(resp.data))
  }

  const onGridReady = (params) => {
    setGridApi(params)
  }



  return (
    <div className="PeopleContainer">
      <h2>人員管理</h2>
      <div className="search">
        <input
          type="text"
          placeholder="...搜尋"
          onChange={(e) => setKey(e.target.value)}
        />
        <button onClick={handleSearch}>查詢</button>
      </div>
      <div className="ag-theme-alpine center-table" style={{ height: 500, width: '990px' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection='multiple'//同時選擇多行
          animateRows={true} //整行式變動
          frameworkComponents={frameworkComponents}
          onDridReady={onGridReady}
        // onCellClicked={cellClickedListener}
        />
      </div>
    </div>
  );

};
export default People;
