import {asyncComponent} from '../components'

import HomePage from './HomePage/HomePage'
import CompetitionRule from './CompetitionRule/CompetitionRule'
import MyGrade from './MyGrade/MyGrade'
import RankingList from './RankingList/RankingList'
import IdentityChoose from './IdentityChoose/IdentityChoose'
import ConfirmPage from './ConfirmPage/ConfirmPage'
import AnswerPage from './AnswerPage/AnswerPage'
import SharePage from './SharePage/SharePage'
import NoResultsPage from './NoResultsPage/NoResultsPage'
// import StatementPage from './StatementPage/StatementPage'
// import SchoolChartsPage from './SchoolChartsPage/SchoolChartsPage'
// import SelectClassPage from './ClassStatus/SelectClassPage/SelectClassPage'
// import ClassConditionPage from './ClassStatus/ClassConditionPage/ClassConditionPage'
import FirstContestResultPage from './FirstContestResultPage/FirstContestResultPage'
import SecondContestResultPage from './SecondContestResultPage/SecondContestResultPage'
import LostContestResultPage from './LostContestResultPage/LostContestResultPage'

// const HomePage = asyncComponent(() => import('./HomePage/HomePage'));
// const CompetitionRule = asyncComponent(() => import('./CompetitionRule/CompetitionRule'));
// const MyGrade = asyncComponent(() => import('./MyGrade/MyGrade'));
// const RankingList = asyncComponent(() => import('./RankingList/RankingList'));
// const IdentityChoose = asyncComponent(() => import('./IdentityChoose/IdentityChoose'));
// const ConfirmPage = asyncComponent(() => import('./ConfirmPage/ConfirmPage'));
// const AnswerPage = asyncComponent(() => import('./AnswerPage/AnswerPage'));
// const SharePage = asyncComponent(() => import('./SharePage/SharePage'));
const StatementPage = asyncComponent(() => import('./StatementPage/StatementPage'));
const SchoolChartsPage = asyncComponent(() => import('./SchoolChartsPage/SchoolChartsPage'));
const SelectClassPage = asyncComponent(() => import('./ClassStatus/SelectClassPage/SelectClassPage'));
const ClassConditionPage = asyncComponent(() => import('./ClassStatus/ClassConditionPage/ClassConditionPage'));
export {
    HomePage,
    CompetitionRule,
    MyGrade,
    RankingList,
    IdentityChoose,
    ConfirmPage,
    AnswerPage,
    SharePage,
    StatementPage,
    SchoolChartsPage,
    SelectClassPage,
    ClassConditionPage,
    FirstContestResultPage,
    SecondContestResultPage,
    LostContestResultPage,
    NoResultsPage,
}