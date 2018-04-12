/**
 * Created by Yu Tian Xiong on 2017/12/11.
 */
import React, {Component} from 'react';
import './App.less';
import {Route, Link, withRouter,Switch} from 'react-router-dom';
import routes, {breadcrumbNameMap} from '../../router';
import Token from '../../basics/token';
import Api from '../../api';
import config from '../../config';
import SiderMenu from './SiderMenu';
import {Layout, Menu, Breadcrumb, Icon, message, Modal,Alert} from 'antd';
import params from '../../basics/params';


const {SubMenu} = Menu;
const {Header, Content} = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            visible: false,
            mvisble: false,
            userinfo: {},
            Name: '',
            orgList: [],
            menu: [],
            clientInfo: {},
            selectedKeys: [],
            openKeys: [],
        };

    }

    componentDidMount() {
        this.validateToken();
    }

  // 隐藏加载等待
  showLayout = () => document.getElementsByClassName('pace')[0].style.opacity = 0;

    //侧边栏的收起和折叠
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    //入口身份
    validateToken() {
      if(Token.getUserToken()){
        const token = params.searchParamName('AccessToken');// 值为字符串或null
        if(token){
          Token.setUserToken(token);
        }
        this.getUserPubFrmGroups();
        this.getUserInfo();
      }else{
        Token.fetchUserToken().then(res => {
          if (res.Ret === 0) {
            Token.setUserToken(res.Data.Token);
            this.getUserPubFrmGroups();
            this.getUserInfo();
          } else {
            message.error(res.Msg);
          }
        });
      }

    }
    //获取用户信息
    getUserInfo = () => {
        Api.Info.getUserInfo().then(res => {
            if (res.Ret === 0) {
                const data = res.Data || {};
                this.setState({
                    userinfo: {
                        UName: data.Name,
                        UPic: data.Pic,
                    },
                })
            } else {
                message.error(res.Msg);
            }
        });
    };
    //获取组织机构
    getUserPubFrmGroups = () => {
        Api.Info.getUserPubFrmGroups().then(res => {
            if (res.Ret === 0) {
                if (res.Data.length ) {
                    this.getCurrMbrInfo(res.Data[0].GID);
                    this.setState({Name:res.Data[0].Name})
                } else if (res.Data.length === 0 || res.Data === null) {
                    message.error('您没有权限哦！', 1, () => {
                        window.location.href = config.appAddress;
                    })
                }
                //组织机构列表
                this.setState({orgList: res.Data || []});
            } else {
                message.error(res.Msg);
            }
        })
    };
    //获取左侧菜单列表
    getCurrMbrInfo = (gID) => {
        Api.Info.getCurrMbrInfo({gID}).then(res => {
            if (res.Ret === 0) {
                this.setState({
                    menu: res.Data,
                    visible: false,
                });
              this.showLayout();
            }else{
                message.error(res.Msg)
            }
        })
    };
    // 右侧顶部 用户菜单
    handleHorizontalMenuClick = (e) => {
        if (e.key === 'back') {
            window.location.href = config.appAddress;

        } else {
            this.getCurrMbrInfo(e.key);
            Api.Info.getUserInfo().then(res => {
                if (res.Ret === 0) {
                    const data = res.Data || {};
                    data.ZXGroups.map(item => {
                        if (item.GID === e.key) {
                            this.setState({Name: item.Name});
                        }
                    })
                } else {
                    message.error(res.Msg);
                }
            });
            this.props.history.push('/');
        }
    };
    handleClick = (e) => {
        this.getCurrMbrInfo(e.key);
        Api.Info.getUserInfo().then(res => {
            if (res.Ret === 0) {
                const data = res.Data || {};
                data.ZXGroups.map(item => {
                    if (item.GID === e.key) {
                        this.setState({Name: item.Name});
                    }
                })
            } else {
                message.error(res.Msg);
            }
        });
    };
    //关闭没有机构时的弹出框
    onClose = () => {
        this.setState({
            visible: false,
        })
    };

    render() {
        const {collapsed, userinfo, orgList, menu, Name} = this.state;
        const {location} = this.props;
        //  路径导航配置
        let pathSnippets = location.pathname.split('/').filter(i => i);

        // 过滤掉不存在的路径导航
        pathSnippets = pathSnippets.filter((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            return breadcrumbNameMap[url] && _;
        });

        const extraBreadcrumbItems = pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            if (pathSnippets.length - 1 !== index && breadcrumbNameMap[url].component) {
                return (
                    <Breadcrumb.Item key={url}><Link to={url}>{breadcrumbNameMap[url].name}</Link></Breadcrumb.Item>);
            } else {
                //if(breadcrumbNameMap[url] )
                return (
                    <Breadcrumb.Item key={url}>{breadcrumbNameMap[url] ? breadcrumbNameMap[url].name : ''}</Breadcrumb.Item>);
            }

        });
        const breadcrumbItems = [(
            <Breadcrumb.Item key="home"><Link to="/">首页</Link></Breadcrumb.Item>
        )].concat(extraBreadcrumbItems);
      if (!Token.getUserToken()) {
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
              <Modal
                title="请选择发布机构"
                visible={this.state.visible}
                footer={null}
                closable={false}
              >
                  <Menu
                    onClick={this.handleClick}
                    style={{borderRight: 0}}
                  >

                    {
                      orgList.map(item => <Menu.Item key={item.GID}><span>{item.Name}</span>
                      </Menu.Item>)
                    }
                  </Menu>
              </Modal>
              <Header className="header">
                  <span className="logo"><i className="icon-logo"/>资讯内容发布平台</span>
                  <Icon className="trigger"
                        type={collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                        style={{color: '#fff'}}
                  />
                  <Menu
                    onClick={this.handleHorizontalMenuClick}
                    mode="horizontal"
                    theme="dark"
                    className="menu-horizontal">
                      <SubMenu key={1} title={
                          <div className="user-info">
                              <i className="user-pic" style={{backgroundImage: `url(${userinfo.UPic})`}}/>
                            {Name}
                              <Icon type="caret-down"/>
                          </div>}
                      >

                        {
                          orgList.map(item => <Menu.Item key={item.GID} style={{
                            background: '#404040',
                            margin: 0
                          }}><span>{item.Name}</span></Menu.Item>)
                        }
                          <Menu.Divider/>
                          <Menu.Item key="back" style={{background: '#404040', margin: 0}}><Icon
                            type="logout"/>返回</Menu.Item>
                      </SubMenu>
                  </Menu>
              </Header>
              <Layout>
                  <SiderMenu
                    collapsed={collapsed}
                    navData={menu}
                    location={location}
                  />
                  <Layout style={{padding: '0 24px 24px'}}>
                      <Breadcrumb style={{margin: '16px 0'}}>
                        {breadcrumbItems}
                      </Breadcrumb>
                      <Content style={{background: '#fff', padding: 24}}>
                        {
                          menu && menu.length ? <Switch>
                            {routes.map((route, index) => (
                              <Route key={index} path={route.path} exact={route.exact}
                                     component={route.component}/>
                            ))}
                          </Switch> : null
                        }

                      </Content>
                  </Layout>
              </Layout>
          </Layout>
        );
      }
    }
}

export default withRouter(App);
