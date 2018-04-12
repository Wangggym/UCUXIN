import React from 'react'
import { Card, Tag } from 'antd'
import './style.scss'
export default class SelectCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    handleClick(UID, MName) {
        const { onClick } = this.props
        onClick && onClick({ UID, MName })
    }

    render() {
        const { tagData, title } = this.props
        return (
            <div>
                <div style={{ padding: '15px 0 10px 5px' }}>
                    {title}
                </div>
                <Card noHovering style={{ width: '100%' }} bodyStyle={{ padding: '15px 25px' }}>
                    {(tagData && tagData.length) ? tagData.map(({ UID, MName }) => {
                        return <Tag style={{ marginBottom: '8px' }} key={UID} onClick={() => this.handleClick(UID, MName)} >{MName}</Tag>
                    }) : <div className='noUser'>暂无人员</div>}
                </Card>
            </div>
        )
    }
}
