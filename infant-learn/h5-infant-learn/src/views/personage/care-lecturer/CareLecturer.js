import React from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd-mobile'
import LecturerDynamic from './LecturerDynamic'
import MyCareLecturer from './MyCareLecturer'
import './CareLecturer.scss'
const TabPane = Tabs.TabPane;

const CareLecturer = () => (
    <Tabs className="tab-config"
        defaultActiveKey="1"
        swipeable={false}
    >
        <TabPane tab={'讲师动态'} key="1">
            <LecturerDynamic fields={{ uid: 0 }} />
        </TabPane>
        <TabPane tab={'我关注的讲师'} key="2">
            <MyCareLecturer fields={{ st: 1 }} />
        </TabPane>
    </Tabs>
)
//限定控件传入的属性类型
CareLecturer.propTypes = {

}

//设置默认属性
CareLecturer.defaultProps = {

}
export default CareLecturer





