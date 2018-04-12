import React from 'react'
import ReactPullLoad, {STATS} from 'react-pullload'
import {NoContent,NoContentImg} from '../../components'

export default class PullRefreshComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pIndex: 1,
      pSize: props.pSize || 10,
      TotalRecords: 0,
      ViewModelList: [],
      firstLoading: false,
      hasMore: true,
      action: STATS.init,
    }
    this.api = this.props.api
  }

  componentDidMount() {
    this.getList()
  }


  getList(pIndex = this.state.pIndex, newFields = this.props.fields) {
    this.setState({firstLoading: true})
    this.api({pIndex, pSize: this.state.pSize, ...newFields}).then(res => {
      this.setState({firstLoading: false})
      if (!res) return
      if (res.Ret === 0) {
        if (!res.Data) return
        const {PageSize, TotalRecords, PageIndex, Pages, ViewModelList} = res.Data
        this.setState({pSize: PageSize, TotalRecords, pIndex: PageIndex, Pages, ViewModelList, hasMore: true})
      }
    })
  }

  handleAction = (action) => {
    console.info(action, this.state.action, action === this.state.action);
    //new action must do not equel to old action
    if (action === this.state.action ||
      action === STATS.refreshing && this.state.action === STATS.loading ||
      action === STATS.loading && this.state.action === STATS.refreshing) {
      console.info("It's same action or on loading or on refreshing ", action, this.state.action, action === this.state.action);
      return false
    }
    if (action === STATS.refreshing) {
      setTimeout(() => {
        //refreshing complete
        this.setState({action: STATS.refreshed});
      }, 500)
    } else if (action === STATS.loading) {//加载更多
      // this.setState({hasMore: true});


      this.setState({hasMore: true});
      const {pIndex, Pages, TotalRecords} = this.state
      if (Pages === pIndex || TotalRecords === 0) {
        setTimeout(() => {
          this.setState({action: STATS.reset, hasMore: false})
        }, 1000)
      } else {
        const newFields = this.props.fields
        this.api({pIndex: pIndex + 1, pSize: this.state.pSize, ...newFields}).then((res) => {
          if (!res) return
          if (res.Ret === 0) {
            this.setState({action: STATS.reset})
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
    this.setState({
      action: action
    })
  }


  render() {
    const {hasMore, ViewModelList, firstLoading} = this.state
    const {Comp} = this.props
    return (
      <ReactPullLoad
        downEnough={150}
        ref="reactpullload"
        className="block"
        isBlockContainer={true}
        action={this.state.action}
        handleAction={this.handleAction}
        hasMore={hasMore}
        distanceBottom={100}>
        {ViewModelList && ViewModelList.length ? ViewModelList.map((item, index) => {
          return <div key={index}>
            <Comp {...item} />
            <div className="default-separator"></div>
          </div>
        }) : <NoContentImg firstLoading={firstLoading}/>}
      </ReactPullLoad>
    )
  }
}
