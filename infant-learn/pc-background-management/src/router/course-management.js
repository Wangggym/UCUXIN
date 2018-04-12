/**
 * Created by QiHan Wang on 2017/8/12.
 */
import {AsyncComponent} from '../components';

const TrainingPlan = AsyncComponent(() => import('../views/course-management/training-plan'));
const AddTrainingPlan = AsyncComponent(() => import('../views/course-management/training-plan/AddTrainingPlan'));
const EditTrainingPlan = AsyncComponent(() => import('../views/course-management/training-plan/EditTrainingPlan'));
const AssignDetail = AsyncComponent(() => import('../views/course-management/training-plan/AssignDetail'));
const HaveSigUp = AsyncComponent(() => import('../views/course-management/training-plan/haveSignUp'));
const CourseManagement = AsyncComponent(() => import('../views/course-management/course-management'));
const MessageManagement = AsyncComponent(() => import('../views/course-management/message-management'));
const CreditManagement = AsyncComponent(() => import('../views/course-management/credit-management'));
const AreaDetail = AsyncComponent(() => import('../views/course-management/credit-management/area-detail'));
const ProjectDetail = AsyncComponent(() => import('../views/course-management/credit-management/project-detail'));
export default [
  {
    path: '/training-plan',
    exact: true,
    component: TrainingPlan
  },
  //新增培训计划
  {
    path: '/add-training-plan',
    component: AddTrainingPlan
  },
  //编辑培训计划
  {
    path: '/edit-training-plan',
    component: EditTrainingPlan
  },
  //指派详情
  {
    path: '/assign-detail',
    component: AssignDetail
  },
  //已报名人数
  {
    path: '/have-sign-up',
    component: HaveSigUp
  },

  {
    path: '/course-management',
    component: CourseManagement
  },
  //消息管理
  {
    path: '/message-management',
    component: MessageManagement
  },
  //学分管理
  {
    path: '/credit-management',
    component: CreditManagement
  },
  {
    path: '/area-detail/:PID',
    component: AreaDetail
  },
  {
    path: '/project-detail/:planID',
    component: ProjectDetail
  },

]


