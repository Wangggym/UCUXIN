import React, { Fragment } from 'react'
import style from './CourseItem.less'
import router from 'umi/router';
import { formatTimeFunc, isTeacherPortFunc } from '../index'
import moment from 'moment'
// 304 => 05:03

const CourseItem = ({
    modal = 'searchList', ID, CoursePeriodID, Pic,
    CoursePeriodName, SubjectName,
    CoursePackageName, onClose, Name,
    LearnUserCnt, LastPosition, LastCoursePeriodName, LastLearnTime, LastCoursePeriodID
}) => {
    const getModalComp = () => {
        let element = <Fragment></Fragment>
        if (modal === 'collectList') {
            element = <Fragment>
                <div className={style.close}>
                    <span onClick={(e) => {
                        e.stopPropagation()
                        onClose(CoursePeriodID)
                    }}></span>
                </div>
            </Fragment>
        }
        if (modal === 'learnRecord') {
            element = <Fragment>
                <div className={style.learningReport}>
                    <span>{isTeacherPortFunc() ? '最近学习' : '最近观看'}</span>
                    <div>{moment(LastLearnTime).format('YYYY-MM-DD hh:mm')}</div>
                </div>
                <div className={style.content}>
                    <span>已看至 {formatTimeFunc(LastPosition)}</span>
                </div>
            </Fragment>
        }
        if (modal === 'searchList') {
            element = <Fragment>
                <div className={style.content}>
                    <span>{LearnUserCnt}人学过</span>
                    <div>已看至 {formatTimeFunc(LastPosition)}</div>
                </div>
            </Fragment>
        }
        return element
    }
    return <div className={style.item + ' ' + style.activeClass}
        onClick={() => setTimeout(() => router.push(`/learnCourse?coursePeriodID=${CoursePeriodID || LastCoursePeriodID || ID}`), 300)}>
        <div>
            <img src={Pic} alt="" />
        </div>
        <span>
            <h4>{CoursePeriodName}{Name}{LastCoursePeriodName}</h4>
            <div>
                {modal !== 'learnRecord' && <p>[{SubjectName}]{CoursePackageName}</p>}
                {getModalComp()}
            </div>
        </span>
    </div>
}

export default CourseItem

