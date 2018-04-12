/**
 * Created by QiHan Wang on 2017/8/12.
 */
import React, { Component } from 'react';
import { Route, Link, withRouter, Redirect, Switch } from 'react-router-dom';
import './App.scss';
import { Token } from '../../utils';
import Config from '../../config';
import Api from '../../api';
import routes, { breadcrumbNameMap } from '../../router';

// -- AntDesign Components
import { Layout, Menu, Icon, Breadcrumb, Alert, message } from 'antd';

const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;


// 首次加载存储Token
const token = Token();

class App extends Component {
  state = {
    collapsed: false,
    clientInfo:{}
  };

  componentDidMount(){
    Api.Base.getMangeUser().then(res=> {
      if(res.Ret === 0){
        this.setState({clientInfo: res.Data});
      }else {
        message.error(res.Msg)
      }
    })
  }
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
    const {clientInfo, collapsed} = this.state;
    //  路径导航配置
    const { location } = this.props;
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
            <span className="logo"><i className="icon-logo"/>幼学空间-园长端</span>
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              style={{ color: '#fff' }}
            />

            <Menu
              onClick={this.handleHorizontalMenuClick}
              mode="horizontal"
              theme="dark"
              className="menu-horizontal"
            >
              <SubMenu key={1} title={<span className="user-info"><i className="user-pic" style={{backgroundImage:`url(${clientInfo.Pic})`}}/>{clientInfo.UserName}<Icon type="caret-down"/></span>}>
                <Menu.Item key="back"><Icon type="logout"/>返回</Menu.Item>
              </SubMenu>
            </Menu>
          </Header>
          <Layout>
            <Sider style={{ background: '#fff' }} trigger={null} collapsible collapsed={this.state.collapsed}>
              <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}>
                <Menu.Item key="1"><Link to="/parkInfo">园所介绍</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/score-management">学分管理</Link></Menu.Item>
                {/*<Menu.Item key="3"><Link to="/TrainLearnManagement">培训学习统计</Link></Menu.Item>*/}
                <Menu.Item key="4"><Link to="/BuyCourseStatistics">课程购买统计</Link></Menu.Item>
                {/* <SubMenu key="sub1" title={<span><Icon type="bars"/>运营管理</span>}>
                  <Menu.Item key="1"><Link to="/resource">园所管理</Link></Menu.Item>
                  <Menu.Item key="2"><Link to="/authority-management">权限管理</Link></Menu.Item>
                  <Menu.Item key="3"><Link to="/lecturer-management">讲师管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="bars"/>课程管理</span>}>
                  <Menu.Item key="4"><Link to="/training-plan">培训计划</Link></Menu.Item>
                  <Menu.Item key="5"><Link to="/course-management">课程管理</Link></Menu.Item>
                  <Menu.Item key="6"><Link to="/student-management">学员管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="bars"/>数据统计</span>}>
                  <Menu.Item key="7"><Link to="/resource">费用统计</Link></Menu.Item>
                </SubMenu> */}
              </Menu>
            </Sider>
            <Layout style={{ padding: '0 24px 24px' }}>
              {/*<Breadcrumb style={{margin: '12px 0'}}>
              <Breadcrumb.Item><Link to="/">主页</Link></Breadcrumb.Item>
              <Breadcrumb.Item><Link to="/">菜单</Link></Breadcrumb.Item>
              <Breadcrumb.Item>维度管理</Breadcrumb.Item>
            </Breadcrumb>*/}
              <Breadcrumb style={{ margin: '12px 0' }}>
                {breadcrumbItems}
              </Breadcrumb>
              <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                <Switch>
                  {routes.map((route, index) => (
                    // Render more <Route>s with the same paths as
                    // above, but different components this time.
                    <Route key={index} path={route.path} exact={route.exact} component={route.component} />
                  ))}
                  <Redirect from="/" to="/404" />
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
