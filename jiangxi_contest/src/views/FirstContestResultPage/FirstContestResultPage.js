import React from 'react'
import bc213 from '../../assets/images/bc213.png'
import text123 from '../../assets/images/text123.png'
import Api from '../../api'
import {Toast} from 'antd-mobile'

class FirstContestResultPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        Toast.loading('加载中...', 999)
        Api.GetPreliminaryResult({umid: this.props.match.params.umid}).then(res => {
            setTimeout(() => Toast.hide(), 200)
            if (!res) return;
            if (!res.Data) return;
            if (res.Ret === 0) {
                this.setState({...res.Data})
            } else {
                Toast.fail(res.Msg)
                setTimeout(() => {
                    Toast.hide()
                }, 1500)
            }
        })
    }

    render() {
        const {Score = 0, UsingTime = 0, CanTest = false} = this.state
        //时间显示转换
        const getTime = (time) => {
            const millisecond = time % 1000 //毫秒数  单位ms
            const remainSecond = (time - millisecond) / 1000 //余下的秒数  单位s
            const second = remainSecond % 60//秒数 单位s
            const minute = (remainSecond - second) / 60 //分数 单位m
            const newTime = minute ? minute + '分' + second + '秒' + Math.round(millisecond / 10) : second + '秒' + Math.round(millisecond / 10)
            return newTime
        }
        return <div className="FirstContestResultPage">
            <div className="top">
                <img src={bc213} alt=""/>
                <div className="title">
                    <img src={text123} alt=""/>
                </div>
                <div className="text">初赛成绩满分且区/县前20名选手<br/>有资格参加网络复赛噢～</div>
            </div>
            <div className="wrap">
                <div className="exam-data">
                    <div>
                        <div className="exam-data-title">您在本次初赛中的最终成绩为</div>
                        <div className="score"><span>{Score}分</span>（用时{getTime(UsingTime)}）</div>
                        {/*{Rank ? <div className="score">排名第{Rank}位</div> : null}*/}
                    </div>
                </div>
            </div>
            <div className="footer">{CanTest ? '恭喜您获得复赛资格！' : '很遗憾，您未获得复赛资格~'}</div>
        </div>
    }
}

export default FirstContestResultPage