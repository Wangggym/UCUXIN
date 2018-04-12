import React from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd-mobile'
import CollectCourse from './CollectCourse'
import CollectPlan from './CollectPlan'
const TabPane = Tabs.TabPane;

export default class Mycollect extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div>
                {/*<Tabs*/}
                    {/*defaultActiveKey="1"*/}
                    {/*swipeable={false}*/}
                {/*>*/}
                    {/*<TabPane tab={'收藏计划'} key="1">*/}
                        {/*<CollectPlan/>*/}
                    {/*</TabPane>*/}
                    {/*<TabPane tab={'收藏课程'} key="2">*/}
                        {/*<CollectCourse />*/}
                    {/*</TabPane>*/}
                {/*</Tabs>*/}
              <CollectCourse />
            </div>
        )
    }
}


//限定控件传入的属性类型
Mycollect.propTypes = {

}

//设置默认属性
Mycollect.defaultProps = {

}


