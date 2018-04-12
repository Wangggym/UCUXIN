/**
 * Created by QiHan Wang on 2017/8/12.
 */
import React from 'react';

import breadcrumbNameMap from './breadcrumb';
import NotFoundPage from '../views/other/NotFoundPage';
import CreditManagement from '../views/credit-management'
import ParkInfo from '../views/parkInfo/index'
import EditorParkInfo from '../views/parkInfo/EditorParkInfo'
import ScoreManagement from '../views/score-management'
import ScoreDetail from '../views/score-management/ScoreDetail'
import BuyCourseStatistics from '../views/BuyCourseStatistics/BuyCourseStatistics'
import BuyCourseStatisticsDetail from '../views/BuyCourseStatistics/BuyCourseStatisticsDetail'
import TrainLearnManagement from '../views/TrainLearnManagement/TrainLearnManagement'
const routers = [
  {
    path: '/',
    exact: true,
    component: () => <div>资源组织平台</div>
  },
  {
    path: '/credit-management',
    component: CreditManagement
  },
  {
    path: '/parkInfo',
    component: ParkInfo
  },
  {
    path: '/editor-parkInfo/:id',
    component: EditorParkInfo
  },
  {
    path: '/editor-parkInfo',
    component: EditorParkInfo
  },
  //学分统计
  {
    path: '/score-management',
    component: ScoreManagement
  },
  //学分统计详情
  {
    path: '/ScoreDetail/:uid',
    component: ScoreDetail
  },

  //培训学习统计
  {
    path: '/TrainLearnManagement',
    component: TrainLearnManagement
  },


  //课程购买统计
  {
    path: '/BuyCourseStatistics',
    component: BuyCourseStatistics
  },

  //课程购买统计详情
  {
    path: '/BuyCourseStatisticsDetail/:uid',
    component: BuyCourseStatisticsDetail
  },

  {
    path: '/404',
    component: NotFoundPage
  }
];
export default routers;
export {breadcrumbNameMap};
