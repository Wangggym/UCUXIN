/**
 * Created by QiHan Wang on 2017/8/12.
 */
import {AsyncComponent} from '../components';
import home from './home';               // 运营管理
import courserDetail from './courseDetail';
import examine from './examine';   // 审核
import exam from './exam';         //考试系统


const TrainLearn = AsyncComponent(() => import('../views/train-learn'));
const TrainCourse = AsyncComponent(() => import('../views/train-learn/train-course/TrainCourse'));
const Courseware = AsyncComponent(() => import('../views/train-learn/train-course/Courseware'));
const ParkList = AsyncComponent(() => import('../views/demonstration-garden/ParkList'));
const ParkDetail = AsyncComponent(() => import('../views/demonstration-garden/ParkDetail'));
const PersonHomePage = AsyncComponent(() => import('../views/personage/PersonHomePage'));
const PersonHomePageDetail = AsyncComponent(() => import('../views/personage/PersonHomePageDetail'));
const YoungCoin = AsyncComponent(() => import('../views/personage/YoungCoin/YoungCoin'));
const YoungCoinRule = AsyncComponent(() => import('../views/personage/YoungCoin/YoungCoinRule'));
const Mycollect = AsyncComponent(() => import('../views/personage/my-collect/Mycollect'));
const MyCourse = AsyncComponent(() => import('../views/personage/my-course/MyCourse'));
const PurchaseRecord = AsyncComponent(() => import('../views/personage/my-course/PurchaseRecord'));//购买记录
const CareLecturer = AsyncComponent(() => import('../views/personage/care-lecturer/CareLecturer'));
const MyAchievement = AsyncComponent(() => import('../views/personage/my-achievement/MyAchievement'));
const PersonListInfo = AsyncComponent(() => import('../views/personage/personList-info/PersonListInfo'));
const YoungScore = AsyncComponent(() => import('../views/personage/young-score/YoungScore'));
const TrainScore = AsyncComponent(() => import('../views/personage/train-score/TrainScore'));


const ExpertMmienList = AsyncComponent(() => import('../views/expert-mien/ExpertMmienList'));
const TrainNotice = AsyncComponent(() => import('../views/train-notice/TrainNotice'));
const Apply = AsyncComponent(() => import('../views/train-notice/Apply'));
const ExpertMmienDetail = AsyncComponent(() => import('../views/expert-mien/ExpertMmienDetail'));

const routers = [
  ...home,
  ...courserDetail,
  ...examine,  // 审核系统
  ...exam,     // 考试系统
  //培训学习
  {
    path: '/train-learn/:courseType',
    component: TrainLearn
  },
  {
    path: '/train-course/:planID',
    component: TrainCourse
  },
  //专辑
  {
    path: '/course-ware/:courseID',
    component: Courseware
  },
  //名师示范课
  {
    path: '/model-class',
    component: TrainLearn
  },
  //示范园所
  {
    path: '/parkList',
    component: ParkList
  },
  {
    path: '/parkDetail/:gardenID',
    component: ParkDetail
  },

  //个人
  {
    path: '/personage',
    component: PersonHomePage
  },
  //个人详情
  {
    path: '/person-homePageDetail',
    component: PersonHomePageDetail,
  },
  //培训学分
  {
    path: '/train-score/:isView',//0培训学分  1查看报表详情（从原生App首页进的培训学分）
    component: TrainScore,
  },
  //幼学学分
  {
    path: '/young-score',
    component: YoungScore,
  },
  //幼学币
  {
    path: '/young-coin/:count',
    component: YoungCoin,
  },
  //幼学币说明
  {
    path: '/young-coin-rule',
    component: YoungCoinRule,
  },
  //个人成就
  {
    path: '/personList-achievement',
    component: MyAchievement,
  },
  //个人简历
  {
    path: '/personList-info',
    component: PersonListInfo,
  },
  //我的收藏
  {
    path: '/personList-favorite',
    component: Mycollect,
  },
  //我的课程
  {
    path: '/personList-course',
    component: MyCourse,
  },
  //购买记录
  {
    path: '/purchase-record',
    component: PurchaseRecord,
  },
  //我关注的讲师
  {
    path: '/personList-lecturer',
    component: CareLecturer,
  },
  //公告
  {
    path: '/train-notice/:trainPlanID/:gId',
    component: TrainNotice
  },
  //报名
  {
    path: '/apply/:trainPlanID/:ID/:gId',
    component: Apply,
  },
  {
    path: '/expert-mien',
    component: ExpertMmienList,
  },
  // 专家详情
  {
    path: '/expert-detail/:lecturerID',
    component: ExpertMmienDetail,
  },


];
export default routers;
