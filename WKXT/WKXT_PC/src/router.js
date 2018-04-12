import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

//解析地址栏search部分
function getSearchObj(history) {
  var qs = history.location.search.length > 0 ? history.location.search.substr(1) : '',
      args = {},
      items = qs.length > 0 ? qs.split('&') : [],
      item = null, name = null, value = null, i = 0, len = items.length;

  for (i = 0; i < len; i++) {
      item = items[i].split('=');
      name = decodeURIComponent(item[0]);
      value = decodeURIComponent(item[1]);

      if (name.length) {
          args[name] = value;
      }
  }
  return args;
}

function RouterConfig({ history, app }) {
  
  const routerData = getRouterData(app);
  // const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;

  const { AccessToken } = getSearchObj(history)
    console.log(AccessToken)
    AccessToken && sessionStorage.setItem('token',AccessToken)
  
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route
            path="/"
            component={BasicLayout}
          />
          {/* <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            authority={['admin', 'user']}
            redirectPath="/user/login"
          /> */}
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
