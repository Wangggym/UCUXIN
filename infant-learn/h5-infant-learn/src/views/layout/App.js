/**
 * Created by QiHan Wang on 2017/8/12.
 */
import React, {Component} from 'react';
import {Route, Link, withRouter, Redirect, Switch} from 'react-router-dom';
import './App.scss';
import {Token} from '../../utils';
import Config from '../../config';
import routes from '../../router';
import {hideMenu} from "../../utils/showAppMenu";

// 首次加载存储Token
let {token} = Config;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }


  componentWillMount() {
    // 入口页面渲染前， 若当前处于生产环境，则在组件渲染前获取用户 token
    if (process.env.NODE_ENV === `production` && !token) {
      if (!window.ongetappinfo) Token.prototype.registerWinGetApp();
      Token.prototype.getAppInfo(res => {
        if (!token) {
          token = res.AccessToken;
          Config.setToken(token);
          this.setState({visible: true}, () => hideMenu())
        }
      })
    }
    if (token) this.setState({visible: true}, () => hideMenu())
    //改变右上角app的菜单
  }


  render() {
    return (
      <Switch>
        {(process.env.NODE_ENV === `development` || this.state.visible) && routes.map((route, index) => (
          // Render more <Route>s with the same paths as
          // above, but different components this time.
          <Route key={index} path={route.path} exact={route.exact} component={route.component}/>
        ))}
        {/* <Redirect from="/" to="/404"/> */}
      </Switch>

    )
  }
}

export default withRouter(App);
