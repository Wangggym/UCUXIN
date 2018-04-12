/**
 * Created by QiHan Wang on 2017/8/12.
 */
import asyncComponent from '../AsyncComponent';

const ItemBank = asyncComponent(() => import('../components/topic-volume/ItemBank'));
const AddQuestion = asyncComponent(() => import('../components/topic-volume/ItemBank/AddQuestion'));
const QuestionIntro = asyncComponent(() => import('../components/topic-volume/ItemBank/create-questions/CreateQuestion'));
const TestPaper = asyncComponent(() => import('../components/topic-volume/TestPaper'));
const AddTestPaper = asyncComponent(() => import('../components/topic-volume/TestPaper/AddTestPaper'));
const PaperDetail = asyncComponent(() => import('../components/topic-volume/TestPaper/PaperDetail'));

export default [
  {
    path: '/item-bank',
    exact: true,
    component: ItemBank
  },
  {
    path: '/item-bank/add-question',
    component: AddQuestion
  },
  {
    path: '/item-bank/create-question',
    component: QuestionIntro
  },
  {
    path:'/test-paper',
    exact: true,
    component:TestPaper
  },
  {
    path: '/test-paper/add-testPaper',
    component: AddTestPaper
  },
  {
    path: '/test-paper/paper-detail',
  component: PaperDetail
  }
]
