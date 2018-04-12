import React from 'react';
import { Button } from 'antd'
const ButtonGroup = ({ current, length, onConfirm, onSave }) => {
    return (
        <div>
            {current !== 0 && <Button onClick={() => onConfirm('up')} style={{ marginRight: 5 }}>上一步</Button>}
            {current + 1 !== length ? <Button onClick={() => onConfirm('down')}>下一步</Button> : <Button onClick={() => onSave()}>确定</Button>}
        </div>
    )
}
export default ButtonGroup