/**
 * Created by QiHan Wang on 2017/8/12.
 */
import React, {Component} from 'react';
import {Route, Link, withRouter, Redirect, Switch} from 'react-router-dom';
import './App.scss';
import {Token} from '../../common/utils';
import Config from '../../common/config';
import Api from '../../api';
import routes, {breadcrumbNameMap} from '../../router';

// -- AntDesign Components
import {Layout, Menu, Icon, Breadcrumb, Alert, message} from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
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
const menu = [
  {
    ID: "sub1",
    Name: "资源管理",
    PID: "0",
    Url: "",
    ChildList: [
      {
        ID: "sub1child1",
        Name: "资源列表",
        PID: "sub1",
        Url: "/resource",
        ChildList: null,
      },
      {
        ID: "sub1child2",
        Name: "分类管理",
        PID: "sub1",
        Url: "/category",
        ChildList: null,
      },
      {
        ID: "sub1child3",
        Name: "基础属性管理",
        PID: "sub1",
        Url: "/dimension",
        ChildList: null,
      },
    ],
  },
  {
    ID: "sub2",
    Name: "文件管理",
    PID: "0",
    Url: "",
    ChildList: [
      {
        ID: "sub2child1",
        Name: "文件上传",
        PID: "sub2",
        Url: "/files-upload",
        ChildList: null,
      },
      {
        ID: "sub2child2",
        Name: "视频上传",
        PID: "sub2",
        Url: "/video-upload",
        ChildList: null,
      },
    ],
  },
  {
    ID: "sub3",
    Name: "题库组卷",
    PID: "0",
    Url: "",
    ChildList: [
      {
        ID: "sub3child1",
        Name: "题库",
        PID: "sub3",
        Url: "/item-bank",
        ChildList: null,
      },
      {
        ID: "sub3child2",
        Name: "试卷库",
        PID: "sub3",
        Url: "/test-paper",
        ChildList: null,
      },
    ],
  },
  {
    ID: "sub4",
    Name: "菜单配置",
    PID: "0",
    Url: "",
    ChildList: [
      {
        ID: "sub4child1",
        Name: "菜单管理",
        PID: "sub4",
        Url: "/menu-management",
        ChildList: null,
      },
      {
        ID: "sub4child2",
        Name: "角色管理",
        PID: "sub4",
        Url: "/role-management",
        ChildList: null,
      }
    ],
  }
];



class App extends Component {
  state = {
    collapsed: false,
    clientInfo: {},
    openKeys:[],
    selectedKeys:[]
  };

  componentDidMount() {
    Api.Base.getCurrentUserInfo().then(res => {
      if (res.Ret === 0) {
        this.setState({clientInfo: res.Data});
      } else {
        message.error(res.Msg)
      }
    })
  }

  componentWillMount(){
    this.handleMenuPosition();
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

  handleMenuPosition = () => {
    const {pathname} = this.props.location;
    const selectedMenuItem = selectedMenu(pathname, menu).slice(-1)[0] || {};
    this.setState({
      openKeys: [selectedMenuItem.PID],
      selectedKeys:[selectedMenuItem.ID]
    });
  };

  render() {
    const {clientInfo, collapsed, selectedKeys, openKeys} = this.state;
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
            <div className="logo"><i className="icon-logo"/>资源组织平台</div>
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              style={{color: '#fff'}}
            />

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
            <Sider style={{background: '#fff'}} trigger={null} collapsible collapsed={this.state.collapsed}>
              <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onClick={(e) => this.setState({selectedKeys: [e.key]})}
                onOpenChange={(openKeys) => this.setState({openKeys: openKeys.slice(-1)})}
                style={{height: '100%', borderRight: 0}}
              >
                {
                  Array.isArray(menu) && menu.map(item =>
                    <SubMenu key={item.ID} title={<span><Icon type="bars"/><span>{item.Name}</span></span>}>
                      {
                        Array.isArray(item.ChildList) && item.ChildList.map(child =>
                          <Menu.Item key={child.ID}><Link to={child.Url}>{child.Name}</Link></Menu.Item>
                        )
                      }
                    </SubMenu>
                  )
                }

                {/*<SubMenu key="sub1" title={<span><Icon type="bars"/><span>资源管理</span></span>}>
                  <Menu.Item key="1"><Link to="/resource">资源列表</Link></Menu.Item>
                  <Menu.Item key="2"><Link to="/category">分类管理</Link></Menu.Item>
                  <Menu.Item key="3"><Link to="/dimension">基础属性管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="bars"/><span>文件管理</span></span>}>
                  <Menu.Item key="4"><Link to="/files-upload">文件上传</Link></Menu.Item>
                  <Menu.Item key="5"><Link to="/video-upload">视频上传</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="bars"/><span>题库组卷</span></span>}>
                  <Menu.Item key="6"><Link to="/item-bank">题库</Link></Menu.Item>
                  <Menu.Item key="7"><Link to="/test-paper">试卷库</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub4" title={<span><Icon type="bars"/><span>菜单</span></span>}>
                  <Menu.Item key="8"><Link to="/menu-management">菜单管理</Link></Menu.Item>
                  <Menu.Item key="9"><Link to="/role-management">角色管理</Link></Menu.Item>
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
      )
    }
    ;
  }
}

export default withRouter(App);
