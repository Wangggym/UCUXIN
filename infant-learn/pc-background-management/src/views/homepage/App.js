/**
 * Created by QiHan Wang on 2017/8/12.
 */
import React, {Component} from 'react';
import {Route, Link, withRouter, Redirect, Switch} from 'react-router-dom';
import './App.scss';
import {Token} from '../../utils';
import Config from '../../config';
import Api from '../../api';
import routes, {breadcrumbNameMap} from '../../router';

// -- AntDesign Components
import {Layout, Menu, Icon, Breadcrumb, Alert, message} from 'antd';

const {SubMenu} = Menu;
const {Header, Sider, Content} = Layout;


// 首次加载存储Token
const token = Token();

const selectedMenu = (path, data, selected = []) => {
  for (let item of data) {
    if (item.Url === path) {
      selected.push(item);
    }
    if (item.ChildList && item.ChildList.length) {
      selectedMenu(path, item.ChildList, selected)
    }
  }
  return selected;
};

class App extends Component {
  state = {
    collapsed: false,
    clientInfo: {},
    menu: [],
    openKeys: [],
    selectedKeys: []
  };

  componentDidMount() {
    // 获取用户信息
    Api.Base.getMangeUser().then(res => {
      if (res.Ret === 0) {
        this.setState({clientInfo: res.Data});
        sessionStorage.clientInfo = encodeURIComponent(JSON.stringify(res.Data))
        sessionStorage.setItem('userInfo', JSON.stringify(res.Data))
      } else {
        message.error(res.Msg)
      }
    });

    // 获取菜单列表
    Api.Base.getMenuList({appId: Config.appId}).then(res => {
      if (res.Ret === 0) {
        this.setState({menu: res.Data || []}, this.handleMenuPosition);
      } else {
        message.error(res.Msg);
      }
    });
  }

  handleMenuPosition = () => {
    const {menu} = this.state;
    const {pathname} = this.props.location;
    const selectedMenuItem = selectedMenu(pathname, menu).slice(-1)[0] || {};
    this.setState({
      openKeys: [selectedMenuItem.PID],
      selectedKeys: [selectedMenuItem.ID]
    });
  };


  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  handleHorizontalMenuClick = (e) => {
    if (e.key === 'back') {
      window.location.href = Config.appAddress;
    }
  };

  render() {
    const {clientInfo, collapsed, menu, openKeys, selectedKeys} = this.state;
    //  路径导航配置
    const {location} = this.props;
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

      if (pathSnippets.length - 1 !== index) {
        return (<Breadcrumb.Item key={url}><Link to={url}>{breadcrumbNameMap[url]}</Link></Breadcrumb.Item>);
      } else {
        return (<Breadcrumb.Item key={url}>{breadcrumbNameMap[url]}</Breadcrumb.Item>);
      }
    });
    const breadcrumbItems = [(
      <Breadcrumb.Item key="home"><Link to="/">主页</Link></Breadcrumb.Item>
    )].concat(extraBreadcrumbItems)

    if (!token) {
      return (
        <Alert
          message="错误提示"
          description="用户身份信息获取失败，请重新打开应用程序，或与管理员联系！"
          type="error"
          showIcon
        />
      )
    } else {
      return (
        <Layout>
          <Header className="header">
            <span className="logo"><i className="icon-logo"/>幼学空间-后台管理系统</span>
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              style={{color: '#fff'}}
            />
            {/* 个人信息 */}
            <Menu
              onClick={this.handleHorizontalMenuClick}
              mode="horizontal"
              theme="dark"
              className="menu-horizontal"
            >
              <SubMenu key={1} title={<span className="user-info"><i className="user-pic"
                                                                     style={{backgroundImage: `url(${clientInfo.Pic})`}}/>{clientInfo.UserName}<Icon
                type="caret-down"/></span>}>
                <Menu.Item key="back"><Icon type="logout"/>返回</Menu.Item>
              </SubMenu>
            </Menu>
          </Header>
          <Layout>
            {/* 菜单 */}
            <Sider style={{background: '#fff'}} trigger={null} collapsible collapsed={this.state.collapsed}>
              <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onClick={(e) => this.setState({selectedKeys: [e.key]})}
                onOpenChange={(openKeys) => this.setState({openKeys: openKeys.slice(-1)})}
                style={{height: '100%', borderRight: 0}}>
                {
                  menu.map(item =>
                    <SubMenu key={item.ID} title={<span><Icon type="bars"/><span>{item.Name}</span></span>}>
                      {
                        item.ChildList && item.ChildList.length &&
                        item.ChildList.map(child => <Menu.Item key={child.ID}><Link
                          to={child.Url}>{child.Name}</Link></Menu.Item>)
                      }
                      {/*用户数统计页面已做，后台说没接口暂时不做*/}
                      {/*<Menu.Item key="12"><Link to="/userNum-count">用户数统计</Link></Menu.Item>*/}
                    </SubMenu>
                  )
                }
                {/* <SubMenu key="sub1" title={<span><Icon type="bars"/><span>运营管理</span></span>}>
                  <Menu.Item key="1"><Link to="/park-management">园所管理</Link></Menu.Item>
                  <Menu.Item key="2"><Link to="/authority-management">权限管理</Link></Menu.Item>
                  <Menu.Item key="3"><Link to="/lecturer-management">讲师管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="bars"/><span>课程管理</span></span>}>
                  <Menu.Item key="4"><Link to="/training-plan">培训计划</Link></Menu.Item>
                  <Menu.Item key="5"><Link to="/course-management">课程管理</Link></Menu.Item>
                  <Menu.Item key="8"><Link to="/message-management">消息管理</Link></Menu.Item>

                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="bars"/><span>数据统计</span></span>}>
                  <Menu.Item key="7"><Link to="/resource">费用统计</Link></Menu.Item>
                </SubMenu>*/}
              </Menu>
            </Sider>
            <Layout style={{padding: '0 24px 24px'}}>
              {/*<Breadcrumb style={{margin: '12px 0'}}>
              <Breadcrumb.Item><Link to="/">主页</Link></Breadcrumb.Item>
              <Breadcrumb.Item><Link to="/">菜单</Link></Breadcrumb.Item>
              <Breadcrumb.Item>维度管理</Breadcrumb.Item>
            </Breadcrumb>*/}
              <Breadcrumb style={{margin: '12px 0'}}>
                {breadcrumbItems}
              </Breadcrumb>
              <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
                <Switch>
                  {routes.map((route, index) => (
                    // Render more <Route>s with the same paths as
                    // above, but different components this time.
                    <Route key={index} path={route.path} exact={route.exact} component={route.component}/>
                  ))}
                  <Redirect from="/" to="/404"/>
                </Switch>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      );
    }
  }
}

export default withRouter(App);
