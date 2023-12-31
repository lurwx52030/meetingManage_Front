import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
// import binicon from '../../assets/bin.png';
// import wrenchicon from '../../assets/wrench.png';
import { useBackendurlStore } from '../../store/backendUrlStore';
import { useIsLoginStore } from '../../store/useIsLoginStore';
import './people.css';

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
      <Button className="edit1-button" onClick={() => handleEditClick(params.meetingid)} icon='configure'/>
      <Button className="delete1-button" onClick={() => handleDeleteClick(params.meetingid)} icon='trash'/>
    </div>
  );
};

const People = ({ loginData, setLoginData }) => {
  const frameworkComponents = {
    operateCellRenderer: OperateCellRenderer,
  };

  const handleSearch = () => {
    if (key !== '') {
      agGridRef.current.api.setQuickFilter(key)
    } else if (key === '') {
      agGridRef.current.api.setQuickFilter();
    }
  };

  const [rowData, setRowData] = useState([]);
  const [key, setKey] = useState('');
  const agGridRef = useRef();

  const navigate = useNavigate();
  const { isLogin, setIsLogin } = useIsLoginStore();
  const { backendurl } = useBackendurlStore();

  const handleDeleteClick = (id) => {
    // 刪除按鈕事件
    const confirmDelete = window.confirm(`確定要刪除該${id}員工資料嗎？`);

    if (confirmDelete) {
      fetch(`${backendurl}/user/${id}`, {
        method: "delete", headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      })
        .then(resp => resp.json())
        .then(resp => {
          switch (resp.status) {
            case 200:
              alert('刪除成功!');
              setRowData(rowData.filter(row => row.id !== id))
              break;
            default:
              return Promise.reject(resp);
          }
          console.log(resp);
        })
        .catch(error => {
          console.log(error);
          alert('刪除失敗');
        });
    }

  };

  const handleEditClick = (data) => {
    console.log(data)
    navigate('/editUser', { state: data })
  };

  const columnDefs = [
    { headerName: '員工編號', field: 'id', filter: true, sortable: true, checkboxSelection: true },
    { headerName: '帳號', field: 'account', filter: true, sortable: true, getQuickFilterText: '', },
    { headerName: '姓名', field: 'name', filter: true, sortable: true },
    {
      headerName: '修改/刪除', field: 'operate', cellRenderer: (params) => (
        <div className="button-container">
          <Button
            className="edit1-button"
            onClick={() => handleEditClick(params.data)}
            icon='configure'
          >
            
          </Button>
          <Button
            className="delete1-button"
            onClick={() => handleDeleteClick(params.data.id)}
            icon='trash'
          >
            
          </Button>
        </div>
      )
      , cellRendererParams: {
        onDeleteClick: handleDeleteClick,
      },
    }
  ];

  useEffect(() => {
    window.addEventListener('resize', resizeUpdate)
    getUsers()

    return () => {
      // remove Listener when component destroy
      window.removeEventListener('resize', resizeUpdate);
    }
  }, [])


  const getUsers = () => {
    fetch(`${backendurl}/user`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      }
    })
      .then(resp => resp.json())
      .then(resp => {
        switch (resp.status) {
          case 200:
            setRowData(resp.data)
            break;
          default:
            return Promise.reject(resp);
        }
      })
      .catch(e => {
        console.log(e)
        switch (e.statusCode) {
          case 401:
            localStorage.removeItem("jwtToken")
            localStorage.removeItem('userid')
            alert("請重新登入！")
            navigate("/login")
            setIsLogin(false)
            break;
          case 403:
            alert("您沒有權限！")
            navigate("/");
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

  return (
    <div className="meetingContainer">
      <h2>人員管理</h2>
      <div className="search">
        <input
          type="text"
          placeholder="...搜尋"
          onChange={(e) => setKey(e.target.value)}
        />
        <button className='meetingb' style={{ marginLeft: '5px' }} onClick={handleSearch}>查詢</button>
      </div>
      <div className="ag-theme-alpine" style={{ height: '100vw', width: '95vw' }}>
        <AgGridReact
          ref={agGridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection='multiple'//同時選擇多行
          animateRows={true} //整行式變動
          frameworkComponents={frameworkComponents}
          onGridReady={(event => {
            event.api.sizeColumnsToFit()
          })}
        // onCellClicked={cellClickedListener}
        />
      </div>
    </div>
  );

};
export default People;
