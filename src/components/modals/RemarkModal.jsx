import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBackendurlStore } from '../../store/backendUrlStore';
import { useIsLoginStore } from '../../store/useIsLoginStore';

function RemarkModal({ meetingId, participant }) {
    const [isRemark, setIsRemark] = useState(false);
    const [remark, setRemark] = useState('');

    const { isLogin, setIsLogin } = useIsLoginStore();
    const { backendurl } = useBackendurlStore();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // console.log(participant);
        // Nullish Coalescing Operator
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
        const r = participant.remark ?? ''
        setRemark(r)
    }, [participant]);

    const setRemarkHandler = () => {
        const p = { meetingId, employeeId: participant.id, remark }

        fetch(`${backendurl}/meeting-member/remark`, {
            method: 'PUT',
            body: JSON.stringify(p),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then(res => res.json())
            .then(res => {
                switch (res.status) {
                    case 200:
                        alert('備註更新成功！');
                        setIsRemark(false);
                        break;
                    default:
                        return Promise.reject(res);
                }
            })
            .catch(error => {
                switch (error.statusCode) {
                    case 401:
                        localStorage.removeItem("jwtToken")
                        localStorage.removeItem('userid')
                        alert("請重新登入！")
                        navigate("/")
                        setIsLogin(false)
                        break;
                    case 403:
                        alert("您沒有權限！")
                        navigate("/meeting");
                        break;
                }
            })
    }

    return (
        <Modal
            onClose={() => setIsRemark(false)}
            onOpen={() => { setIsRemark(true) }}
            open={isRemark}
            trigger={(
                <Button
                    className='marker-button'
                >
                    <BsFillChatLeftTextFill />
                </Button>
            )}
        >
            <Modal.Header>備註</Modal.Header>
            <Modal.Content>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <p>title: </p>
                    <input type="text" value={remark} onChange={(e) => { setRemark(e.target.value ?? '') }} />
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setIsRemark(false)}>
                    取消
                </Button>
                <Button
                    content="確認"
                    labelPosition='left'
                    icon='checkmark'
                    onClick={setRemarkHandler}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export { RemarkModal };

