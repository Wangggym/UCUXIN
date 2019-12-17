import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import {
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
} from './views'
import Config from './api/config/index'

// const AsyncSchoolChartsPage = asyncComponent(() => import('./views/SchoolChartsPage/SchoolChartsPage'));

//带animate 跳转页面动效
// const PrivateRoute = ({component: Component, ...rest}) => (
//     <Route {...rest} render={props => sessionStorage.getItem("UCUX_OCS_AccessToken") || rest.path === '/StatementPage' ?
//         <div className="animated fadeIn"><Component {...props}/></div> : <div className="animated fadeIn"><SharePage/></div>}/>
// )

const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={props => sessionStorage.getItem("UCUX_OCS_AccessToken") || rest.path === '/StatementPage' ?
        <Component {...props}/> : <SharePage/>}/>
)

const routers = [
    // 首页
    {
        path: '/',
        exact: true,
        component: HomePage,
    },
    {
        path: '/HomePage/:token',
        component: HomePage,
    },
    {
        path: '/HomePage',
        component: HomePage,
    },
    //竞赛规则
    {
        path: '/CompetitionRule',
        component: CompetitionRule,
    },
    //我的成绩
    {
        path: '/MyGrade/:umid',
        component: MyGrade,
    },
    //Top10
    {
        path: '/RankingList',
        component: RankingList,
    },
    //身份选择页
    {
        path: '/IdentityChoose/:address',
        component: IdentityChoose,
    },
    //答题页提示
    {
        path: '/ConfirmPage/:umid',
        component: ConfirmPage,
    },
    //答题页
    {
        path: '/AnswerPage/:umid',
        component: AnswerPage,
    },
    //暂无结果页
    {
        path: '/NoResultsPage',
        component: NoResultsPage,
    },
    //初赛结果
    {
        path: '/FirstContestResultPage/:umid',
        component: FirstContestResultPage,
    },
    //复赛结果
    {
        path: '/SecondContestResultPage',
        component: SecondContestResultPage,
    },
    //决赛结果
    {
        path: '/LostContestResultPage',
        component: LostContestResultPage,
    },

    /**单页接口**/
    //分享页
    {
        path: '/SharePage',
        component: SharePage
    },
    //禁毒报表单页
    {
        path: '/StatementPage',
        component: StatementPage
    },
    //学校报表
    {
        path: '/SchoolChartsPage',
        component: SchoolChartsPage,
    },
    //选择班级
    {
        path: '/SelectClassPage',
        component: SelectClassPage,
    },
    //班级参赛情况
    {
        path: '/ClassConditionPage/:gid/:classID',
        component: ClassConditionPage,
    },
]

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
        }
    }

    //三个地方获取token   --ucux --pc端 --开发环境
    componentWillMount() {
        const pathname = this.props.history.location.pathname
        if (pathname.indexOf('/StatementPage') !== -1) {
            return this.setState({visible: true})
        }
        if (!Config.debug) {//production
            //判断运行环境
            if (navigator.userAgent.indexOf('UCUX_WebBrowser') === -1) {
                if (pathname.indexOf('/HomePage/') !== -1 && pathname.slice('/HomePage/'.length).length !== 0) {
                    sessionStorage.setItem("UCUX_OCS_AccessToken", pathname.slice('/HomePage/'.length))
                }
                this.setState({visible: true})
            } else {
                try {
                    setTimeout(() => window.location.href = "ucux://getappinfo?callback=ongetappinfo")
                } catch (e) {
                    console.log(e)
                }
                window.ongetappinfo = dataStr => {
                    let data = eval('(' + dataStr + ')')
                    sessionStorage.setItem('UCUX_OCS_AccessToken', data.AccessToken)
                    this.setState({visible: true})
                }
            }
        }
        else {
            sessionStorage.setItem("UCUX_OCS_AccessToken", 'b99920a8ce8b4638b5b32c84cae7dee2')
            this.setState({visible: true})
        }
    }

    render() {
        return (
            <Switch>
                {this.state.visible && routers.map((route, index) => (
                    <PrivateRoute key={index} path={route.path} exact={route.exact} component={route.component}/>
                ))}
                {/* <Redirect from="/" to="/404"/> */}
            </Switch>
        )
    }
}

export default withRouter(App)

