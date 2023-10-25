import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState } from 'react';
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { Button, Modal } from 'semantic-ui-react';

function RemarkModal({ meeting }) {
    const [isRemark, setIsRemark] = useState(false);

    // useEffect(()=>{console.log(meeting)},[])

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
                <div style={{display:'flex',flexDirection:'row'}}>
                    <p>title: </p>
                    <input type="text" />
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
                    onClick={() => setIsRemark(false)}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export { RemarkModal };

