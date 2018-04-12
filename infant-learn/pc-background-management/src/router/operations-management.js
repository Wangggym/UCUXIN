/**
 * Created by QiHan Wang on 2017/8/12.
 */
import {AsyncComponent} from '../components';

const AuthorityManagement = AsyncComponent(() => import('../views/operations-management/authority-management'));
const LecturerManagement = AsyncComponent(() => import('../views/operations-management/lecturer-management'));
const SaveLecturer = AsyncComponent(() => import('../views/operations-management/lecturer-management/SaveLecturer'));
const ParkManagement = AsyncComponent(() => import('../views/operations-management/park-management'));
const ParkInfo = AsyncComponent(() => import('../views/operations-management/park-management/park-info'));
const Count = AsyncComponent(() => import('../views/operations-management/lecturer-management/count'));
const CreditCount = AsyncComponent(() => import('../views/operations-management/lecturer-management/credit-count'));
const UserNumCount = AsyncComponent(() => import('../views/operations-management/lecturer-management/userNum-count'));
const CourseCount = AsyncComponent(() => import('../views/operations-management/lecturer-management/course-count'));

export default [
  {
    path: '/authority-management',
    exact: true,
    component: AuthorityManagement
  },
  {
    path: '/lecturer-management',
    exact: true,
    component: LecturerManagement
  },
  {
    path: `/lecturer-management/:id${'-lecturer'}`, // add and edit
    component: SaveLecturer
  },
  {
    path: '/park-management',
    component: ParkManagement
  },
  {
    path: '/park-info/:id',
    component: ParkInfo
  },
  {
    path:'/count',
    component:Count
  },
  {
    path:'/credit-count',
    component:CreditCount
  },
  {
    path:'/userNum-count',
    component:UserNumCount
  },
  {
    path: '/course-count',
    component: CourseCount
  }
]


