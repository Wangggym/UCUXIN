import React from 'react'
import PropTypes from 'prop-types'
import {NoContent, NoContentImg} from '../index'
import {Toast, ListView} from 'antd-mobile'

//******************************************** */
//      上拉下拉请求数据高阶控件
//******************************************** */

const T_Time = 0.3

function LongListWrappedComp(api, fields, getNewFields) {
  return function (Comp) {
    class FormComponent extends React.Component {
      constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
        this.state = {
          dataSource,
          isLoading: true,
          pIndex: 1,
          pSize: props.pSize || 15,
          TotalRecords: 0,
          hasMore: true,
          stopAsk: false,
          firstLoading: false,
        }
        this.api = api || this.props.api
        this.getCount = 0
        this.ViewModelList = {}
      }

      componentDidMount() {
        this.setState({firstLoading: true})
        this.getList()
      }

      componentWillReceiveProps(nextProps) {
        if (nextProps.forceUpdata !== this.props.forceUpdata) {
          this.setState({dataSource: this.state.dataSource.cloneWithRows({})}, () => this.getList(1, nextProps.fields))
        }
      }

      getList(pIndex = this.state.pIndex, newFields = this.props.fields || fields) {
        //参数变更方法=。=！服务后台变态的字段变更
        getNewFields && getNewFields({pIndex, pSize: this.state.pSize, ...newFields})
        let initData = {pIndex, pSize: this.state.pSize, ...newFields}
        if (getNewFields) {
          initData = getNewFields({pIndex, pSize: this.state.pSize, ...newFields})
        }
        this.api(initData).then(res => {
          this.setState({firstLoading: false, isLoading: false})
          if (!res) return
          if (res.Ret === 0) {
            if (!res.Data) return
            const {PageSize, TotalRecords, PageIndex, Pages, ViewModelList} = res.Data
            let hasMore = true
            if (Pages === PageIndex || TotalRecords === 0) hasMore = false
            if (pIndex === 1) {
              this.ViewModelList = this.getViewModelList(ViewModelList, PageIndex)
            } else {
              this.ViewModelList = {...this.ViewModelList, ...this.getViewModelList(ViewModelList, PageIndex)}
            }
            this.setState({
              pSize: PageSize, TotalRecords, pIndex: PageIndex, Pages, hasMore,
              dataSource: this.state.dataSource.cloneWithRows(this.ViewModelList),
            })
          }
        })
      }

      getViewModelList(ViewModelList, pIndex = 1) {
        const rData = {}
        ViewModelList && ViewModelList.length && ViewModelList.forEach((item, index) => {
          const thisIndex = (pIndex - 1) * this.state.pSize + index
          rData[thisIndex] = item
        })
        return rData
      }

      onEndReached = (event) => {
        // console.log(event)
        if (!this.state.hasMore || this.state.loading) return
        if (this.state.stopAsk) return
        this.setState({isLoading: true});
        this.getList(this.state.pIndex + 1)


        const newCount = this.getCount + 1
        this.getCount = newCount
        if (this.getCount === 1) this.startTime = new Date().getTime()
        if (this.getCount === 3) {
          this.preventMoreAsk()
          this.setState({hasMore: false})
        }
      }


      preventMoreAsk() {
        this.getCount = 0
        if (new Date().getTime() - this.startTime < 200) {
          this.setState({stopAsk: true})
          this.timer = setTimeout(() => this.setState({stopAsk: false}), 10000)
          return
        }
      }

      handleRefresh = () => {
        this.getList(1)
      }

      handleRemove = (rowID) => {

      }

      render() {
        const {useBodyScroll, className, style, separatorClassName, height = '90vh'} = this.props
        const {hasMore, firstLoading} = this.state
        const separator = (sectionID, rowID) => (
          <div key={`${sectionID}-${rowID}`} className={separatorClassName || 'default-separator'}/>
        )

        const row = (rowData, sectionID, rowID,) => <Comp {...rowData} key={rowData.ID + rowID} {...this.props}
                                                          onRefresh={this.handleRefresh}
                                                          onRemove={() => this.handleRemove(rowID)}/>
        return (
          <ListView
            style={style}
            className={className}
            dataSource={this.state.dataSource}
            // renderHeader={()=><div>header</div>}
            renderFooter={() => {
              if (JSON.stringify(this.ViewModelList) == "{}" && !firstLoading) return <NoContentImg
                firstLoading={firstLoading}/>
              if (!hasMore) return <div style={{padding: 30, textAlign: 'center'}}/>
              return <div style={{padding: 30, textAlign: 'center'}}>
                {this.state.isLoading ? '加载中...' : '上拉加载'}
              </div>
            }}
            renderRow={row}
            renderSeparator={separator}
            pageSize={10}
            useBodyScroll={useBodyScroll}
            style={!useBodyScroll ? {height, overflow: 'auto'} : null}
            onScroll={() => {
              console.log('scroll');
            }}
            scrollRenderAheadDistance={500}
            scrollEventThrottle={200}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
          />
        );
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

export default LongListWrappedComp




































