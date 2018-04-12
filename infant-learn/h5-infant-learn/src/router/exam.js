/**
 * Created by QiHan Wang on 2017/9/30.
 * exam
 */
import { AsyncComponent } from '../components';
// 考试系统功能
const AnswerStream = AsyncComponent(() => import('../views/examination/AnswerStream'));
const ExamResult = AsyncComponent(() => import('../views/examination/ExamResult'));
const ExamDetail = AsyncComponent(() => import('../views/examination/ExamDetail'));


export default [
  {
    path: '/examination',
    exact: true,
    component: AnswerStream
  },
  {
    path: '/examination/exam-result',
    component: ExamResult
  },
  {
    path: '/examination/exam-detail',
    component: ExamDetail
  },
]
