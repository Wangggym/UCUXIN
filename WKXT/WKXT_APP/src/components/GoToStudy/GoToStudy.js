import React, { Fragment } from 'react'
import cartoon from '../../public/assets/ace536f61d8682bd04c91500e5725756@2x.png'
import style from './GoToStudy.less'
import router from 'umi/router';
import { isTeacherPortFunc } from '../index'
const GoToStudy = ({ firstLoading, isWatch }) => <div className={style.noContent}>
    {!firstLoading && <Fragment>
        <img src={cartoon} alt="" />
        <p>
            {isTeacherPortFunc() ? `你还未学习过，没有记录， 好成绩钟情勤学的人` : `你还未${isWatch ? '观看' : '收藏'}过，没有相关记录`}
        </p>
        <p>{isTeacherPortFunc() ? '点击这里去学习' : '点击这里去观看'}</p>
        <div className={style.button} onClick={() => router.push('/courseList')}>
            {isTeacherPortFunc() ? '去学习' : '去观看'}
        </div>
    </Fragment>}
</div>

export default GoToStudy