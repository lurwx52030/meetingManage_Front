import React, { useState } from 'react';
import './createmeeting.css'; // 導入CSS
import axios from 'axios';



const CreateMeeting = () => {
    const [meetingname, setMeetingname] = useState('');
    const [meetingstarttime, setMeetingstarttime] = useState('');
    const [meetingendtime, setMeetingendtime] = useState('');
    //會議通知radio
    const [announcement, setAnnouncement] = useState('');
    const onOptionChange = e => {
        setAnnouncement(e.target.value)
    }
    // 上傳檔案
    const [file, setFile] = useState(null);
    const [result, setResult] = useState('');
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };
    const handleUpload = async () => {
        if (!file) {
          setResult('請選擇要上傳的檔案');
          return;
        }
    
        const formData = new FormData();
        formData.append('fileToUpload', file);
    
        try {
          const response = await axios.post('your_ibon_upload_endpoint', formData);
          setResult('檔案上傳成功: ' + response.data.message);
        } catch (error) {
          setResult('檔案上傳失敗: ' + error.message);
        }
    };
    return (
        <div className="createmeeting">
            <h2>建立會議</h2>
            <div className='createmeeting_row'>
                <div>
                    <label><b>會議名稱：</b></label>
                    <input type="text" value={meetingname} onChange={(e) => setMeetingname(e.target.value)}/>
                </div>
                <div>
                    <label><b>會議通知：</b></label>
                    <input type="radio" name="announcement" value="Open" id="open" checked={announcement === "Open"} onChange={onOptionChange}/>
                    <label htmlFor='open'>開啟</label>
                    <input type="radio" name="announcement" value="Close" id="close" checked={announcement === "Close"} onChange={onOptionChange}/>
                    <label htmlFor='close'>關閉</label>
                    <div>
                        <select className="custom-select" id="shopSearchSelect">
                        <option value="">請選擇時間</option>
                        <option value="5">5分鐘</option>
                        <option value="10">10分鐘</option>
                        <option value="15">15分鐘</option>
                        <option value="30">30分鐘</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className='createmeeting_row'>
                <div className='meeting_start_time'>
                <label><b>會議開始時間：</b></label>
                <input type="datetime-local" value={meetingstarttime} onChange={(e) => setMeetingstarttime(e.target.value)} />
                </div>
            </div>
            <div className='createmeeting_row'>
                <div className='meeting_end_time'>
                <label><b>會議結束時間：</b></label>
                <input type="datetime-local" value={meetingendtime} onChange={(e) => setMeetingendtime(e.target.value)} />
                </div>
            </div>
            <div className='createmeeting_row'>
                <div>
                    <label><b>會議地點：</b></label>
                    <select className="custom-select" id="shopSearchSelect">
                    <option value="">請選擇會議地點</option>
                    <option value="A101">A101</option>
                    <option value="A102">A102</option>
                    <option value="B201">B201</option>
                    <option value="B202">B202</option>
                    </select>
                </div>
            </div>
            <div className='createmeeting_row'>
                <div>
                    <label><b>會議資料：</b></label>
                </div>
                <div>
                    <input type="file" onChange={handleFileChange} multiple/>
                    <button onClick={handleUpload}>上傳檔案</button>
                    <div>{result}</div>
                </div>
            </div>
            <div className='createmeeting_row'>
                <div>
                    <label><b>會議參與者：</b></label>
                </div>
            </div>
        </div>
    );
};

export default CreateMeeting;





