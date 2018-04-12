
import React, {PureComponent} from 'react';
import {Layout, Menu, Icon} from 'antd';
import {Link} from 'react-router-dom';


const {Sider} = Layout;
const {SubMenu} = Menu;

export default class SiderMenu extends PureComponent {
    constructor(props) {
        super(props);
        // 把一级 Layout 的 children 作为菜单项
        this.menus = props.navData.reduce((arr, current) => arr.concat(current.children), []);
        this.state = {
            openKeys: this.getDefaultCollapsedSubMenus(props),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.navData && nextProps.navData !== this.props.navData) {
            this.menus = nextProps.navData;
            this.setState({openKeys: this.getDefaultCollapsedSubMenus()})
        }
    }

    getDefaultCollapsedSubMenus(props) {
        const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
        currentMenuSelectedKeys.splice(-1, 1);
        if (currentMenuSelectedKeys.length === 0) {
            return ['reports'];
        }

        return currentMenuSelectedKeys;
    }

    getCurrentMenuSelectedKeys(props) {
        const {location: {pathname}} = props || this.props;
        const keys = pathname.split('/').slice(1);
        if (keys.length === 1 && keys[0] === '') {
            return this.menus.length && [this.menus[0].key];
        }
        return keys;
    }

    getNavMenuItems(menusData, parentPath = '') {
        if (!menusData) return [];
        return menusData.map((item) => {
            if (!item.Name) {
                return null;
            }
            let itemPath;
            if (item.Url && item.Url.indexOf('http') === 0) {
                itemPath = item.Url;
            } else {
                itemPath = `${parentPath}/${item.Url || ''}`.replace(/\/+/g, '/');
            }
            if (item.SubMenus && item.SubMenus.some(child => child.Name)) {
                return (
                    <SubMenu key={item.Url} title={<span><Icon type="bars"/><span>
                        {!item.SubMenus ? <Link to={item.Url}>{item.Name}</Link>: <span>{item.Name}</span>}
                    </span></span>}>
                        {this.getNavMenuItems(item.SubMenus, itemPath)}
                    </SubMenu>
                );
            }
            const icon = <Icon type="bars"/>;
            return (
                <Menu.Item key={item.Url || item.path}>
                    {
                        /^https?:\/\//.test(itemPath) ? (
                            <a href={itemPath} target={item.target}>
                                {icon}<span>{item.Name}</span>
                            </a>
                        ) : (
                            <Link
                                to={itemPath}
                                target={item.target}
                                replace={itemPath === this.props.location.pathname}
                            >
                                {icon}<span>{item.Name}</span>
                            </Link>
                        )
                    }
                </Menu.Item>
            );
        });
    }

    handleOpenChange = (openKeys) => {
        const lastOpenKey = openKeys[openKeys.length - 1];
        const isMainMenu = this.menus.some(
            item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
        );
        this.setState({
            openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
        });
    };

    render() {
        const {collapsed} = this.props;

        // Don't show popup menu when it is been collapsed
        const menuProps = collapsed ? {} : {
            openKeys: this.state.openKeys,
        };
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}

            >
                <Menu
                    mode="inline"
                    {...menuProps}
                    onOpenChange={this.handleOpenChange}
                    selectedKeys={this.getCurrentMenuSelectedKeys()}
                    style={{height: '100%', borderRight: 0}}
                >
                    {this.getNavMenuItems(this.menus)}
                </Menu>
            </Sider>
        );
    }
}
