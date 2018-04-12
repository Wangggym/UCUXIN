import React from 'react'
import { Row, Col } from 'antd'
const ParkInfoItem = ({ label, content, type }) => {
    return (
        <Row className='park-info'>
            <Col span={4} className='park-label'>{label}:</Col>
            <Col span={16} className='park-content'>
                {
                    Array.isArray(content) && content.length ? content.map(({ ImgUrl, Desc }, index) => {
                        return (
                            <div key={index}>
                                <img src={ImgUrl} />
                                <span>描述:{Desc}</span>
                            </div>
                        )
                    }) : type === 'img' ? <img src={content} /> : content
                }
            </Col>

        </Row>
    )
}
export default ParkInfoItem