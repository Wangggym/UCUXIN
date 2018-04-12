import React, { Fragment } from "react";
import * as styles from './page.less';
import { SearchComp, LoadingComp, HeadBarComp } from '../../components'
import router from 'umi/router';
import api from '../../api'
import { Toast } from 'antd-mobile';
import kong from '../../public/assets/kong@2x.png'

const picObject = {
    '1': 'pic_1',
    '2': 'pic_2',
    '3': 'pic_3',
    '4': 'pic_4',
    '5': 'pic_5',
    '6': 'pic_6',
    '7': 'pic_7',
    '8': 'pic_8',
    '9': 'pic_9',
}


export default class CourseList extends React.Component {
    state = {
        list: [],
        loading: true,
        headMessage: {
            ID: '',
            SubjectName: '',
            CoursePeriodName: '',
        },
        showHead: false,
        firstLoading: true,
    }

    handleSearchFocus = () => {
        router.push('/searchList')
    }

    componentDidMount() {
        api.GetCoursePackageList().then(res => {
            if (res.Ret === 0) {
                this.setState({ list: res.Data, loading: false, firstLoading: false })
            } else {
                res && Toast.info(res.Msg)
            }
        })
        if (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).MTypeID !== 11) {
            api.GetLastLearnRecode().then(res => {
                if (res.Ret === 0) {
                    if (res.Data) this.setState({ headMessage: res.Data, showHead: true })
                } else {
                    res && Toast.info(res.Msg)
                }
            })
        }

    }

    handleLinkto = (coursePackageID) => {
        router.push('/catalog?coursePackageID=' + coursePackageID)
    }

    //关闭headBar
    handleClose = () => {
        this.setState({ showHead: false })
    }

    //观看上一次router headBar
    handleLastLinkTo = () => {
        const { headMessage: { ID } } = this.state
        router.push('/learnCourse?coursePeriodID=' + ID)
    }


    render() {
        const { list, loading, headMessage, showHead, firstLoading } = this.state
        return <div className={styles.courseList}>
            {showHead && <HeadBarComp
                value={headMessage}
                onClose={this.handleClose}
                onClick={this.handleLastLinkTo}
            />}
            <SearchComp linkto onFocus={this.handleSearchFocus} />
            <div className={styles.content}>
                {list && list.length !== 0 ? list.map(({ PicIndex, ID, Pic, SubjectName, CoursePeriodCnt, CoursePackageName, LearnUserCnt, LearnProgress, }, index) =>
                    <div className={styles.item} key={index} onClick={() => this.handleLinkto(ID)}>
                        <div className={styles[picObject[PicIndex.toString()]]}>
                            <div className={styles.pic}>
                                <img src={Pic} alt="" />
                            </div>
                            <div className={styles.content}>
                                <h4>{CoursePackageName}(共{CoursePeriodCnt}节)</h4>
                                <span>{LearnUserCnt}人学习</span>
                            </div>
                        </div>
                    </div>
                ) : <NotData firstLoading={firstLoading} />}
                {loading && <LoadingComp />}
            </div>
        </div>
    }
}

const NotData = ({ firstLoading }) => {
    return <div className={styles.notfound}>
        {!firstLoading && <Fragment>
            <img src={kong} alt="" />
            <p>没有找到你想要的课程</p>
        </Fragment>}
    </div>
}







