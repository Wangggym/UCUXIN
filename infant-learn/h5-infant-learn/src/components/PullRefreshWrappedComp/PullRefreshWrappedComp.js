import React from 'react'
import PropTypes from 'prop-types'
import {ButtonGroup, NoContent} from '../index'
import ReactPullLoad, {STATS} from 'react-pullload'
import {Toast} from 'antd-mobile'
//******************************************** */
//      上拉下拉请求数据高阶控件
//******************************************** */
const T_Time = 0.3

function PullRefreshWrappedComp(api, fields) {
  return function (Comp) {
    class FormComponent extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          pIndex: 1,
          pSize: props.pSize || 10,
          TotalRecords: 0,
          ViewModelList: [],
          firstLoading: false,
          //pull to refresh
          hasMore: true,
          action: STATS.init,

        }
        this.api = api || this.props.api
      }

      componentDidMount() {
        this.getList()
      }

      componentWillReceiveProps(nextProps) {
        if (nextProps.forceUpdata !== this.props.forceUpdata) {
          this.getList(1, nextProps.fields)
        }
      }

      getList(pIndex = this.state.pIndex, newFields = this.props.fields || fields) {
        Toast.loading("刷新", 0)
        this.setState({firstLoading: true})
        this.api({pIndex, pSize: this.state.pSize, ...newFields}).then(res => {
          setTimeout(() => (Toast.hide()), T_Time * 1000)
          this.setState({firstLoading: false})
          if (!res) return
          if (res.Ret === 0) {
            if (!res.Data) return
            const {PageSize, TotalRecords, PageIndex, Pages, ViewModelList} = res.Data
            this.setState({pSize: PageSize, TotalRecords, pIndex: PageIndex, Pages, ViewModelList, hasMore: true})
          }
        })
      }

      //分页
      handleAction = (action) => {
        console.info(action, this.state.action, action === this.state.action);
        //new action must do not equel to old action
        if (action === this.state.action ||
          action === STATS.refreshing && this.state.action === STATS.loading ||
          action === STATS.loading && this.state.action === STATS.refreshing) {
          console.info("It's same action or on loading or on refreshing ", action, this.state.action, action === this.state.action);
          return false
        }
        if (action === this.state.action ||
          action === STATS.refreshing && this.state.action === STATS.loading ||
          action === STATS.loading && this.state.action === STATS.refreshing) {
          console.info("It's same action or on loading or on refreshing ", action, this.state.action, action === this.state.action);
          return false
        }
        if (action === STATS.refreshing) {//刷新
          // setTimeout(() => {
          //   //refreshing complete
          //   this.setState({hasMore: true, action: STATS.refreshed});
          // }, T_Time * 1000)
        } else if (action === STATS.loading) {//加载更多

          this.setState({hasMore: true});
          const {pIndex, Pages} = this.state
          if (Pages === pIndex) {

            setTimeout(() => {
              this.setState({action: STATS.reset, hasMore: false})
            }, T_Time * 1000)

          } else {
            const newFields = this.props.fields || fields
            this.api({pIndex: pIndex + 1, pSize: this.state.pSize, ...newFields}).then((res) => {
              if (!res) return
              if (res.Ret === 0) {
                setTimeout(() => {
                  this.setState({action: STATS.reset})
                }, T_Time * 1000)
                if (!res.Data) return
                const {ViewModelList, PageSize, TotalRecords, PageIndex, Pages} = res.Data
                this.setState({
                  ViewModelList: [...this.state.ViewModelList, ...ViewModelList],
                  pIndex: PageIndex,
                  TotalRecords,
                  Pages,
                })
              }
            })
          }



        }
        //DO NOT modify below code
        this.setState({action: action})
      }

      render() {
        const {ViewModelList, hasMore, firstLoading} = this.state
        const {style} = this.props
        return (
          <ReactPullLoad
            downEnough={1} //下拉距离
            ref="reactpullload"
            className="block"
            isBlockContainer={false}
            action={this.state.action}
            handleAction={this.handleAction}
            hasMore={hasMore} //是否还有更多可加载的内容
            style={{style}}
            distanceBottom={1} //距离底部距离触发加载更多
          >
            {ViewModelList && ViewModelList.length ? ViewModelList.map((item, index) => {
              return <Comp {...item} key={index} {...this.props}/>
            }) : <NoContent firstLoading={firstLoading}/>}
          </ReactPullLoad>
        )
      }
    }

    //*****************************************限定控件传入的属性类型--说明书 */
    FormComponent.PropTypes = {
      api: PropTypes.func.isRequired,     //api接口
      fields: PropTypes.object,           //需要再新加入的字段
    }

    return FormComponent
  }
}

export default PullRefreshWrappedComp
