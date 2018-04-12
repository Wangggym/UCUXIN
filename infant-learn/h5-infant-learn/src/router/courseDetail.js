/**
 * Created by WangBin on 2017/9/6.
 */

import {AsyncComponent} from '../components';

const CourserDetail = AsyncComponent(() => import('../views/train-learn/courser-detail/record-course'));
const SignIn = AsyncComponent(() => import('../views/train-learn/courser-detail/record-course/SignIn'));
const PayCourse = AsyncComponent(() => import('../views/train-learn/courser-detail/pay-course'));
const PayResult = AsyncComponent(() => import('../views/train-learn/courser-detail/pay-result'));
// const ViewReport = AsyncComponent(() => import('../views/view-report'));

export default [
  {
    path: '/course-detail/:courseID',
    exact:true,
    component: CourserDetail
  },
  {
    path: '/pay-course/:orderId?/:url?',
    exact:true,
    component: PayCourse
  },
  {
    path: '/pay-result',
    exact:true,
    component: PayResult
  },
  {
    path: '/sign-in/:courseID',
    exact:true,
    component: SignIn
  },
  // {
  //   path: '/search-report',
  //   exact:true,
  //   component: ViewReport
  // }
]
