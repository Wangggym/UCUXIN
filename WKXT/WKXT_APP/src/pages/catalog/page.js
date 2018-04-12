import React from 'react'
import style from './page.less'
import router from 'umi/router';
import api from '../../api'
import {formatTimeFunc} from '../../components'
export default class Catalog extends React.Component {
    state = {
        list: []
    }

    componentDidMount() {
        const {query: {coursePackageID = '0'}} = this.props.location
        api.GetCourseCatalog({coursePackageID}).then(res => {
            if (res.Ret == 0) {
                this.setState({list: res.Data})
            }
        })
    }

    //跳转
    handleClick = (coursePeriodID) => {
        router.push('/learnCourse?coursePeriodID=' + coursePeriodID)
    }


    render() {
        const {list = []} = this.state
        return <div>
            {list && list.length ? list.map((wrap1, index) => {
                    const {Name, IsHaveData, CourseCatalogs, CoursePeriodInfo} = wrap1
                    return (
                        <div className={style.item} key={index}>
                            {IsHaveData && <div className={style.title}>
                              <span className={style.left}>
                                  第{index + 1}章
                                </span>
                                <span className={style.content}>
                                    {Name}
                                </span>
                            </div>}
                            {CourseCatalogs && CourseCatalogs.length ? CourseCatalogs.map((wrap2, wrap2Index) =>
                                <div className={style.page}>
                                    {wrap2.IsHaveData && <div className={style.title} key={wrap2Index}>
                                        <span>第{wrap2Index + 1}节</span>
                                        <div>{wrap2.Name}</div>
                                    </div>}
                                    <div className={style.content}>
                                        {wrap2.CourseCatalogs && wrap2.CourseCatalogs.length ? wrap2.CourseCatalogs.map((item, itemIndex) => {
                                            const {CoursePeriodInfo: {Duration, IsTrial, IsPlayed, IsLastPlay}} = item
                                            return <div className={style.item + ' result-active'}
                                                        key={itemIndex}
                                                        onClick={() => {
                                                            this.handleClick(item.CoursePeriodInfo.CoursePeriodID)
                                                        }}>
                                                <span
                                                    className={`${IsLastPlay ? style.lately : null} ${IsPlayed ? style.hasSee : null}`}>{itemIndex + 1} {item.Name}</span>
                                                <div className={IsTrial ? style.tryAndSee : null}>{formatTimeFunc(Duration)}</div>
                                            </div>
                                        }) : null}
                                    </div>
                                </div>
                            ) : null}
                        </div>)
                }
            ) : null}
        </div>
    }
}