import React from 'react'
import PropTypes from 'prop-types'
import { PullRefreshWrappedComp, NoAccordionCourse, T_Time, NoContent } from '../../components'
import { Toast } from 'antd-mobile'
export default class PlanList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ViewModelList: [],
            firstLoading: false,
        }
    }

    componentDidMount() {
        this.getList()
    }

    getList(pIndex = this.state.pIndex, newFields = this.props.fields) {
        Toast.loading("刷新", 0)
        this.setState({ firstLoading: true })
        this.props.api({ pIndex: 1, pSize: 1000, ...newFields }).then(res => {
            setTimeout(() => (Toast.hide()), T_Time * 500)
            this.setState({ firstLoading: false })
            if (!res) return
            if (res.Ret === 0) {
                if (!res.Data) return
                const { PageSize, TotalRecords, PageIndex, Pages, ViewModelList } = res.Data
                this.setState({ pSize: PageSize, TotalRecords, pIndex: PageIndex, Pages, ViewModelList })
            }
        })
    }

    render() {
        const { ViewModelList, firstLoading } = this.state
        return (
            <div>
                {ViewModelList && ViewModelList.length ? ViewModelList.map((item, i) => <NoAccordionCourse key={i} {...item} />) : <NoContent firstLoading={firstLoading} />}
            </div>
        )
    }
}

//限定控件传入的属性类型
PlanList.propTypes = {

}

//设置默认属性
PlanList.defaultProps = {

}
