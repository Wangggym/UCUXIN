import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
    // eslint-disable-next-line
    !app._models.some(({ namespace }) => {
        return namespace === model.substring(model.lastIndexOf('/') + 1);
    })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
    // () => require('module')
    // transformed by babel-plugin-dynamic-import-node-sync
    if (component.toString().indexOf('.then(') < 0) {
        models.forEach((model) => {
            if (modelNotExisted(app, model)) {
                // eslint-disable-next-line
                app.model(require(`../models/${model}`).default);
            }
        });
        return (props) => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return createElement(component().default, {
                ...props,
                routerData: routerDataCache,
            });
        };
    }
    // () => import('module')
    return dynamic({
        app,
        models: () => models.filter(
            model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
            ),
        // add routerData prop
        component: () => {
            if (!routerDataCache) {
                routerDataCache = getRouterData(app);
            }
            return component().then((raw) => {
                const Component = raw.default || raw;
                return props => createElement(Component, {
                    ...props,
                    routerData: routerDataCache,
                });
            });
        },
    });
};

function getFlatMenuData(menus) {
    let keys = {};
    menus.forEach((item) => {
        if (item.children) {
            keys[item.path] = { ...item };
            keys = { ...keys, ...getFlatMenuData(item.children) };
        } else {
            keys[item.path] = { ...item };
        }
    });
    return keys;
}

export const getRouterData = (app) => {
    const routerConfig = {
        '/': {
            component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
        },
        // '/dashboard/analysis': {
        //     component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
        // },
        // '/dashboard/monitor': {
        //     component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
        // },
        // '/dashboard/workplace': {
        //     component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
        //     // hideInBreadcrumb: true,
        //     name: '工作台',
        //     // authority: 'admin',
        // },
        // '/form/basic-form': {
        //     component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
        // },
        // '/form/step-form': {
        //     component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
        // },
        // '/form/step-form/info': {
        //     component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
        // },
        // '/form/step-form/confirm': {
        //     component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
        // },
        // '/form/step-form/result': {
        //     component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
        // },
        // '/form/advanced-form': {
        //     component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
        // },

        '/list/table-list': {
            component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
        },

        '/list/basic-list': {
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
        },
        '/list/card-list': {
            component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
        },
        // '/list/search': {
        //     component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
        // },
        // '/list/search/projects': {
        //     component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
        // },
        // '/list/search/applications': {
        //     component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
        // },
        // '/list/search/articles': {
        //     component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
        // },
        // '/profile/basic': {
        //     component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
        // },
        // '/profile/advanced': {
        //     component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')),
        // },
        // '/result/success': {
        //     component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
        // },
        // '/result/fail': {
        //     component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
        // },
        // '/exception/403': {
        //     component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
        // },
        // '/exception/404': {
        //     component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
        // },
        // '/exception/500': {
        //     component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
        // },
        // '/exception/trigger': {
        //     component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
        // },
        // '/user': {
        //     component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
        // },
        // '/user/login': {
        //     component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
        // },
        // '/user/register': {
        //     component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
        // },
        // '/user/register-result': {
        //     component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
        // },
        // '/user/:id': {
        //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
        // },

        // business
        // 系统设置 
        '/setting/textVersionManagement': {
            component: dynamicWrapper(app, ['textVersionManagement', 'common'], () => import('../routes/setting/TextVersionManagement')),
            name: '教材版本管理'
        },
        '/setting/res-setting': {
            component: dynamicWrapper(app, ['resSetting'], () => import('../routes/setting/ResSetting')),
            name: '资源设置'
        },
        '/setting/addNewRes': {
            component: dynamicWrapper(app, ['common', 'form'], () => import('../routes/setting/AddNewRes')),
            name: '资源设置 / 新增资源'
        },
        '/setting/NewTextVersion': {
            component: dynamicWrapper(app, ['common', 'form'], () => import('../routes/setting/NewTextVersion')),
            name: '教材版本管理 / 新增教材'
        },


        //资源管理
        '/management/course-management': {
            component: dynamicWrapper(app, ['courseList'], () => import('../routes/management/CourseManagement')),
            name: '课程管理'
        },
        '/management/course-detail/:id': {
            component: dynamicWrapper(app, ['courseDetail'], () => import('../routes/management/CourseDetail')),
            name: '课程管理 / 详情页'
        },
        '/management/supply-management': {
            component: dynamicWrapper(app, ['supplyList'], () => import('../routes/management/SupplyManagement')),
            name: '供应商管理'
        },
        '/management/supply-detail/:id': {
            component: dynamicWrapper(app, ['supplyDetail'], () => import('../routes/management/SupplyDetail')),
            name: '供应商管理 / 详情页'
        },
        '/management/watch-management': {
            component: dynamicWrapper(app, ['watchList'], () => import('../routes/management/WatchManagement')),
            name: '试看管理'
        },

        // //数据统计
        // '/dataStc/watchStc': {
        //     component: dynamicWrapper(app, [], () => import('../routes/dataStc/WatchStc')),
        // },
        // '/dataStc/integralStc': {
        //     component: dynamicWrapper(app, [], () => import('../routes/dataStc/IntegralStc')),
        // },
        // '/dataStc/behaviorStc': {
        //     component: dynamicWrapper(app, [], () => import('../routes/dataStc/BehaviorStc')),
        // },
        // '/dataStc/sellStc': {
        //     component: dynamicWrapper(app, [], () => import('../routes/dataStc/SellStc')),
        // },
        // '/dataStc/commentStc': {
        //     component: dynamicWrapper(app, [], () => import('../routes/dataStc/CommentStc')),
        // },
        // '/dataStc/schoolStc': {
        //     component: dynamicWrapper(app, [], () => import('../routes/dataStc/SchoolStc')),
        // },
    };
    // Get name from ./menu.js or just set it in the router data.
    const menuData = getFlatMenuData(getMenuData());

    // Route configuration data
    // eg. {name,authority ...routerConfig }
    const routerData = {};
    // The route matches the menu
    Object.keys(routerConfig).forEach((path) => {
        // Regular match item name
        // eg.  router /user/:id === /user/chen
        const pathRegexp = pathToRegexp(path);
        const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
        let menuItem = {};
        // If menuKey is not empty
        if (menuKey) {
            menuItem = menuData[menuKey];
        }
        let router = routerConfig[path];
        // If you need to configure complex parameter routing,
        // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
        // eg . /list/:type/user/info/:id
        router = {
            ...router,
            name: router.name || menuItem.name,
            authority: router.authority || menuItem.authority,
        };
        routerData[path] = router;
    });
    return routerData;
};
