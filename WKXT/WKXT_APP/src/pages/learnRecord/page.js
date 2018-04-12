import React from 'react'
import style from './page.less'
import { CourseItem, GoToStudy, isTeacherPortFunc } from '../../components'
import api from '../../api'
import router from 'umi/router'

export default class LearnRecord extends React.Component {
    state = {
        list: [],
        firstLoading: true
    }
    componentWillMount() {
        if (!isTeacherPortFunc()) document.title = '观看记录'
    }

    componentDidMount() {
        api.GetTodayLearn().then(res => {
            if (res.Ret === 0) {
                this.setState({ ...res.Data })
            }
        })
        api.GetPlayRecordList().then(res => {
            if (res.Ret === 0) {
                this.setState({ list: res.Data, firstLoading: false })
            }
        })
    }

    render() {
        const { IsLearn = false, IsWeekLearn = false, LearnSeconds = 0, Point = 0, PointRank = 0, RuleRemind = '', list = [], firstLoading } = this.state
        return <div>
            {(sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).MTypeID !== 11) &&
                <div className={style.remind}>
                    <span className={'overflow-hidden'}>
                        今日学习:{RuleRemind}
                    </span>
                    <span className={style.ball} onClick={() => router.push('/pointsRuler')}>
                        <span>?</span>
                    </span>
                    <div onClick={() => router.push('/thisWeekRank')}>
                        <span className={style.ranking} />
                        本周排名
                </div>
                </div>}
            {(sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).MTypeID !== 11) &&
                <div className={style.data}>
                    <div className={style.item}>
                        <div>{(LearnSeconds / 60).toFixed(2)}<span>分钟</span></div>
                        <span>学习时长</span>
                    </div>
                    <div className={style.item}>
                        <div>{Point}</div>
                        <span>所获积分</span>
                    </div>
                    <div className={style.item}>
                        <div>{PointRank || '暂无'}</div>
                        <span>积分排名</span>
                    </div>
                </div>}
            <div className={style.courseList}>
                {
                    list && list.length ? list.map((item) => <CourseItem {...item} modal={'learnRecord'} />) :
                        <GoToStudy firstLoading={firstLoading} isWatch/>
                }
            </div>
        </div>
    }
}


