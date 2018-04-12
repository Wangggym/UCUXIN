import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import './YoungCoin.scss'
import {Icon, Picker} from 'antd-mobile'
import config from '../../../config'
import YoungCoinRecordList from './YoungCoinRecordList'
import {trainPlan} from '../../../api'
import moment from 'moment'

let NowMonth = moment(new Date()).format("MM");
const seasons = [
  {
    label: NowMonth+"月",
    value: '0',
  },
  {
    label: NowMonth-1+"月",
    value: '1',
  },
  {
    label: NowMonth-2+"月",
    value: '2',
  },
];
export default class YoungCoin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dateType: "0",
      dateTypeText: NowMonth+"月",
      forceUpdata: true
    }
  }


  sureMonth = (value) => {
    // console.log(value)
    this.setState({dateType: value[0]}, () => this.setDateTypeText())
  }
  setDateTypeText = () => {
    //强制刷新重新获取数据
    this.setState({
      forceUpdata: !this.state.forceUpdata
    });
    const {dateType} = this.state;
    switch (dateType) {
      case "0":
        this.setState({dateTypeText: NowMonth+"月"});
        break;
      case "1":
        this.setState({dateTypeText: NowMonth-1+"月"});
        break;
      case "2":
        this.setState({dateTypeText: NowMonth-2+"月"})
        break;
    }
  };

  render() {
    const {dateType, dateTypeText} = this.state;
    return (
      <div className='young-coin'>
        <Link className='icon' to='/young-coin-rule'>
          幼学币？
        </Link>
        <div className='total'>
          <div>{this.props.match.params.count}</div>
          <span>累积幼学币</span>
        </div>
        {/* <div className='btn'>
                    <Button size='large'>幼学币兑换</Button>
                </div> */}
        {/*<Accordion defaultActiveKey='1' openAnimation={{}} accordion={false}>*/}
        {/*<Accordion.Panel header="幼学币记录" key='1'>*/}
        {/*<YoungCoinRecordList fields={{dateType: 0, detailType: 0, appID: config.appId}}*/}
        {/*api={trainPlan.getCurUserPointDetails} height="67vh"/>*/}
        {/*</Accordion.Panel>*/}
        {/*</Accordion>*/}
        <Picker data={seasons} cols={1} className="forss" onChange={(value) => this.sureMonth(value)}>
          <div className="switch-month">
            <span>幼学币记录</span>
            <span className="month">{dateTypeText}<Icon type='down'/></span>
          </div>
        </Picker>

        <YoungCoinRecordList fields={{dateType: dateType, detailType: 0, appID: config.appId}}
                             forceUpdata={this.state.forceUpdata}
                             api={trainPlan.getCurUserPointDetails} height="67vh"/>
      </div>
    )
  }
}

//限定控件传入的属性类型z
YoungCoin.propTypes = {}

//设置默认属性
YoungCoin.defaultProps = {}
