/**
 * Created by xj on 2017/9/5.
 */
import React, {Component} from 'react';
import {Button, Popup, Toast,ListView} from 'antd-mobile';
import ReactStars from 'react-stars';
import {NoContent} from '../index'

class FormComponent extends React.Component {
    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
        this.state = {
            dataSource,
            isLoading: true,
            pIndex: 1,
            pSize: props.pSize || 10,
            TotalRecords: 0,
            hasMore: true,
            stopAsk: false,
            firstLoading: false,

        }
        this.api = this.props.api
        this.getCount = 0
        this.ViewModelList = {}
    }

    componentDidMount() {
        this.setState({firstLoading: true})
        this.getList()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.forceUpdata !== this.props.forceUpdata) {
            this.getList(1, nextProps.fields)
        }
    }

    getList(pIndex = this.state.pIndex, newFields = this.props.fields) {
        this.api({pIndex, pSize: this.state.pSize, ...newFields}).then(res => {
            this.setState({firstLoading: false, isLoading: false, hasMore: false})
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

        const row = (rowData, sectionID, rowID,) => <DiscussListPage {...rowData} key={rowID} {...this.props}
                                                          onRefresh={this.handleRefresh}
                                                          onRemove={() => this.handleRemove(rowID)}/>
        return (
            <ListView
                style={style}
                className={className}
                dataSource={this.state.dataSource}
                renderFooter={() => {
                    if (JSON.stringify(this.ViewModelList) == "{}") return <NoContent
                        firstLoading={firstLoading}/>
                    if (!hasMore) return
                    return <div style={{padding: 30, textAlign: 'center'}}>
                        {this.state.isLoading ? '加载中...' : '上拉加载'}
                    </div>
                }}
                renderRow={row}
                renderSeparator={separator}
                pageSize={4}
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

class DiscussListPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
//回复
  toDiscuss(uid, type) {
    this.props.toDiscuss(uid, type);
  }
    render() {
        let item = this.props
        return (
            <div className="discuss-info">
                <div className="discuss-person-info">
                    <div className="logo-info">
                        <img src={item.HeadPic} alt=""/>
                    </div>
                    <div className="name-star">
                        <span>{item.Name}</span>
                        <span className="stars-score">评分&nbsp;&nbsp;
                            <ReactStars
                                className="starts-component"
                                value={+item.StarCount}
                                count={5}
                                edit={false}
                                size={0.2}
                                color1={"grey"}
                                color2={'#ffc700'}/>
                                            </span>

                    </div>
                    <div className="reply-time">
                        <div className="reply-operation">
                          {/*回复按钮，不需要了（ui图有，后台说不需要）*/}
                            {/*<i/>*/}
                            {/*<a onClick={() => this.toDiscuss(item.ID, item.DisType)}>{item.DisType === "1" ? "评价" : "回复"}</a>*/}
                        </div>
                        <div className="tiem-show">
                            {item.CDate.substring(5, 16)}
                        </div>
                    </div>
                </div>
                <div className="discuss-person-text">
                    {item.Cnt}
                </div>
                <DiscussList item={item}/>
            </div>
        )
    }
}

//评论列表
class DiscussList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReDiscussInfo: false//是否显示全部留言
    }
  }

  //更多留言
  moreReDiscussInfo() {
    this.setState({showReDiscussInfo: !this.state.showReDiscussInfo})
  }

  render() {
    const {showReDiscussInfo} = this.state;
    const {item} = this.props;
    return (
      <div className="discuss-person-everyone">
        <div className={!showReDiscussInfo ? "current-block" : "current-none"}>
          <span>{item.ReDiscussInfo.length >= 1 && item.ReDiscussInfo[0].Name + ':'}</span>{item.ReDiscussInfo.length >= 1 && item.ReDiscussInfo[0].Cnt}
        </div>
        <div className={!showReDiscussInfo ? "current-block" : "current-none"}>
          <span>{item.ReDiscussInfo.length >= 2 && item.ReDiscussInfo[1].Name + ':'}</span>{item.ReDiscussInfo.length >= 2 && item.ReDiscussInfo[1].Cnt}
        </div>
        {
          showReDiscussInfo && item.ReDiscussInfo.map((e, i) => {
            return (
              <div key={i}>
                <span>{e.Name}</span>:{e.Cnt}
              </div>
            )
          })
        }
        <div className={item.ReDiscussInfo.length>2 ? "current-block" : "current-none"}>
          <a onClick={() => this.moreReDiscussInfo()}>
            <span>{showReDiscussInfo ? "收起" : " 更多"}留言 ></span>
          </a>
        </div>
      </div>
    )
  }
}
export default FormComponent;
