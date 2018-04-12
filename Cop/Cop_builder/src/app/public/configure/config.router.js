/**
 * Created by fanweihua on 2016/8/4.
 * 路由配置
 */
angular.module('app').run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]).config(['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/access/loginUp');
    var stateProvider = {
        /**
         * 入口
         */
        init: function () {
            this.publicRouter();//公共的路由
            this.identityConfig();//不同身份的路由配置集合
        },
        /**
         * 公共的路由
         */
        publicRouter: function () {
            $stateProvider
            /*-------------------登录权限管理---------------------*/
                .state('access', {
                    url: '/access',
                    template: '<div ui-view class="fade-in-right-big smooth"></div>'
                })
                //登录
                .state('access.loginUp', {
                    url: '/loginUp',
                    templateUrl: 'public/tpl/userManagement/login.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'public/api/login/loginService.js' + APPMODEL.dateMath,
                                    'public/api/login/loginServiceSet.js' + APPMODEL.dateMath,
                                    'public/api/login/loginSendService.js' + APPMODEL.dateMath,
                                    'public/api/login/loginController.js' + APPMODEL.dateMath
                                ]);
                            }]
                    }
                })
                /*-------------------平台管理---------------------*/
                .state('access.app', {
                    abstract: true,
                    url: '/app',
                    controller: "permissionsController",
                    templateUrl: 'public/tpl/app.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                var publicService = ['public/api/application/identity/publicService.js' + APPMODEL.dateMath];//公用API服务
                                var applicationServiceSet = [
                                    'public/api/application/applicationServiceSet.js' + APPMODEL.dateMath,//所有服务的接口集合
                                    'public/api/application/applicationSend.js' + APPMODEL.dateMath,//ajax请求集合
                                    'public/api/application/permissionsController.js' + APPMODEL.dateMath//用户验证以及菜单生成服务
                                ];


                                for (var i in APPMODEL.privateServiceSet.service) {
                                    publicService.push(APPMODEL.privateServiceSet.service[i]);
                                }
                                for (var s in applicationServiceSet) {
                                    publicService.push(applicationServiceSet[s]);
                                }
                                return $ocLazyLoad.load(publicService);
                            }]
                    }
                })
                /*-------------------权限管理---------------------*/
                .state('access.app.userManagement', {
                    url: '/userManagement',
                    templateUrl: 'public/tpl/page_404.html'
                });
        },
        /**
         * 不同身份的公共路由配置集合
         */
        identityConfig: function () {
            /**
             * 合作伙伴,内部运营
             * @type {{init: init, partner: partner, internal: internal}}
             */
            var stateConfig = {
                /**
                 * 入口
                 */
                init: function () {
                    stateConfig.partner();//合作伙伴
                    stateConfig.internal();//内部运营
                    stateConfig.uxCloud();//优信云
                },
                /**
                 * 合作伙伴
                 */
                partner: function () {
                    $stateProvider
                        .state('access.app.partner', {
                            url: '/partner',
                            template: '<div ui-view></div>'
                        })
                        /*-------------------应用收费开通---------------------*/
                        .state('access.app.partner.applicationFeeOpen', {
                            url: '/applicationFeeOpen',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------缴费信息推送---------------------*/
                        .state('access.app.partner.paymentMessage', {
                            url: '/paymentMessage',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------缴费报表查询---------------------*/
                        .state('access.app.partner.paymentTableSearch', {
                            url: '/paymentTableSearch',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------线下收费---------------------*/
                        .state('access.app.partner.LineCharge', {
                            url: '/LineCharge',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------缴费异常处理---------------------*/
                        .state('access.app.partner.paymentAnomalyHandle', {
                            url: '/paymentAnomalyHandle',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------学校短信---------------------*/
                        .state('access.app.partner.schoolMessage', {
                            url: '/schoolMessage',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------通知作业-报表查询(Report query)（合作伙伴）---------------------*/
                        .state('access.app.partner.notificationOperation', {
                            url: '/notificationOperation',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------APP使用情况（合作伙伴）---------------------*/
                        .state('access.app.partner.appUseCondition', {
                            url: '/appUseCondition',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------短信使用情况（合作伙伴）---------------------*/
                        .state('access.app.partner.noteUseCondition', {
                            url: '/noteUseCondition',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------用户管理（合作伙伴）---------------------*/
                        .state('access.app.partner.userManagementPartner', {
                            url: '/userManagementPartner',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------缴费优惠（合作伙伴）---------------------*/
                        .state('access.app.partner.payCostSalePartner', {
                            url: '/payCostSalePartner',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------学校设备--lxf-------------------*/
                        .state('access.app.partner.schoolEquipment', {
                            url: '/schoolEquipment',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------卡号管理--------lxf-------------*/
                        .state('access.app.partner.cardManagement', {
                            url: '/cardManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*--------------刷卡数据----------------lxf*/
                        .state('access.app.partner.attendanceData', {
                            url: '/attendanceData',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*--------------优信云配置----------------lxf*/
                        .state('access.app.partner.authorizationConfig', {
                            url: '/authorizationConfig',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })

                        /*-------------------积分策略（合作伙伴）---------------------*/
                        .state('access.app.partner.internalPolicy', {
                            url: '/internalPolicy',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------合作伙伴学校开通---------------------*/
                        .state('access.app.partner.schoolApplication', {
                            url: '/schoolApplication',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })


                },
                /**
                 * 内部运营
                 */
                internal: function () {
                    $stateProvider
                        .state('access.app.internal', {
                            url: '/internal',
                            template: '<div ui-view></div>'
                        })
                        /*-------------------应用收费开通（内部运营）---------------------*/
                        .state('access.app.internal.applicationFeeOpen', {
                            url: '/applicationFeeOpen',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------缴费信息推送---------------------*/
                        .state('access.app.internal.paymentMessage', {
                            url: '/paymentMessage',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------缴费报表查询（内部运营）---------------------*/
                        .state('access.app.internal.paymentTableSearch', {
                            url: '/paymentTableSearch',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------发卡管理（内部运营）---------------------*/
                        .state('access.app.internal.cardManagement', {
                            url: '/cardManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------应用收费（内部运营）---------------------*/
                        .state('access.app.internal.applicationFee', {
                            url: '/applicationFee',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------心理评测 - 运营维护（内部运营）---------------------*/
                        .state('access.app.internal.operationManagement', {
                            url: '/operationManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------心理评测 - 知识资讯（内部运营）---------------------*/
                        .state('access.app.internal.knowledgeInformation', {
                            url: '/knowledgeInformation',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------心理评测 - banner管理（内部运营）---------------------*/
                        .state('access.app.internal.bannerManagement', {
                            url: '/bannerManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------心理评测 - 心理领域（内部运营）---------------------*/
                        .state('access.app.internal.basicData', {
                            url: '/basicData',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------心理评测 - 课程管理（内部运营）---------------------*/
                        .state('access.app.internal.courseManagement', {
                            url: '/courseManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------心理评测 - 心理测试任务（内部运营）---------------------*/
                        .state('access.app.internal.psychologicalTest', {
                            url: '/psychologicalTest',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------营养健康 - 测评量表管理（内部运营）---------------------*/
                        .state('access.app.internal.nutritionScalMannage', {
                            url: '/nutritionScalMannage',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------营养健康 - 运营维护（内部运营）---------------------*/
                        .state('access.app.internal.nutritionOperationManagement', {
                            url: '/nutritionOperationManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------营养健康 - 订单管理（内部运营）---------------------*/
                        .state('access.app.internal.nutritionOrderManagement', {
                            url: '/nutritionOrderManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------营养健康 - 基础字典（内部运营）---------------------*/
                        .state('access.app.internal.nutritionBasicDictionary', {
                            url: '/nutritionBasicDictionary',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------学校设备（内部运营）---------------------*/
                        .state('access.app.internal.schoolEquipment', {
                            url: '/schoolEquipment',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------学校短信（内部运营）---------------------*/
                        .state('access.app.internal.schoolMessage', {
                            url: '/schoolMessage',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------通知作业-报表查询(Report query)（内部运营）---------------------*/
                        .state('access.app.internal.notificationOperation', {
                            url: '/notificationOperation',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------APP使用情况（内部运营）---------------------*/
                        .state('access.app.internal.appUseCondition', {
                            url: '/appUseCondition',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------短信使用情况（内部运营）---------------------*/
                        .state('access.app.internal.noteUseCondition', {
                            url: '/noteUseCondition',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------圈子使用情况（内部运营）---------------------*/
                        .state('access.app.internal.friendCircle', {
                            url: '/friendCircleUseCondition',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------群聊使用情况（内部运营）---------------------*/
                        .state('access.app.internal.groupChat', {
                            url: '/groupChatCondition',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------优信主题（内部运营）---------------------*/
                        .state('access.app.internal.ThemeSkins', {
                            url: '/ThemeSkins',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------优信主题授权（内部运营）---------------------*/
                        .state('access.app.internal.SkinLimitConfig', {
                            url: '/SkinLimitConfig',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------应用授权配置（内部运营）---------------------*/
                        .state('access.app.internal.authorizationConfig', {
                            url: '/authorizationConfig',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------区域云管理（内部运营）---------------------*/
                        .state('access.app.internal.CloudRegion', {
                            url: '/CloudRegion',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })

                        /*-------------------组织机构（内部运营）---------------------*/
                        .state('access.app.internal.organizationalInstitution', {
                            url: '/organizationalInstitution',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------用户管理（内部运营）---------------------*/
                        .state('access.app.internal.userManagementInternal', {
                            url: '/userManagementInternal',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------菜单管理（内部运营）---------------------*/
                        .state('access.app.internal.menuManagementInternal', {
                            url: '/menuManagementInternal',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------学校应用管理（内部运营）---------------------*/
                        .state('access.app.internal.schoolApplicationManagement', {
                            url: '/schoolApplicationManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------缴费异常处理（内部运营）---------------------*/
                        .state('access.app.internal.paymentAnomalyHandle', {
                            url: '/paymentAnomalyHandle',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------江西禁毒权限管理（内部运营）---------------------*/
                        .state('access.app.internal.setSchoolReportRight', {
                            url: '/setSchoolReportRight',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------江西禁毒禁毒短信（内部运营）---------------------*/
                        .state('access.app.internal.antiDrugSMS', {
                            url: '/antiDrugSMS',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------优信云监控（内部运营）---------------------*/
                        .state('access.app.internal.ucuxinCloudMonitoring', {
                            url: '/ucuxinCloudMonitoring',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------应用图标维护（内部运营）---------------------*/
                        .state('access.app.internal.applicationIconMaintenance', {
                            url: '/applicationIconMaintenance',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------基础数据设置（内部运营）---------------------*/
                        .state('access.app.internal.basicDataControl', {
                            url: '/basicDataControl',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*--------------刷卡数据----------------lxf*/
                        .state('access.app.internal.attendanceData', {
                            url: '/attendanceData',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*--------------量表管理----------------*/
                        .state('access.app.internal.inventoryManagement', {
                            url: '/inventoryManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*--------------专家团队----------------*/
                        .state('access.app.internal.expertTeam', {
                            url: '/expertTeam',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*--------------心理功能开通----------------*/
                        .state('access.app.internal.mentalFunctionOpen', {
                            url: '/mentalFunctionOpen',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*--------------服務包管理----------------*/
                        .state('access.app.internal.servicePackageManagement', {
                            url: '/servicePackageManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*--------------直播管理----------------*/
                        .state('access.app.internal.afterManage', {
                            url: '/afterManage',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------积分仓库（内部运营）---------------------*/
                        .state('access.app.internal.internalWarehouse', {
                            url: '/internalWarehouse',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------直播优信官方后台（内部运营）---------------------*/
                        .state('access.app.internal.UXLive', {
                            url: '/UXLive',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })

                },
                /**
                 * 优信云
                 * */
                uxCloud: function () {
                    $stateProvider
                        .state('access.app.cloud', {
                            url: '/cloud',
                            template: '<div ui-view></div>'
                        })
                        /*-------------------应用授权配置---------------------*/
                        .state('access.app.cloud.authorizationConfig', {
                            url: '/authorizationConfig',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------合作伙伴用户管理---------------------*/
                        .state('access.app.cloud.partnerUserManagement', {
                            url: '/partnerUserManagement',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })

                        /*-------------------合作伙伴学校管理---------------------*/
                        .state('access.app.cloud.partnerSchoolManagementConfig', {
                            url: '/partnerSchoolManagementConfig',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------添加合作伙伴---------------------*/
                        .state('access.app.cloud.addPartnersConfig', {
                            url: '/addPartnersConfig',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                        /*-------------------区域云管理---------------------*/
                        .state('access.app.cloud.userManagementPartner', {
                            url: '/userManagementPartner',
                            template: '<div ui-view class="fade-in-up"></div>'
                        })
                }
            };
            stateConfig.init();//入口
            this.partner();//合作伙伴
            this.internal();//内部运营
            this.uxCloud();//优信云
        },
        /**
         *  合作伙伴
         */
        partner: function () {
            $stateProvider
            //优信配置信息L3
                .state('access.app.partner.authorizationConfig.listOfAuthorizationL3', {
                    url: '/listOfAuthorizationL3',
                    templateUrl: 'partners/applicationAuthorization/authorizationConfig/listOfAuthorizationL3/listOfAuthorizationL3Controller.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationAuthorization/authorizationConfig/listOfAuthorizationL3/listOfAuthorizationL3Controller.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 服务产品包开通--应用收费开通
                .state('access.app.partner.applicationFeeOpen.productPackDefine', {
                    url: '/productPackDefine',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/productPackDefine/productPackDefineController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['partners/applicationFeeManagement/applicationFeeOpen/productPackDefine/productPackDefineController.js' + APPMODEL.dateMath]);
                            }]
                    }
                })
                // 添加服务产品包--应用收费开通
                .state('access.app.partner.applicationFeeOpen.addServicePackage', {
                    url: '/addServicePackage?packAgeID',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/productPackDefine/addServicePackageController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['../bower_components/date/jquery-date/demo1/laydate.dev.js', 'public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/productPackDefine/addServicePackageController.js' + APPMODEL.dateMath]);
                            }]
                    }
                })
                // 开通情况查询--应用收费开通
                .state('access.app.partner.applicationFeeOpen.serviceProductOpenPage', {
                    url: '/serviceProductOpenPage',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/serviceProductOpenPage/serviceProductOpenPageController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/serviceProductOpenPage/serviceProductOpenPageController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 服务产品包赠送--应用收费开通
                .state('access.app.partner.payCostSalePartner.giveStudentServicePackage', {
                    url: '/giveStudentServicePackage',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/giveStudentServicePackage/giveStudentServicePackageController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/giveStudentServicePackage/giveStudentServicePackageController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 添加赠送学生服务包--应用收费开通
                .state('access.app.partner.payCostSalePartner.addStuFuncServiceByGive', {
                    url: '/addStuFuncServiceByGive',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/giveStudentServicePackage/addStuFuncServiceByGiveController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/giveStudentServicePackage/addStuFuncServiceByGiveController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                //学生优惠--应用收费开通
                .state('access.app.partner.payCostSalePartner.addStudentSale', {
                    url: '/addStudentSale',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/addStudentSale/addStudentSaleController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/addStudentSale/addStudentSaleController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                //添加学生优惠--应用收费开通
                .state('access.app.partner.payCostSalePartner.saveaddStudentSale', {
                    url: '/saveaddStudentSale',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/addStudentSale/saveAddStudentSaleController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/addStudentSale/saveAddStudentSaleController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 缴费推送设置--应用收费开通
                .state('access.app.partner.applicationFeeOpen.paymentPushSet', {
                    url: '/paymentPushSet?gid',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/paymentPushSet/paymentPushSetController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/paymentPushSet/paymentPushSetController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 查看缴费推送设置--缴费推送设置--应用收费开通
                .state('access.app.partner.applicationFeeOpen.editPaymentPushSet', {
                    url: '/editPaymentPushSet?gid&id',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/paymentPushSet/editPaymentPushSetController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath,
                                            '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/paymentPushSet/editPaymentPushSetController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 查看推送日志--缴费推送设置--应用收费开通
                .state('access.app.partner.applicationFeeOpen.pushLogPushSet', {
                    url: '/pushLogPushSet?gid',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/paymentPushSet/pushLogPushSetController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath,
                                            APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/paymentPushSet/pushLogPushSetController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 添加推送--缴费推送设置--应用收费开通
                .state('access.app.partner.applicationFeeOpen.addPushSet', {
                    url: '/addPushSet?gid&gidName',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/paymentPushSet/addPushSetController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath,
                                            APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/paymentPushSet/addPushSetController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                //第一步：添加产品--学校应用开通(合作伙伴)
                .state('access.app.partner.applicationFeeOpen.addPartnerProduct', {
                    url: '/addPartnerProduct',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/addPartnerProduct/addPartnerProductController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/applicationFeeOpen/addPartnerProduct/addPartnerProductController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                //添加产品
                .state('access.app.partner.applicationFeeOpen.newAddProduct', {
                    url: '/newAddProduct?id&GID&SchoolId',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/addPartnerProduct/NewAddProductController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/applicationFeeOpen/addPartnerProduct/NewAddProductController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                //第二步：添加服务包--学校应用开通(合作伙伴)
                .state('access.app.partner.applicationFeeOpen.addPackageService', {
                    url: '/addPackageService',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/addPackageService/addPackageServiceController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/applicationFeeOpen/addPackageService/addPackageServiceController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                //添加服务包
                .state('access.app.partner.applicationFeeOpen.NewServicePackage', {
                    url: '/NewServicePackage?id&schoolID&productID',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/addPackageService/NewServicePackageController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/applicationFeeOpen/addPackageService/NewServicePackageController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 开通收费--应用收费开通
                .state('access.app.partner.applicationFeeOpen.openCharge', {
                    url: '/openCharge?gid&productPackageID',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/openCharge/openChargeController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/openCharge/openChargeController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 开通服务包--应用收费开通
                .state('access.app.partner.applicationFeeOpen.openServicePack', {
                    url: '/openServicePack?gid&productPackageID&gidName&productPackageName',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/openCharge/openServicePackController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/openCharge/openServicePackController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 开启试用班级--应用收费开通
                .state('access.app.partner.applicationFeeOpen.openTrialClass', {
                    url: '/openTrialClass?gid&productPackageID&gidName&productPackageName',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/openCharge/openTrialClassController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/openCharge/openTrialClassController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 取消试用班级--应用收费开通
                .state('access.app.partner.applicationFeeOpen.cancelTrialClass', {
                    url: '/cancelTrialClass?gid&productPackageID&gidName&productPackageName',
                    templateUrl: 'partners/applicationFeeManagement/applicationFeeOpen/openCharge/cancelTrialClassController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/applicationFeeOpen/openCharge/cancelTrialClassController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 订阅号缴费信息--缴费信息推送
                .state('access.app.partner.paymentMessage.subscriberPaymentMessage', {
                    url: '/subscriberPaymentMessage',
                    controller: 'SubscriberPaymentMessageController',
                    templateUrl: 'partners/applicationFeeManagement/paymentMessage/subscriberPaymentMessage/subscriberPaymentMessageController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentMessage/subscriberPaymentMessage/subscriberPaymentMessageController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 添加订阅号信息推送--缴费信息推送
                .state('access.app.partner.paymentMessage.addInformationPush', {
                    url: '/addInformationPush',
                    controller: 'AddInformationPushController',
                    templateUrl: 'partners/applicationFeeManagement/paymentMessage/subscriberPaymentMessage/addInformationPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentMessage/subscriberPaymentMessage/addInformationPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 短信推送--缴费信息推送
                .state('access.app.partner.paymentMessage.smsPush', {
                    url: '/smsPush',
                    controller: 'SmsPushController',
                    templateUrl: 'partners/applicationFeeManagement/paymentMessage/smsPush/smsPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentMessage/smsPush/smsPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 短信推送添加--缴费信息推送
                .state('access.app.partner.paymentMessage.addSmsPush', {
                    url: '/addSmsPush',
                    controller: 'AddSmsPushController',
                    templateUrl: 'partners/applicationFeeManagement/paymentMessage/smsPush/addSmsPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentMessage/smsPush/addSmsPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 首页固定入口--缴费信息推送
                .state('access.app.partner.paymentMessage.fixedEntryPush', {
                    url: '/fixedEntryPush',
                    controller: 'FixedEntryPushController',
                    templateUrl: 'partners/applicationFeeManagement/paymentMessage/fixedEntryPush/fixedEntryPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentMessage/fixedEntryPush/fixedEntryPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 首页固定入口添加推送--缴费信息推送
                .state('access.app.partner.paymentMessage.addFixedEntryPush', {
                    url: '/addFixedEntryPush',
                    controller: 'AddFixedEntryPushController',
                    templateUrl: 'partners/applicationFeeManagement/paymentMessage/fixedEntryPush/addFixedEntryPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentMessage/fixedEntryPush/addFixedEntryPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 已缴费学生名单--缴费报表查询
                .state('access.app.partner.paymentTableSearch.alreadyPaymentStudentList', {
                    url: '/alreadyPaymentStudentList',
                    controller: 'alreadyPaymentStudentListController',
                    templateUrl: 'partners/applicationFeeManagement/paymentTableSearch/alreadyPaymentStudentList/alreadyPaymentStudentListController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'public/js/filters/paymentMethod.js' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentTableSearch/alreadyPaymentStudentList/alreadyPaymentStudentListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 未缴费学生名单--缴费报表查询
                .state('access.app.partner.paymentTableSearch.noPaymentStudentList', {
                    url: '/noPaymentStudentList',
                    controller: 'noPaymentStudentListController',
                    templateUrl: 'partners/applicationFeeManagement/paymentTableSearch/noPaymentStudentList/noPaymentStudentListController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentTableSearch/noPaymentStudentList/noPaymentStudentListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 缴费情况统计--缴费报表查询
                .state('access.app.partner.paymentTableSearch.costStatistics', {
                    url: '/costStatistics',
                    controller: 'costStatisticsController',
                    templateUrl: 'partners/applicationFeeManagement/paymentTableSearch/costStatistics/costStatisticsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentTableSearch/costStatistics/costStatisticsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 缴费情况统计--缴费实时按班统计
                .state('access.app.partner.paymentTableSearch.paymentAnnClasSstatistics', {
                    url: '/paymentAnnClasSstatistics',
                    controller: 'paymentAnnClasSstatisticsController',
                    templateUrl: 'partners/applicationFeeManagement/paymentTableSearch/paymentAnnClasSstatistics/paymentAnnClasSstatisticsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentTableSearch/paymentAnnClasSstatistics/paymentAnnClasSstatisticsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 缴费按校统计--缴费报表查询
                .state('access.app.partner.paymentTableSearch.paymentBySchoolStatistics', {
                    url: '/paymentBySchoolStatistics',
                    templateUrl: 'partners/applicationFeeManagement/paymentTableSearch/paymentBySchoolStatisticsPartner/paymentBySchoolStatisticsPartnerController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentTableSearch/paymentBySchoolStatisticsPartner/paymentBySchoolStatisticsPartnerController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //缴费未成功查询
                .state('access.app.partner.paymentTableSearch.paymentNotSuccessfulPartner', {
                    url: '/paymentNotSuccessfulPartner',
                    templateUrl: 'partners/applicationFeeManagement/paymentTableSearch/paymentNotSuccessful/paymentNotSuccessfulPartnerController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentTableSearch/paymentNotSuccessful/paymentNotSuccessfulPartnerController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 缴费人数统计
                .state('access.app.partner.paymentTableSearch.paymentPersonNumber', {
                    url: '/paymentPersonNumber',
                    templateUrl: 'partners/applicationFeeManagement/paymentTableSearch/paymentPersonNumber/paymentPersonNumber.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentTableSearch/paymentPersonNumber/paymentPersonNumberController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                })
                            }
                        ]
                    }
                })
                //缴费异常数据处理 -- 缴费异常处理
                .state('access.app.partner.paymentAnomalyHandle.paymentAnomaly', {
                    url: '/paymentAnomaly',
                    templateUrl: 'partners/applicationFeeManagement/paymentAnomalyHandle/paymentAnomaly/paymentAnomalyPartnerController.html' + APPMODEL.dateMath,
                    controller: 'PaymentAnomalyPartnerController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentAnomalyHandle/paymentAnomaly/paymentAnomalyPartnerController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //修改缴费异常数据处理 -- 缴费异常处理
                .state('access.app.partner.paymentAnomalyHandle.modifyPaymentAnomaly', {
                    url: '/modifyPaymentAnomaly',
                    templateUrl: 'partners/applicationFeeManagement/paymentAnomalyHandle/paymentAnomaly/modifyPaymentAnomalyPartnerController.html' + APPMODEL.dateMath,
                    controller: 'ModifyPaymentAnomalyPartnerController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/paymentAnomalyHandle/paymentAnomaly/modifyPaymentAnomalyPartnerController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 服务包代缴费--线下收费
                .state('access.app.partner.LineCharge.linePaymentConfirm', {
                    url: '/linePaymentConfirm?id',
                    templateUrl: 'partners/applicationFeeManagement/LineCharge/linePaymentConfirm/linePaymentController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/LineCharge/linePaymentConfirm/linePaymentController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 缴费确认--服务包代缴费--线下收费
                .state('access.app.partner.LineCharge.confirmPayment', {
                    url: '/confirmPayment?id',
                    templateUrl: 'partners/applicationFeeManagement/LineCharge/linePaymentConfirm/confirmPaymentController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath, 'partners/applicationFeeManagement/LineCharge/linePaymentConfirm/css/pay.css' + APPMODEL.dateMath,
                                            'partners/applicationFeeManagement/LineCharge/linePaymentConfirm/confirmPaymentController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 线下银行转账登记--线下收费
                .state('access.app.partner.LineCharge.bankTransferRegistration', {
                    url: '/bankTransferRegistration',
                    templateUrl: 'partners/applicationFeeManagement/LineCharge/bankTransferRegistration/bankTransferRegistrationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/LineCharge/bankTransferRegistration/bankTransferRegistrationController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 新增银行转账--线下银行转账登记--线下收费
                .state('access.app.partner.LineCharge.addBankTransferRegistration', {
                    url: '/addBankTransferRegistration',
                    templateUrl: 'partners/applicationFeeManagement/LineCharge/bankTransferRegistration/addBankTransferRegistrationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/applicationFeeManagement/LineCharge/bankTransferRegistration/addBankTransferRegistrationController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 福豆科技首款账户查看--线下银行转账登记--线下收费
                .state('access.app.partner.LineCharge.FDKJFirstView', {
                    url: '/FDKJFirstView',
                    templateUrl: 'partners/applicationFeeManagement/LineCharge/bankTransferRegistration/FDKJFirstView.html' + APPMODEL.dateMath
                })
                /*---------------------------短信---------------------------start*/
                // 学校短信规则配置--学校短信
                .state('access.app.partner.schoolMessage.schoolMessageConfiguration', {
                    url: '/schoolMessageConfiguration?type&gid',
                    templateUrl: 'partners/shortMessage/schoolMessage/schoolMessageConfiguration/schoolMessagePartnerConfigurationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shortMessage/schoolMessage/schoolMessageConfiguration/schoolMessagePartnerConfigurationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增或编辑短信发送规则--学校短信
                .state('access.app.partner.schoolMessage.addOrEditConfiguration', {
                    url: '/addOrEditConfiguration?type&gid',
                    templateUrl: 'partners/shortMessage/schoolMessage/schoolMessageConfiguration/addOrEditPartnerConfigurationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            '../bower_components/date/jquery-date/demo1/laydate.dev.js',
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shortMessage/schoolMessage/schoolMessageConfiguration/addOrEditPartnerConfigurationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增或编辑短信接收规则--学校短信
                .state('access.app.partner.schoolMessage.addOrEditReceive', {
                    url: '/addOrEditReceive?type&gid',
                    templateUrl: 'partners/shortMessage/schoolMessage/schoolMessageConfiguration/addOrEditReceivePartnerController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shortMessage/schoolMessage/schoolMessageConfiguration/addOrEditReceivePartnerController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 短信群发（合作伙伴）
                .state('access.app.partner.schoolMessage.smsGroupSends', {
                    url: '/smsGroupSends',
                    templateUrl: 'partners/shortMessage/schoolMessage/smsGroupSends/smsGroupSendsController.html' + APPMODEL.dateMath,
                    controller: 'SmsGroupSendsController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shortMessage/schoolMessage/smsGroupSends/smsGroupSendsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 开通功能短信（合作伙伴）
                .state('access.app.partner.schoolMessage.openSms', {
                    url: '/openSms',
                    templateUrl: 'partners/shortMessage/schoolMessage/openSms/openSms.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shortMessage/schoolMessage/openSms/openSms.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------报表查询-----------------------start*/
                // 通知发送情况查询--通知作业--报表查询
                .state('access.app.partner.notificationOperation.partnerNotificationSentQuery', {
                    url: '/partnerNotificationSentQuery',
                    templateUrl: 'partners/reportQuery/notificationOperation/notificationSentQuery/partnerNotificationSentQueryController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/reportQuery/notificationOperation/notificationSentQuery/partnerNotificationSentQueryController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //老师信息发送效果
                .state('access.app.partner.notificationOperation.teacherSendNote', {
                    url: '/teacherSendNote',
                    templateUrl: 'partners/reportQuery/notificationOperation/teacherSendNote/teacherSendNote.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/reportQuery/notificationOperation/teacherSendNote/teacherSendNoteController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //App使用情况查询
                .state('access.app.partner.appUseCondition.appUseConditionSerch', {
                    url: '/appUseConditionSerch',
                    templateUrl: 'partners/reportQuery/appUseCondition/appUseConditionSerch/appUseConditionSerch.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/reportQuery/appUseCondition/appUseConditionSerch/appUseConditionSerchController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //功能使用率
                .state('access.app.partner.appUseCondition.functionUsageRate', {
                    url: '/functionUsageRate',
                    templateUrl: 'partners/reportQuery/appUseCondition/functionUsageRate/functionUsageRate.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/reportQuery/appUseCondition/functionUsageRate/functionUsageRate.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //短信使用情况查询
                .state('access.app.partner.noteUseCondition.noteUseConditionSerch', {
                    url: '/noteUseConditionSerch',
                    templateUrl: 'partners/reportQuery/note/noteUseCondition/noteUseConditionSerch.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/reportQuery/note/noteUseCondition/noteUseConditionSerchContoller.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------报表查询-----------------------end*/
                /*---------------------------用户管理（合作伙伴）-----------------------start*/
                //用户管理--用户管理（合作伙伴）
                .state('access.app.partner.userManagementPartner.userManagementPartners', {
                    url: '/userManagementPartners',
                    templateUrl: 'partners/organizationAuthorityPartners/userManagementPartners/userManagementInternalPartners/userManagementPartnersController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/organizationAuthorityPartners/userManagementPartners/userManagementInternalPartners/userManagementPartnersController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                //用户菜单权限--用户管理（合作伙伴）
                .state('access.app.partner.userManagementPartner.userMenuPermissionsPartners', {
                    url: '/userMenuPermissionsPartners?UID&Name',
                    templateUrl: 'partners/organizationAuthorityPartners/userManagementPartners/userMenuPermissionsPartners/userMenuPermissionsPartnersController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/organizationAuthorityPartners/userManagementPartners/userMenuPermissionsPartners/userMenuPermissionsPartnersController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 添加用户菜单权限--用户菜单权限--用户管理（合作伙伴）
                .state('access.app.partner.userManagementPartner.addUserMenuPermissionsPartners', {
                    url: '/addUserMenuPermissionsPartners?UID&Name',
                    templateUrl: 'partners/organizationAuthorityPartners/userManagementPartners/userMenuPermissionsPartners/addUserMenuPermissionsPartnersController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/organizationAuthorityPartners/userManagementPartners/userMenuPermissionsPartners/addUserMenuPermissionsPartnersController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 用户管理 - 用户学校权限分配（合作伙伴）
                .state('access.app.partner.userManagementPartner.userSchoolAuthorityPartners', {
                    url: '/userSchoolAuthorityPartners?UID&Name',
                    templateUrl: 'partners/organizationAuthorityPartners/userManagementPartners/userSchoolAuthorityPartners/userSchoolAuthorityPartnersController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, 'public/js/constant/city.js',
                                            'partners/organizationAuthorityPartners/userManagementPartners/userSchoolAuthorityPartners/userSchoolAuthorityPartnersController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 用户管理 - 用户学校权限分配 - 分配学校（合作伙伴）
                .state('access.app.partner.userManagementPartner.saveUserSchoolAuthorityPartners', {
                    url: '/saveUserSchoolAuthorityPartners?UID&Name',
                    controller: 'SaveUserSchoolAuthorityPartnersController',
                    templateUrl: 'partners/organizationAuthorityPartners/userManagementPartners/userSchoolAuthorityPartners/saveUserSchoolAuthorityPartnersController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, 'public/js/constant/city.js',
                                            'partners/organizationAuthorityPartners/userManagementPartners/userSchoolAuthorityPartners/saveUserSchoolAuthorityPartnersController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 取消用户授权（合作伙伴）
                .state('access.app.partner.userManagementPartner.userCanceAuthorizationPartners', {
                    url: '/userCanceAuthorizationPartners',
                    controller: 'userCanceAuthorzationController',
                    templateUrl: 'partners/organizationAuthorityPartners/userManagementPartners/userCanceAuthorizationPartners/userCanceAuthorizationPartnersContorller.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, 'public/js/constant/city.js',
                                            'partners/organizationAuthorityPartners/userManagementPartners/userCanceAuthorizationPartners/userCanceAuthorizationPartnersContorller.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                //新学校设备登记--学校设备
                .state('access.app.partner.schoolEquipment.newSchoolEquipmentReg', {
                    url: '/newSchoolEquipmentReg?ID',
                    templateUrl: 'partners/deviceManagement/schoolEquipment/newSchoolEquipmentReg/newSchoolEquipmentReg.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['partners/deviceManagement/schoolEquipment/newSchoolEquipmentReg/newSchoolEquipmentRegController.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新学校设备--编辑--学校设备
                .state('access.app.partner.schoolEquipment.editEq', {
                    url: '/editEq?ID',
                    templateUrl: 'partners/deviceManagement/schoolEquipment/newSchoolEquipmentReg/editEq.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'partners/deviceManagement/schoolEquipment/newSchoolEquipmentReg/editEqController.js' + APPMODEL.dateMath,
                                            'partners/deviceManagement/schoolEquipment/newSchoolEquipmentReg/china-city-list.js']
                                    })
                                });
                            }
                        ]
                    }
                })
                //新学校设备--新增--学校设备
                .state('access.app.partner.schoolEquipment.addEq', {
                    url: '/addEq',
                    templateUrl: 'partners/deviceManagement/schoolEquipment/newSchoolEquipmentReg/addEq.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'partners/deviceManagement/schoolEquipment/newSchoolEquipmentReg/addEqController.js' + APPMODEL.dateMath,
                                            'partners/deviceManagement/schoolEquipment/newSchoolEquipmentReg/china-city-list.js']
                                    })
                                });
                            }
                        ]
                    }
                })
                // 学生发卡--发卡管理-
                .state('access.app.partner.cardManagement.strCodeBind', {
                    url: '/strCodeBind?isEearch',
                    templateUrl: 'partners/deviceManagement/cardManagement/strCodeBind/strCodeBindController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/deviceManagement/cardManagement/strCodeBind/strCodeBindController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //学校刷卡区域设置--学校设备
                .state('access.app.partner.schoolEquipment.attendanceAreaSetting', {
                    url: '/attendanceAreaSetting?GID',
                    templateUrl: 'partners/deviceManagement/schoolEquipment/attendanceAreaSetting/attendanceAreaSetting.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['partners/deviceManagement/schoolEquipment/attendanceAreaSetting/attendanceAreaSetting.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //添加刷卡区域--学校设备
                .state('access.app.partner.schoolEquipment.addArea', {
                    url: '/addArea',
                    templateUrl: 'partners/deviceManagement/schoolEquipment/attendanceAreaSetting/addArea.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['partners/deviceManagement/schoolEquipment/attendanceAreaSetting/addArea.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //编辑刷卡区域--学校设备
                .state('access.app.partner.schoolEquipment.editArea', {
                    url: '/editArea?ID',
                    templateUrl: 'partners/deviceManagement/schoolEquipment/attendanceAreaSetting/editArea.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['partners/deviceManagement/schoolEquipment/attendanceAreaSetting/editArea.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 学生绑卡--发卡管理-
                .state('access.app.partner.cardManagement.stuBindCard', {
                    url: '/stuBindCard?ID',
                    templateUrl: 'partners/deviceManagement/cardManagement/strCodeBind/stuBindCardController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/deviceManagement/cardManagement/strCodeBind/stuBindCardController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 教师绑卡--发卡管理-
                .state('access.app.partner.cardManagement.teaBindCard', {
                    url: '/teaBindCard?ID',
                    templateUrl: 'partners/deviceManagement/cardManagement/teacherCodeBind/teaBindCardController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/deviceManagement/cardManagement/teacherCodeBind/teaBindCardController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 老师发卡--发卡管理-
                .state('access.app.partner.cardManagement.teacherCodeBind', {
                    url: '/teacherCodeBind',
                    templateUrl: 'partners/deviceManagement/cardManagement/teacherCodeBind/teacherCodeBindController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/deviceManagement/cardManagement/teacherCodeBind/teacherCodeBindController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //导入卡号规则
                .state('access.app.partner.cardManagement.importCardRule', {
                    url: '/importCardRule',
                    templateUrl: 'partners/deviceManagement/cardManagement/checkCard/importCardRule.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'partners/deviceManagement/cardManagement/checkCard/importCardRule.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 卡号数量申请审核--发卡管理-
                .state('access.app.partner.cardManagement.checkCard', {
                    url: '/checkCard',
                    templateUrl: 'partners/deviceManagement/cardManagement/checkCard/checkCard.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/deviceManagement/cardManagement/checkCard/checkCard.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 考勤流水
                .state('access.app.partner.attendanceData.checkLog', {
                    url: '/checkLog',
                    templateUrl: 'partners/deviceManagement/attendanceData/checkLog.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'partners/deviceManagement/attendanceData/checkLog.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 考勤数据
                .state('access.app.partner.attendanceData.attendanceDataRequire', {
                    url: '/attendanceDataRequire',
                    templateUrl: 'partners/deviceManagement/attendanceData/attendanceData.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'partners/deviceManagement/attendanceData/attendanceData.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })



                /*---------------------------关爱使管理-------------------------------------------start*/
                //关爱使首页
                .state('access.app.partner.internalPolicy.integralPondManagement', {
                    url: '/integralPondManagement',
                    templateUrl: 'partners/shopInternal/internalPolicy/integralPondManagement/integralPondManagementController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/shopInternal/internalPolicy/integralPondManagement/integralPondManagementController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                //创建关爱使用
                .state('access.app.partner.internalPolicy.createIntegral', {
                    url: '/createIntegral',
                    templateUrl: 'partners/shopInternal/internalPolicy/integralPondManagement/createIntegralController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/shopInternal/internalPolicy/integralPondManagement/createIntegralController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                //配置策略集
                .state('access.app.partner.internalPolicy.setPolicy', {
                    url: '/setPolicy?UName&GName&UID&GID',
                    templateUrl: 'partners/shopInternal/internalPolicy/integralPondManagement/setPolicyController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'partners/shopInternal/internalPolicy/integralPondManagement/setPolicyController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                /*---------------------------关爱使管理-------------------------------------------end*/


                /*---------------------------积分仓库---------------------------------------------start*/
                // 积分仓库
                .state('access.app.partners.internalWarehouse.warehouseList', {
                    url: '/warehouseList',
                    templateUrl: 'partners/shopInternal/internalWarehouse/warehouseList/warehouseList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shopInternal/internalWarehouse/warehouseList/warehouseList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------积分仓库---------------------------------------------send*/

                /*---------------------------积分策略---------------------------------------------start*/
                //关爱使设置
                .state('access.app.partner.internalPolicy.AmbassadorSet', {
                    url: '/AmbassadorSet',
                    templateUrl: 'partners/shopInternal/internalPolicy/AmbassadorSet/AmbassadorSet.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shopInternal/internalPolicy/AmbassadorSet/AmbassadorSet.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                // 积分策略
                .state('access.app.partner.internalPolicy.internalPolicyList', {
                    url: '/internalPolicyList',
                    templateUrl: 'partners/shopInternal/internalPolicy/internalPolicyList/internalPolicyList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shopInternal/internalPolicy/internalPolicyList/internalPolicyList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                //积分策略 -- 规则清单
                .state('access.app.partner.internalPolicy.listOfRegulation', {
                    url: '/listOfRegulation?sid&sName&type',
                    templateUrl: 'partners/shopInternal/internalPolicy/internalPolicyList/listOfRegulationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shopInternal/internalPolicy/internalPolicyList/listOfRegulationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                //
                // //积分策略 -- 人员清单--创建关爱使
                // .state('access.app.partner.internalPolicy.createIntegral2', {
                //     url: '/createIntegral2',
                //     templateUrl: 'partners/shopInternal/internalPolicy/internalPolicyList/createIntegral2Controller.html' + APPMODEL.dateMath,
                //     resolve: {
                //         deps: ['$ocLazyLoad',
                //             function ($ocLazyLoad) {
                //                 return $ocLazyLoad.load(['ui.select']).then(function () {
                //                     return $ocLazyLoad.load({
                //                         files: [
                //                             'public/css/productStyle.css' + APPMODEL.dateMath,
                //                             'partners/shopInternal/internalPolicy/internalPolicyList/createIntegral2Controller.js' + APPMODEL.dateMath
                //                         ]
                //                     })
                //                 });
                //             }
                //         ]
                //     }
                // })

                //积分策略 -- 人员清单--所有生效人员
                .state('access.app.partner.internalPolicy.listOfEffectiveRoleAllController', {
                    url: '/listOfEffectiveRoleAll?sid&sName',
                    templateUrl: 'partners/shopInternal/internalPolicy/internalPolicyList/listOfEffectiveRoleAllController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shopInternal/internalPolicy/internalPolicyList/listOfEffectiveRoleAllController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                //积分策略 -- 人员清单
                .state('access.app.partner.internalPolicy.listOfEffectiveRoleController', {
                    url: '/listOfEffectiveRole?sid&sName',
                    templateUrl: 'partners/shopInternal/internalPolicy/internalPolicyList/listOfEffectiveRoleController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shopInternal/internalPolicy/internalPolicyList/listOfEffectiveRoleController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                //关爱使积分 --
                .state('access.app.partner.internalPolicy.listOfAmbassador', {
                    url: '/listOfAmbassador',
                    templateUrl: 'partners/shopInternal/internalPolicy/Ambassador/listOfAmbassadorController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shopInternal/internalPolicy/Ambassador/listOfAmbassadorController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //积分池
                .state('access.app.partner.internalPolicy.integralPond', {
                    url: '/integralPond',
                    templateUrl: 'partners/shopInternal/internalPolicy/integralPond/listOfintegralPondController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shopInternal/internalPolicy/integralPond/listOfintegralPondController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //支付
                .state('access.app.partner.internalPolicy.pay', {
                    url: '/pay',
                    templateUrl: 'partners/shopInternal/internalPolicy/integralPond/payController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/shopInternal/internalPolicy/integralPond/payController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                //合作伙伴学校开通
                .state('access.app.partner.schoolApplication.partnerSchoolApplication', {
                    url: '/partnerSchoolApplication',
                    templateUrl: 'partners/schoolApplication/partnerSchoolApplication/partnerSchoolApplication.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/schoolApplication/partnerSchoolApplication/partnerSchoolApplication.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })


        },
        /**
         * 内部运营
         */
        internal: function () {
            //$urlRouterProvider.when('access/app/internal/operationManagement/addPsychologicalScale', 'access/app/internal/operationManagement/addPsychologicalScale/basicInfo');
            $stateProvider
            /** =========================  应用管理  ========================= **/
            //服务项定义--应用收费开通（内部运营）
                .state('access.app.internal.applicationFeeOpen.serviceItemDefine', {
                    url: '/serviceItemDefine',
                    templateUrl: 'internal/applicationFeeManagement/applicationFeeOpen/serviceItemDefine/serviceItemDefineController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['internal/applicationFeeManagement/applicationFeeOpen/serviceItemDefine/serviceItemDefineController.js' + APPMODEL.dateMath]);
                            }]
                    }
                })
                // 开通情况查询--应用收费开通（内部运营）
                .state('access.app.internal.applicationFeeOpen.serviceProductOpenPage', {
                    url: '/serviceProductOpenPage',
                    templateUrl: 'internal/applicationFeeManagement/applicationFeeOpen/serviceProductOpenPage/serviceProductOpenPageInternalController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'internal/applicationFeeManagement/applicationFeeOpen/serviceProductOpenPage/serviceProductOpenPageInternalController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 缴费推送设置--应用收费开通（内部运营）
                .state('access.app.internal.applicationFeeOpen.paymentPushSet', {
                    url: '/paymentPushSet?gid',
                    templateUrl: 'internal/applicationFeeManagement/applicationFeeOpen/paymentPushSet/paymentPushSetInternalController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'internal/applicationFeeManagement/applicationFeeOpen/paymentPushSet/paymentPushSetInternalController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 新增缴费推送设置--缴费推送设置--应用收费开通（内部运营）
                .state('access.app.internal.applicationFeeOpen.addPaymentPushSet', {
                    url: '/addPaymentPushSet?gid&id',
                    templateUrl: 'internal/applicationFeeManagement/applicationFeeOpen/paymentPushSet/addPaymentPushSetController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['textAngular', 'ui.select']).then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath, 'internal/applicationFeeManagement/applicationFeeOpen/paymentPushSet/addPaymentPushSetController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                // 已缴费学生名单--缴费报表查询
                .state('access.app.internal.paymentTableSearch.alreadyPaymentStudentList', {
                    url: '/alreadyPaymentStudentList',
                    controller: 'alreadyPaymentStudentListController',
                    templateUrl: 'internal/applicationFeeManagement/paymentTableSearch/alreadyPaymentStudentList/alreadyPaymentStudentListController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'public/js/filters/paymentMethod.js' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentTableSearch/alreadyPaymentStudentList/alreadyPaymentStudentListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 未缴费学生名单--缴费报表查询
                .state('access.app.internal.paymentTableSearch.noPaymentStudentList', {
                    url: '/noPaymentStudentList',
                    controller: 'noPaymentStudentListController',
                    templateUrl: 'internal/applicationFeeManagement/paymentTableSearch/noPaymentStudentList/noPaymentStudentListController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentTableSearch/noPaymentStudentList/noPaymentStudentListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 缴费情况统计--缴费报表查询
                .state('access.app.internal.paymentTableSearch.costStatistics', {
                    url: '/costStatistics',
                    controller: 'costStatisticsController',
                    templateUrl: 'internal/applicationFeeManagement/paymentTableSearch/costStatistics/costStatisticsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentTableSearch/costStatistics/costStatisticsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 缴费按校统计--缴费报表查询（内部运营）
                .state('access.app.internal.paymentTableSearch.paymentBySchoolStatistics', {
                    url: '/paymentBySchoolStatistics',
                    templateUrl: 'internal/applicationFeeManagement/paymentTableSearch/paymentBySchoolStatistics/paymentBySchoolStatisticsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentTableSearch/paymentBySchoolStatistics/paymentBySchoolStatisticsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 缴费按校统计--缴费报表查询（内部运营）
                .state('access.app.internal.paymentTableSearch.paymentPersonNumber', {
                    url: '/paymentPersonNumber',
                    templateUrl: 'internal/applicationFeeManagement/paymentTableSearch/paymentPersonNumber/paymentPersonNumber.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentTableSearch/paymentPersonNumber/paymentPersonNumberController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //线下缴费明细查询
                .state('access.app.internal.paymentTableSearch.paymentDetailsEnquiry', {
                    url: '/paymentDetailsEnquiry',
                    templateUrl: 'internal/applicationFeeManagement/paymentTableSearch/paymentDetailsEnquiry/paymentDetailsEnquiry.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentTableSearch/paymentDetailsEnquiry/paymentDetailsEnquiry.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 缴费情况统计--缴费实时按班统计
                .state('access.app.internal.paymentTableSearch.paymentAnnClasSstatistics', {
                    url: '/paymentAnnClasSstatistics',
                    controller: 'paymentAnnClasSstatisticsController',
                    templateUrl: 'internal/applicationFeeManagement/paymentTableSearch/paymentAnnClasSstatistics/paymentAnnClasSstatisticsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentTableSearch/paymentAnnClasSstatistics/paymentAnnClasSstatisticsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 订阅号信息推送-服务包信息推送
                .state('access.app.internal.paymentMessage.subscriberPaymentMessage', {
                    url: '/subscriberPaymentMessage',
                    controller: 'SubscriberPaymentMessageController',
                    templateUrl: 'internal/applicationFeeManagement/paymentMessage/subscriberPaymentMessage/subscriberPaymentMessageController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentMessage/subscriberPaymentMessage/subscriberPaymentMessageController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 添加订阅号信息推送--服务包信息推送
                .state('access.app.internal.paymentMessage.addInformationPush', {
                    url: '/addInformationPush',
                    controller: 'AddInformationPushController',
                    templateUrl: 'internal/applicationFeeManagement/paymentMessage/subscriberPaymentMessage/addInformationPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentMessage/subscriberPaymentMessage/addInformationPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 短信推送--服务包信息推送
                .state('access.app.internal.paymentMessage.smsPush', {
                    url: '/smsPush',
                    controller: 'SmsPushController',
                    templateUrl: 'internal/applicationFeeManagement/paymentMessage/smsPush/smsPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentMessage/smsPush/smsPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 短信推送添加--服务包信息推送
                .state('access.app.internal.paymentMessage.addSmsPush', {
                    url: '/addSmsPush',
                    controller: 'AddSmsPushController',
                    templateUrl: 'internal/applicationFeeManagement/paymentMessage/smsPush/addSmsPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentMessage/smsPush/addSmsPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 首页固定入口--服务包信息推送
                .state('access.app.internal.paymentMessage.fixedEntryPush', {
                    url: '/fixedEntryPush',
                    controller: 'FixedEntryPushController',
                    templateUrl: 'internal/applicationFeeManagement/paymentMessage/fixedEntryPush/fixedEntryPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentMessage/fixedEntryPush/fixedEntryPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 首页固定入口添加推送--服务包信息推送
                .state('access.app.internal.paymentMessage.addFixedEntryPush', {
                    url: '/addFixedEntryPush',
                    controller: 'AddFixedEntryPushController',
                    templateUrl: 'internal/applicationFeeManagement/paymentMessage/fixedEntryPush/addFixedEntryPushController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentMessage/fixedEntryPush/addFixedEntryPushController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //缴费未成功查询
                .state('access.app.internal.paymentTableSearch.paymentNotSuccessful', {
                    url: '/paymentNotSuccessful',
                    templateUrl: 'internal/applicationFeeManagement/paymentTableSearch/paymentNotSuccessful/paymentNotSuccessfulController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentTableSearch/paymentNotSuccessful/paymentNotSuccessfulController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /** =========================  设备管理  ========================= **/
                // 学生发卡--发卡管理-
                .state('access.app.internal.cardManagement.strCodeBind', {
                    url: '/strCodeBind?isEearch',
                    templateUrl: 'internal/deviceManagement/cardManagement/strCodeBind/strCodeBindController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/deviceManagement/cardManagement/strCodeBind/strCodeBindController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 学生绑卡--发卡管理-
                .state('access.app.internal.cardManagement.stuBindCard', {
                    url: '/stuBindCard?ID',
                    templateUrl: 'internal/deviceManagement/cardManagement/strCodeBind/stuBindCardController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/deviceManagement/cardManagement/strCodeBind/stuBindCardController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 教师绑卡--发卡管理-
                .state('access.app.internal.cardManagement.teaBindCard', {
                    url: '/teaBindCard?ID',
                    templateUrl: 'internal/deviceManagement/cardManagement/teacherCodeBind/teaBindCardController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/deviceManagement/cardManagement/teacherCodeBind/teaBindCardController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 班级批量发卡--学生发卡--发卡管理
                .state('access.app.internal.cardManagement.classBatchCode', {
                    url: '/classBatchCode',
                    templateUrl: 'internal/deviceManagement/cardManagement/strCodeBind/classBatchCodeController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/deviceManagement/cardManagement/strCodeBind/classBatchCodeController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 个人卡号信息--学生发卡--发卡管理
                .state('access.app.internal.cardManagement.classHairpin', {
                    url: '/classHairpin?umid&isEearch',
                    templateUrl: 'internal/deviceManagement/cardManagement/strCodeBind/classHairpinController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['internal/deviceManagement/cardManagement/strCodeBind/classHairpinController.js' + APPMODEL.dateMath]);
                            }]
                    }
                })
                // 异常数据检查--学生发卡--发卡管理
                .state('access.app.internal.cardManagement.abnormalDataCheck', {
                    url: '/abnormalDataCheck',
                    templateUrl: 'internal/deviceManagement/cardManagement/strCodeBind/abnormalDataCheckController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['internal/deviceManagement/cardManagement/strCodeBind/abnormalDataCheckController.js' + APPMODEL.dateMath]);
                            }]
                    }
                })
                // 老师发卡--发卡管理-
                .state('access.app.internal.cardManagement.teacherCodeBind', {
                    url: '/teacherCodeBind',
                    templateUrl: 'internal/deviceManagement/cardManagement/teacherCodeBind/teacherCodeBindController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/deviceManagement/cardManagement/teacherCodeBind/teacherCodeBindController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 卡号数量申请审核--发卡管理-
                .state('access.app.internal.cardManagement.checkCard', {
                    url: '/checkCard',
                    templateUrl: 'internal/deviceManagement/cardManagement/checkCard/checkCard.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/deviceManagement/cardManagement/checkCard/checkCard.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 老师批量发卡--老师发卡--发卡管理
                .state('access.app.internal.cardManagement.teacherBatchCode', {
                    url: '/teacherBatchCode',
                    templateUrl: 'internal/deviceManagement/cardManagement/teacherCodeBind/teacherBatchCodeController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['internal/deviceManagement/cardManagement/teacherCodeBind/teacherBatchCodeController.js' + APPMODEL.dateMath]);
                            }]
                    }
                })
                // 个人卡号信息--老师发卡--发卡管理
                .state('access.app.internal.cardManagement.teacherHairpin', {
                    url: '/teacherHairpin?umid&isEearch',
                    templateUrl: 'internal/deviceManagement/cardManagement/teacherCodeBind/teacherHairpinController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['internal/deviceManagement/cardManagement/teacherCodeBind/teacherHairpinController.js' + APPMODEL.dateMath]);
                            }]
                    }
                })
                // 异常数据检查--老师发卡--发卡管理
                .state('access.app.internal.cardManagement.teacherDataCheck', {
                    url: '/teacherDataCheck',
                    templateUrl: 'internal/deviceManagement/cardManagement/teacherCodeBind/teacherDataCheckController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['internal/deviceManagement/cardManagement/teacherCodeBind/teacherDataCheckController.js' + APPMODEL.dateMath]);
                            }]
                    }
                })



                // 查询卡号详情--发卡管理
                .state('access.app.internal.cardManagement.cardInquire', {
                    url: '/cardInquire',
                    templateUrl: 'internal/deviceManagement/cardManagement/cardRegister/cardInquireController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/cardManagement/cardRegister/cardInquireController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //导入卡号规则
                .state('access.app.internal.cardManagement.importCardRule', {
                    url: '/importCardRule',
                    templateUrl: 'internal/deviceManagement/cardManagement/checkCard/importCardRule.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/cardManagement/checkCard/importCardRule.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------基础数据管理（内部运营）---------------------------start*/
                // 打卡类型定义--基础数据管理
                .state('access.app.internal.basicDataControl.checkInsType', {
                    url: '/checkInsType',
                    templateUrl: 'internal/deviceManagement/basicDataControl/checkInsType/checkInsTypeController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/basicDataControl/checkInsType/checkInsTypeController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 供应商设备定义--基础数据管理
                .state('access.app.internal.basicDataControl.providerDeviceType', {
                    url: '/providerDeviceType',
                    templateUrl: 'internal/deviceManagement/basicDataControl/providerDeviceType/providerDeviceTypeController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/basicDataControl/providerDeviceType/providerDeviceTypeController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 供应商设备参数列表--基础数据管理
                .state('access.app.internal.basicDataControl.deviceArgumentsList', {
                    url: '/deviceArgumentsList?ID',
                    templateUrl: 'internal/deviceManagement/basicDataControl/providerDeviceType/deviceArgumentsList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/basicDataControl/providerDeviceType/deviceArgumentsListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 合作伙伴卡号号段--基础数据管理
                .state('access.app.internal.basicDataControl.partnerCardNumberRange', {
                    url: '/partnerCardNumberRange',
                    templateUrl: 'internal/deviceManagement/basicDataControl/partnerCardNumberRange/partnerCardNumberRangeController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/basicDataControl/partnerCardNumberRange/partnerCardNumberRangeController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------学校设备（内部运营）---------------------------start*/
                // 学校设备登记--学校设备
                .state('access.app.internal.schoolEquipment.schoolEquipmentRegistration', {
                    url: '/schoolEquipmentRegistration?id&newModel',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/schoolEquipmentRegistration/schoolEquipmentRegistrationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/deviceManagement/schoolEquipment/schoolEquipmentRegistration/schoolEquipmentRegistrationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 添加/更新设备--学校设备登记--学校设备
                .state('access.app.internal.schoolEquipment.editAddEquipmentRegistration', {
                    url: '/editAddEquipmentRegistration?id&newModel',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/schoolEquipmentRegistration/editAddEquipmentRegistrationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, 'internal/deviceManagement/schoolEquipment/schoolEquipmentRegistration/china-city-list.js',
                                            'internal/deviceManagement/schoolEquipment/schoolEquipmentRegistration/editAddEquipmentRegistrationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 设备在线率--学校设备
                .state('access.app.internal.schoolEquipment.equipmentOnLineRate', {
                    url: '/equipmentOnLineRate',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/equipmentOnLineRate/equipmentOnLineRateController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/deviceManagement/schoolEquipment/equipmentOnLineRate/equipmentOnLineRateController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //考勤机刷卡率--学校设备
                .state('access.app.internal.schoolEquipment.attendanceMachineCreditCardRate', {
                    url: '/attendanceMachineCreditCardRate',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/attendanceMachineCreditCardRate/attendanceMachineCreditCardRateController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['internal/deviceManagement/schoolEquipment/attendanceMachineCreditCardRate/attendanceMachineCreditCardRateController.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //学校刷卡区域设置--学校设备
                .state('access.app.internal.schoolEquipment.attendanceAreaSetting', {
                    url: '/attendanceAreaSetting?GID',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/attendanceAreaSetting/attendanceAreaSetting.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['internal/deviceManagement/schoolEquipment/attendanceAreaSetting/attendanceAreaSetting.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //添加刷卡区域--学校设备
                .state('access.app.internal.schoolEquipment.addArea', {
                    url: '/addArea',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/attendanceAreaSetting/addArea.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['internal/deviceManagement/schoolEquipment/attendanceAreaSetting/addArea.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //编辑刷卡区域--学校设备
                .state('access.app.internal.schoolEquipment.editArea', {
                    url: '/editArea?ID',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/attendanceAreaSetting/editArea.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['internal/deviceManagement/schoolEquipment/attendanceAreaSetting/editArea.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新学校设备登记--学校设备
                .state('access.app.internal.schoolEquipment.newSchoolEquipmentReg', {
                    url: '/newSchoolEquipmentReg?ID',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/newSchoolEquipmentReg/newSchoolEquipmentReg.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['internal/deviceManagement/schoolEquipment/newSchoolEquipmentReg/newSchoolEquipmentRegController.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新学校设备--编辑--学校设备
                .state('access.app.internal.schoolEquipment.editEq', {
                    url: '/editEq?ID',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/newSchoolEquipmentReg/editEq.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/schoolEquipment/newSchoolEquipmentReg/editEqController.js' + APPMODEL.dateMath,
                                            'internal/deviceManagement/schoolEquipment/schoolEquipmentRegistration/china-city-list.js']
                                    })
                                });
                            }
                        ]
                    }
                })
                //新学校设备--新增--学校设备
                .state('access.app.internal.schoolEquipment.addEq', {
                    url: '/addEq',
                    templateUrl: 'internal/deviceManagement/schoolEquipment/newSchoolEquipmentReg/addEq.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/schoolEquipment/newSchoolEquipmentReg/addEqController.js' + APPMODEL.dateMath,
                                            'internal/deviceManagement/schoolEquipment/schoolEquipmentRegistration/china-city-list.js']
                                    })
                                });
                            }
                        ]
                    }
                })

                // 考勤流水
                .state('access.app.internal.attendanceData.checkLog', {
                    url: '/checkLog',
                    templateUrl: 'internal/deviceManagement/attendanceData/checkLog.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/attendanceData/checkLog.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 考勤数据
                .state('access.app.internal.attendanceData.attendanceDataRequire', {
                    url: '/attendanceDataRequire',
                    templateUrl: 'internal/deviceManagement/attendanceData/attendanceData.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/deviceManagement/attendanceData/attendanceData.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------学校设备（内部运营）---------------------------end*/
                /*---------------------------缴费异常处理（内部运营）---------------------------start*/
                // 缴费异常情况--缴费报表查询
                .state('access.app.internal.paymentAnomalyHandle.paymentAnomaly', {
                    url: '/paymentAnomaly',
                    controller: 'paymentAnomalyController',
                    templateUrl: 'internal/applicationFeeManagement/paymentAnomalyHandle/paymentAnomaly/paymentAnomalyController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentAnomalyHandle/paymentAnomaly/paymentAnomalyController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 缴费异常情况--缴费报表查询
                .state('access.app.internal.paymentAnomalyHandle.modifyPaymentAnomaly', {
                    url: '/modifyPaymentAnomaly',
                    controller: 'ModifyPaymentAnomalyController',
                    templateUrl: 'internal/applicationFeeManagement/paymentAnomalyHandle/paymentAnomaly/modifyPaymentAnomalyController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/paymentAnomalyHandle/paymentAnomaly/modifyPaymentAnomalyController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------缴费异常处理（内部运营）---------------------------end*/
                // 应用收费核销--应用收费
                .state('access.app.internal.applicationFee.applicationFeeVerification', {
                    url: '/applicationFeeVerification',
                    templateUrl: 'internal/financialManagement/applicationFee/applicationFeeVerification/applicationFeeVerificationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/financialManagement/applicationFee/applicationFeeVerification/applicationFeeVerificationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 支付中心订单查询--应用收费
                .state('access.app.internal.applicationFee.paymentCenterOrder', {
                    url: '/paymentCenterOrder',
                    templateUrl: 'internal/financialManagement/applicationFee/paymentCenterOrder/paymentCenterOrderController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/financialManagement/applicationFee/paymentCenterOrder/paymentCenterOrderController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 退款登记--应用收费
                .state('access.app.internal.applicationFee.refundRegistration', {
                    url: '/refundRegistration',
                    templateUrl: 'internal/financialManagement/applicationFee/refundRegistration/refundRegistration.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/financialManagement/applicationFee/refundRegistration/refundRegistrationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 导入线下缴费
                .state('access.app.internal.applicationFee.offlinePayment', {
                    url: '/offlinePayment',
                    templateUrl: 'internal/financialManagement/applicationFee/offlinePayment/offlinePayment.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/financialManagement/applicationFee/offlinePayment/offlinePayment.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------短信---------------------------start*/
                // 学校短信规则配置--学校短信（内部运营）
                .state('access.app.internal.schoolMessage.schoolMessageConfiguration', {
                    url: '/schoolMessageConfiguration?type&gid',
                    templateUrl: 'internal/shortMessage/schoolMessage/schoolMessageConfiguration/schoolMessageConfigurationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/shortMessage/schoolMessage/schoolMessageConfiguration/schoolMessageConfigurationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增或编辑短信发送规则--学校短信（内部运营）
                .state('access.app.internal.schoolMessage.addOrEditConfiguration', {
                    url: '/addOrEditConfiguration?type&gid',
                    templateUrl: 'internal/shortMessage/schoolMessage/schoolMessageConfiguration/addOrEditConfigurationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            '../bower_components/date/jquery-date/demo1/laydate.dev.js',
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/shortMessage/schoolMessage/schoolMessageConfiguration/addOrEditConfigurationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增或编辑短信接收规则--学校短信（内部运营）
                .state('access.app.internal.schoolMessage.addOrEditReceive', {
                    url: '/addOrEditReceive?type&gid',
                    templateUrl: 'internal/shortMessage/schoolMessage/schoolMessageConfiguration/addOrEditReceiveController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/shortMessage/schoolMessage/schoolMessageConfiguration/addOrEditReceiveController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 短信群发（内部运营）
                .state('access.app.internal.schoolMessage.smsGroupSends', {
                    url: '/smsGroupSends',
                    templateUrl: 'internal/shortMessage/schoolMessage/smsGroupSends/smsGroupSendsController.html' + APPMODEL.dateMath,
                    controller: 'SmsGroupSendsController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/shortMessage/schoolMessage/smsGroupSends/smsGroupSendsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------短信---------------------------end*/
                /*---------------------------报表查询-----------------------start*/
                // 通知发送情况查询--通知作业--报表查询（内部运营）
                .state('access.app.internal.notificationOperation.notificationSentQuery', {
                    url: '/notificationSentQuery',
                    templateUrl: 'internal/reportQuery/notificationOperation/notificationSentQuery/notificationSentQueryController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/reportQuery/notificationOperation/notificationSentQuery/notificationSentQueryController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //App使用情况查询
                .state('access.app.internal.appUseCondition.appUseConditionSerch', {
                    url: '/appUseConditionSerch',
                    templateUrl: 'internal/reportQuery/appUseCondition/appUseConditionSerch/appUseConditionSerch.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/reportQuery/appUseCondition/appUseConditionSerch/appUseConditionSerchController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //功能使用情况查询
                .state('access.app.internal.appUseCondition.functionUsageRate', {
                    url: '/functionUsageRate',
                    templateUrl: 'internal/reportQuery/appUseCondition/functionUsageRate/functionUsageRate.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/reportQuery/appUseCondition/functionUsageRate/functionUsageRate.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //短信使用情况查询
                .state('access.app.internal.noteUseCondition.noteUseConditionSerch', {
                    url: '/noteUseConditionSerch',
                    templateUrl: 'internal/reportQuery/note/noteUseCondition/noteUseConditionSerch.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/reportQuery/note/noteUseCondition/noteUseConditionSerchContoller.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //圈子使用情况
                .state('access.app.internal.friendCircle.friendCircleUseConditionSerch', {
                    url: '/friendCircleUseConditionSerch',
                    templateUrl: 'internal/reportQuery/friendCircle/friendCircleUseCondition/friendCircleUseConditionSerch.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/reportQuery/friendCircle/friendCircleUseCondition/friendCircleUseConditionSerchController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //学校圈发帖统计
                .state('access.app.internal.friendCircle.SchoolToicCnt', {
                    url: '/SchoolToicCnt',
                    templateUrl: 'internal/reportQuery/friendCircle/schoolToicCnt/schoolToicCntSerch.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/reportQuery/friendCircle/schoolToicCnt/schoolToicCntSerchController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //班级圈发帖统计
                .state('access.app.internal.friendCircle.ClassTopicCnt', {
                    url: '/ClassTopicCnt',
                    templateUrl: 'internal/reportQuery/friendCircle/classTopicCnt/classTopicCntSerch.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/reportQuery/friendCircle/classTopicCnt/classTopicCntSerchController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //群聊使用情况查询
                .state('access.app.internal.groupChat.groupChatUseConditionSerch', {
                    url: '/groupChatUseConditionSerch',
                    templateUrl: 'internal/reportQuery/groupChat/groupChatUseCondition/groupChatUseConditionSerch.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/reportQuery/groupChat/groupChatUseCondition/groupChatUseConditionSerchController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------报表查询-----------------------end*/
                /** =========================  营养健康测评系统  ========================= **/
                /*--------------------------- 量表管理 ----------------------- */
                // 测评量表列表
                .state('access.app.internal.nutritionScalMannage.scaleList', {
                    url: '/scaleList',
                    controller: 'nutritionHealthScaleListController',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/nutritionHealthScaleList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'uiSwitch']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/nutritionHealthScaleListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增量表基本信息
                .state('access.app.internal.nutritionScalMannage.addScaleBasicInfo', {
                    url: '/addScaleBasicInfo',
                    controller: 'addScaleBasicInfoController',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/addScaleBasicInfo.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'uiSwitch']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/addScaleBasicInfoController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增量表用户属性
                .state('access.app.internal.nutritionScalMannage.addScaleUserAttribute', {
                    url: '/addScaleUserAttribute',
                    controller: 'addScaleUserAttributeController',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/addScaleUserAttribute.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'uiSwitch']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/addScaleUserAttributeController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增量表题库
                .state('access.app.internal.nutritionScalMannage.addScalQuestion', {
                    url: '/addScalQuestion',
                    controller: 'addScalQuestionController',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/addScalQuestion.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'xeditable']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/addScalQuestionController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增量表因子定义
                .state('access.app.internal.nutritionScalMannage.addScaleFactor', {
                    url: '/addScaleFactor',
                    controller: 'addScaleFactorController',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/addScaleFactor.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'uiSwitch']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/addScaleFactorController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增量表因子解释
                .state('access.app.internal.nutritionScalMannage.factorExplain', {
                    url: '/factorExplain',
                    controller: 'factorExplainController',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/factorExplain.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'uiSwitch']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/nutritionHealthScaleManagement/factorExplainController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //测试任务
                .state('access.app.internal.nutritionScalMannage.scaleTestTask', {
                    url: '/scaleTestTask',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/scaleTestTask/scaleTestTaskController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/scaleTestTask/scaleTestTaskController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 营养健康统计分析
                .state('access.app.internal.nutritionScalMannage.statisticAnalyze', {
                    url: '/statisticAnalyze?orderId&scalId&topGID',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/scaleTestTask/statisticAnalyze.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            '../bower_components/echarts/echarts.min.js' + APPMODEL.dateMath,
                                            '../bower_components/echarts/theme.js' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/scaleTestTask/statisticAnalyzeController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增测试任务
                .state('access.app.internal.nutritionScalMannage.addScaleTestTask', {
                    url: '/addScaleTestTask?Name&TopGName&TopGID&ScaID&BDate&EDate&Desc',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/scaleTestTask/addScaleTestTaskController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/scaleTestTask/addScaleTestTaskController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //获取已测试人员清单
                .state('access.app.internal.nutritionScalMannage.getTestPeople', {
                    url: '/getTestPeople?orderID&TopGID',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/scaleTestTask/getTestPeopleController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/scaleTestTask/getTestPeopleController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //获取未测试人员清单
                .state('access.app.internal.nutritionScalMannage.unTestPeople', {
                    url: '/unTestPeople?orderID&TopGID',
                    controller: 'UnTestPeopleController',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/scaleTestTask/unTestPeopleController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/scaleTestTask/unTestPeopleController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //查看测试结果
                .state('access.app.internal.nutritionScalMannage.viewResults', {
                    url: '/viewResults?recordID',
                    templateUrl: 'internal/nutritionAndHealth/scaleManagement/scaleTestTask/viewResultsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/scaleManagement/scaleTestTask/viewResultsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*------------------------------------------------------营养健康运营维护-----------------------------------------------------*/
                // 营养健康banner设置
                .state('access.app.internal.nutritionOperationManagement.bannerSet', {
                    url: '/bannerSet',
                    templateUrl: 'internal/nutritionAndHealth/operationManagement/bannerSet/bannerSet.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/operationManagement/bannerSet/bannerSetController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 营养健康新增banner设置
                .state('access.app.internal.nutritionOperationManagement.addBanner', {
                    url: '/addBanner?type',
                    templateUrl: 'internal/nutritionAndHealth/operationManagement/bannerSet/addBanner.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, 'internal/nutritionAndHealth/operationManagement/bannerSet/addBannerController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 营养健康文章维护
                .state('access.app.internal.nutritionOperationManagement.articleMaintain', {
                    url: '/articleMaintain',
                    templateUrl: 'internal/nutritionAndHealth/operationManagement/articleMaintain/articleMaintain.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/operationManagement/articleMaintain/articleMaintainController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 增加营养健康文章
                .state('access.app.internal.nutritionOperationManagement.addArticle', {
                    url: '/addArticle',
                    templateUrl: 'internal/nutritionAndHealth/operationManagement/articleMaintain/addArticle.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/operationManagement/articleMaintain/addArticleController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 营养健康个人秀维护
                .state('access.app.internal.nutritionOperationManagement.personalShow', {
                    url: '/personalShow',
                    templateUrl: 'internal/nutritionAndHealth/operationManagement/personalShow/personalShow.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/operationManagement/personalShow/personalShowController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //首页维护
                .state('access.app.internal.nutritionOperationManagement.homeMaintenance', {
                    url: '/homeMaintenance',
                    templateUrl: 'internal/nutritionAndHealth/operationManagement/homeMaintenance/homeMaintenanceController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath, 'internal/nutritionAndHealth/operationManagement/homeMaintenance/homeMaintenanceController.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //专家维护
                .state('access.app.internal.nutritionOperationManagement.expertMaintenance', {
                    url: '/expertMaintenance?id&name&tel',
                    templateUrl: 'internal/nutritionAndHealth/operationManagement/expertMaintenance/expertMaintenanceController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/operationManagement/expertMaintenance/expertMaintenanceController.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                //专家维护详细信息
                .state('access.app.internal.nutritionOperationManagement.expertMaintenanceDetailedInformation', {
                    url: '/expertMaintenanceDetailedInformation?id&name&tel',
                    templateUrl: 'internal/nutritionAndHealth/operationManagement/expertMaintenance/expertMaintenanceDetailedInformationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: ['public/css/productStyle.css' + APPMODEL.dateMath, 'public/js/constant/city.js',
                                            'internal/nutritionAndHealth/operationManagement/expertMaintenance/expertMaintenanceDetailedInformationController.js' + APPMODEL.dateMath]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 服务清单
                .state('access.app.internal.nutritionBasicDictionary.serviceList', {
                    url: '/serviceList',
                    templateUrl: 'internal/nutritionAndHealth/basicDictionary/serviceList/serviceList.html' + APPMODEL.dateMath,
                    controller: 'ServiceListController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/basicDictionary/serviceList/serviceListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 添加修改服务清单
                .state('access.app.internal.nutritionBasicDictionary.saveService', {
                    url: '/saveService/:id',
                    templateUrl: 'internal/nutritionAndHealth/basicDictionary/serviceList/saveService.html' + APPMODEL.dateMath,
                    controller: 'SaveServiceController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/basicDictionary/serviceList/saveServiceController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 身高参考
                .state('access.app.internal.nutritionBasicDictionary.heightReference', {
                    url: '/heightReference',
                    templateUrl: 'internal/nutritionAndHealth/basicDictionary/heightReference/heightReference.html' + APPMODEL.dateMath,
                    controller: 'HeightReferenceController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/basicDictionary/heightReference/heightReferenceController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 添加修改身高字典
                .state('access.app.internal.nutritionBasicDictionary.saveHeightDictionary', {
                    url: '/saveHeightDictionary/:id',
                    templateUrl: 'internal/nutritionAndHealth/basicDictionary/heightReference/saveHeightDictionary.html' + APPMODEL.dateMath,
                    controller: 'SaveHeightDictionaryController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/basicDictionary/heightReference/saveHeightDictionaryController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 体重参考
                .state('access.app.internal.nutritionBasicDictionary.weightReference', {
                    url: '/weightReference',
                    templateUrl: 'internal/nutritionAndHealth/basicDictionary/weightReference/weightReference.html' + APPMODEL.dateMath,
                    controller: 'WeightReferenceController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/basicDictionary/weightReference/weightReferenceController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                // 添加修改体重字典
                .state('access.app.internal.nutritionBasicDictionary.saveWeightDictionary', {
                    url: '/saveWeightDictionary/:id',
                    templateUrl: 'internal/nutritionAndHealth/basicDictionary/weightReference/saveWeightDictionary.html' + APPMODEL.dateMath,
                    controller: 'SaveWeightDictionaryController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/basicDictionary/weightReference/saveWeightDictionaryController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 用户订单
                .state('access.app.internal.nutritionOrderManagement.userOrder', {
                    url: '/userOrder',
                    templateUrl: 'internal/nutritionAndHealth/orderManagement/userOrder/userOrder.html' + APPMODEL.dateMath,
                    controller: 'UserOrderController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/orderManagement/userOrder/userOrderController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 专家导测 根据用户订单查看用户提问信息
                .state('access.app.internal.nutritionOrderManagement.userTestQuestion', {
                    url: '/userTestQuestion/:id',
                    templateUrl: 'internal/nutritionAndHealth/orderManagement/userOrder/userTestQuestion.html' + APPMODEL.dateMath,
                    controller: 'UserTestQuestionController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/orderManagement/userOrder/userTestQuestionController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                // 专家导测 根据用户订单查看测试人员结果
                .state('access.app.internal.nutritionOrderManagement.userTestResult', {
                    url: '/userTestResult/:id',
                    templateUrl: 'internal/nutritionAndHealth/orderManagement/userOrder/userTestResult.html' + APPMODEL.dateMath,
                    controller: 'UserTestResultController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/orderManagement/userOrder/userTestResultController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 家庭成员
                .state('access.app.internal.nutritionOrderManagement.family', {
                    url: '/family',
                    templateUrl: 'internal/nutritionAndHealth/orderManagement/family/family.html' + APPMODEL.dateMath,
                    controller: 'FamilyController',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/nutritionAndHealth/orderManagement/family/familyController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /** ========================= 心理测评系统  ========================= **/
                /*--------------------------- 量表管理 ----------------------- */
                // 心理量表管理 - 运营维护
                .state('access.app.internal.operationManagement.psychologicalScale', {
                    url: '/psychologicalScale',
                    controller: 'PsychologicalScaleController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalScale/psychologicalScaleController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'uiSwitch']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/psychologicalScale/psychologicalScaleController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增量表管理
                .state('access.app.internal.operationManagement.addPsychologicalScale', {
                    url: '/addPsychologicalScale',
                    controller: 'AddPsychologicalScaleController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalScale/addPsychologicalScaleController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'xeditable']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/psychologicalScale/addPsychologicalScaleController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                .state('access.app.internal.operationManagement.addPsychologicalScale.basicInfo', {
                    url: '/basicInfo',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalScale/addBasicInfoController.html'
                })
                .state('access.app.internal.operationManagement.addPsychologicalScale.userAttribute', {
                    url: '/userAttribute',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalScale/addUserAttributeController.html'
                })
                .state('access.app.internal.operationManagement.addPsychologicalScale.questionBank', {
                    url: '/questionBank',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalScale/addQuestionBankController.html'
                })
                .state('access.app.internal.operationManagement.addPsychologicalScale.factorDefinition', {
                    url: '/factorDefinition',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalScale/addFactorDefinitionController.html'
                })
                .state('access.app.internal.operationManagement.addPsychologicalScale.anomalyJudgment', {
                    url: '/anomalyJudgment',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalScale/addAnomalyJudgmentController.html'
                })
                .state('access.app.internal.operationManagement.addPsychologicalScale.factorInterpretation', {
                    url: '/factorInterpretation',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalScale/addFactorInterpretationController.html'
                })
                /*--------------------------- 学校收费管理 ----------------------- */
                // 学校收费管理 --- 暂时删除（保留项目中）
                .state('access.app.internal.operationManagement.chargeSchool', {
                    url: '/chargeSchool',
                    controller: 'ChargeSchoolController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/chargeSchool/chargeSchoolController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'uiSwitch']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/chargeSchool/chargeSchoolController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增学校收费 --- 暂时删除（保留项目中）
                .state('access.app.internal.operationManagement.addChargeSchool', {
                    url: '/addChargeSchool',
                    controller: 'AddChargeSchoolController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/chargeSchool/addChargeSchoolController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'xeditable']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/chargeSchool/addChargeSchoolController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*--------------------------- 学校测试订单/量表销售 ----------------------- */
                // 学校测试订单
                .state('access.app.internal.operationManagement.schoolTestTask', {
                    url: '/schoolTestTask',
                    controller: 'SchoolTestTaskController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/schoolTestTask/schoolTestTaskController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'xeditable']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/schoolTestTask/schoolTestTaskController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增学校测试任务
                .state('access.app.internal.operationManagement.addSchoolTestTask', {
                    url: '/addSchoolTestTask',
                    controller: 'AddSchoolTestTaskController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/schoolTestTask/addSchoolTestTaskController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'xeditable']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/schoolTestTask/addSchoolTestTaskController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 查看学校测试任务详细
                .state('access.app.internal.operationManagement.detailSchoolTestTask', {
                    url: '/detailSchoolTestTask',
                    controller: 'DetailSchoolTestTaskController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/schoolTestTask/detailSchoolTestTaskController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    serie: true,
                                    files: [
                                        'public/css/productStyle.css' + APPMODEL.dateMath,
                                        'internal/psychologicalEvaluation/operationManagement/schoolTestTask/detailSchoolTestTaskController.js' + APPMODEL.dateMath
                                    ]
                                })
                            }
                        ]
                    }
                })
                // 已测试人员清单
                .state('access.app.internal.operationManagement.alreadyTestPersonnel', {
                    url: '/alreadyTestPersonnel?id&gid',
                    controller: 'AlreadyTestPersonnelController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/schoolTestTask/alreadyTestPersonnelController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/schoolTestTask/alreadyTestPersonnelController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 测试人员结果
                .state('access.app.internal.operationManagement.testPersonnelResult', {
                    url: '/testPersonnelResult/:id',
                    controller: 'TestPersonnelResultController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/schoolTestTask/testPersonnelResultController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/schoolTestTask/testPersonnelResultController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 运营维护--量表授权（内部运营）
                .state('access.app.internal.operationManagement.scaleAuthorization', {
                    url: '/scaleAuthorization',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/scaleAuthorization/scaleAuthorizationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'internal/psychologicalEvaluation/operationManagement/scaleAuthorization/scaleAuthorizationController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })
                /*--------------------------- 心理专家维护 ----------------------- */
                // 心理专家维护
                .state('access.app.internal.operationManagement.psychologicalExpert', {
                    url: '/psychologicalExpert',
                    controller: 'PsychologicalExpertController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalExpert/psychologicalExpertController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/psychologicalExpert/psychologicalExpertController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增心理专家维护
                .state('access.app.internal.operationManagement.addPsychologicalExpert', {
                    url: '/addPsychologicalExpert/:id',
                    controller: 'AddPsychologicalExpertController',
                    templateUrl: 'internal/psychologicalEvaluation/operationManagement/psychologicalExpert/addPsychologicalExpertController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'ngImgCrop', 'textAngular']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/operationManagement/psychologicalExpert/addPsychologicalExpertController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*--------------------------- 学校测试订单/量表销售 ----------------------- */
                // 心理知识维护
                .state('access.app.internal.knowledgeInformation.psychologicalKnowledge', {
                    url: '/psychologicalKnowledge',
                    controller: 'PsychologicalKnowledgeController',
                    templateUrl: 'internal/psychologicalEvaluation/knowledgeInformation/psychologicalKnowledge/psychologicalKnowledgeController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'xeditable']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/knowledgeInformation/psychologicalKnowledge/psychologicalKnowledgeController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增心理知识维护
                .state('access.app.internal.knowledgeInformation.addPsychologicalKnowledge', {
                    url: '/addPsychologicalKnowledge/:id',
                    controller: 'AddPsychologicalKnowledgeController',
                    templateUrl: 'internal/psychologicalEvaluation/knowledgeInformation/psychologicalKnowledge/addPsychologicalKnowledgeController.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'textAngular']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css', '../bower_components/jQuery-File-Upload/js/vendor/jquery.ui.widget.js', '../bower_components/jQuery-File-Upload/js/jquery.iframe-transport.js', '../bower_components/jQuery-File-Upload/js/jquery.fileupload.js',
                                            'internal/psychologicalEvaluation/knowledgeInformation/psychologicalKnowledge/addPsychologicalKnowledgeController.js'
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 全网心理资讯维护
                .state('access.app.internal.knowledgeInformation.psychologicalInformation', {
                    url: '/psychologicalInformation',
                    controller: 'PsychologicalInformationController',
                    templateUrl: 'internal/psychologicalEvaluation/knowledgeInformation/psychologicalInformation/psychologicalInformationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select', 'xeditable']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/qrcode/qrcode.min.js' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/knowledgeInformation/psychologicalInformation/psychologicalInformationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增全网心理资讯维护
                .state('access.app.internal.knowledgeInformation.addPsychologicalInformation', {
                    url: '/addPsychologicalInformation/:id',
                    controller: 'AddPsychologicalInformationController',
                    templateUrl: 'internal/psychologicalEvaluation/knowledgeInformation/psychologicalInformation/addPsychologicalInformationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['textAngular', 'ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/jQuery-File-Upload/js/vendor/jquery.ui.widget.js', '../bower_components/jQuery-File-Upload/js/jquery.iframe-transport.js', '../bower_components/jQuery-File-Upload/js/jquery.fileupload.js',
                                            'internal/psychologicalEvaluation/knowledgeInformation/psychologicalInformation/addPsychologicalInformationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 学校心理资讯监控
                .state('access.app.internal.knowledgeInformation.psychologicalInformationMonitoring', {
                    url: '/psychologicalInformationMonitoring',
                    controller: 'PsychologicalInformationMonitoringController',
                    templateUrl: 'internal/psychologicalEvaluation/knowledgeInformation/psychologicalInformationMonitoring/psychologicalInformationMonitoringController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/knowledgeInformation/psychologicalInformationMonitoring/psychologicalInformationMonitoringController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 学校心理资讯监控明细
                .state('access.app.internal.knowledgeInformation.detailPsychologicalInformationMonitoring', {
                    url: '/detailPsychologicalInformationMonitoring/:id',
                    controller: 'DetailPsychologicalInformationMonitoringController',
                    templateUrl: 'internal/psychologicalEvaluation/knowledgeInformation/psychologicalInformationMonitoring/detailPsychologicalInformationMonitoringController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/knowledgeInformation/psychologicalInformationMonitoring/detailPsychologicalInformationMonitoringController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*--------------------------- Banner管理 ----------------------- */
                // 全网banner设置
                .state('access.app.internal.bannerManagement.wholeNetworkBannerSet', {
                    url: '/wholeNetworkBannerSet',
                    controller: 'WholeNetworkBannerSetController',
                    templateUrl: 'internal/psychologicalEvaluation/bannerManagement/wholeNetworkBannerSet/wholeNetworkBannerSetController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/bannerManagement/wholeNetworkBannerSet/wholeNetworkBannerSetController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增全网banner设置
                .state('access.app.internal.bannerManagement.addWholeNetBanner', {
                    url: '/addWholeNetBanner?type',
                    controller: 'addWholeNetBannerController',
                    templateUrl: 'internal/psychologicalEvaluation/bannerManagement/wholeNetworkBannerSet/addWholeNetBanner.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/jQuery-File-Upload/js/vendor/jquery.ui.widget.js', '../bower_components/jQuery-File-Upload/js/jquery.iframe-transport.js', '../bower_components/jQuery-File-Upload/js/jquery.fileupload.js',
                                            'internal/psychologicalEvaluation/bannerManagement/wholeNetworkBannerSet/addWholeNetBannerController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 学校banner监控
                .state('access.app.internal.bannerManagement.schoolBannerMonitor', {
                    url: '/schoolBannerMonitor',
                    controller: 'SchoolBannerMonitorController',
                    templateUrl: 'internal/psychologicalEvaluation/bannerManagement/schoolBannerMonitor/schoolBannerMonitorController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/bannerManagement/schoolBannerMonitor/schoolBannerMonitorController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 心理领域
                .state('access.app.internal.basicData.psychologicalDomain', {
                    url: '/psychologicalDomain',
                    templateUrl: 'internal/psychologicalEvaluation/basicData/psychologicalDomain/psychologicalDomain.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/basicData/psychologicalDomain/psychologicalDomainController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 心理属性库
                .state('access.app.internal.basicData.psychologicalAttribute', {
                    url: '/psychologicalAttribute',
                    templateUrl: 'internal/psychologicalEvaluation/basicData/psychologicalAttribute/psychologicalAttribute.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/basicData/psychologicalAttribute/psychologicalAttributeController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 课程banner设置
                .state('access.app.internal.courseManagement.bannerSet', {
                    url: '/bannerSet',
                    templateUrl: 'internal/psychologicalEvaluation/courseManagement/bannerSet/bannerSet.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/jQuery-File-Upload/js/vendor/jquery.ui.widget.js', '../bower_components/jQuery-File-Upload/js/jquery.iframe-transport.js', '../bower_components/jQuery-File-Upload/js/jquery.fileupload.js',
                                            'internal/psychologicalEvaluation/courseManagement/bannerSet/bannerSetController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 课程分类
                .state('access.app.internal.courseManagement.courseClassify', {
                    url: '/courseClassify',
                    templateUrl: 'internal/psychologicalEvaluation/courseManagement/courseClassify/courseClassify.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/jQuery-File-Upload/js/vendor/jquery.ui.widget.js', '../bower_components/jQuery-File-Upload/js/jquery.iframe-transport.js', '../bower_components/jQuery-File-Upload/js/jquery.fileupload.js',
                                            'internal/psychologicalEvaluation/courseManagement/courseClassify/courseClassifyController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 课程维护
                .state('access.app.internal.courseManagement.courseMaintain', {
                    url: '/courseMaintain',
                    templateUrl: 'internal/psychologicalEvaluation/courseManagement/courseMaintain/courseMaintain.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/courseManagement/courseMaintain/courseMaintainController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增课程
                .state('access.app.internal.courseManagement.addCourse', {
                    url: '/addCourse?id',
                    templateUrl: 'internal/psychologicalEvaluation/courseManagement/courseMaintain/addCourse.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath, '../bower_components/jQuery-File-Upload/js/vendor/jquery.ui.widget.js', '../bower_components/jQuery-File-Upload/js/jquery.iframe-transport.js', '../bower_components/jQuery-File-Upload/js/jquery.fileupload.js',
                                            'internal/psychologicalEvaluation/courseManagement/courseMaintain/addCourseController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 心理测试任务
                .state('access.app.internal.psychologicalTest.psyTestTask', {
                    url: '/psyTestTask',
                    templateUrl: 'internal/psychologicalEvaluation/psychologicalTest/psyTestTask/psyTestTask.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/psychologicalTest/psyTestTask/psyTestTaskController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //  已测试名单
                .state('access.app.internal.psychologicalTest.hasTestDetail', {
                    url: '/hasTestDetail?id&gid&state&nType&sDate&eDate',
                    templateUrl: 'internal/psychologicalEvaluation/psychologicalTest/psyTestTask/hasTestDetail.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/psychologicalTest/psyTestTask/hasTestDetailController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 查看详细结果
                .state('access.app.internal.psychologicalTest.testReport', {
                    url: '/testReport?id',
                    templateUrl: 'internal/psychologicalEvaluation/psychologicalTest/psyTestTask/testReport.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/psychologicalTest/psyTestTask/testReportController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 未测试名单
                .state('access.app.internal.psychologicalTest.notTestDetail', {
                    url: '/notTestDetail?id&gid&state&nType&sDate&eDate',
                    templateUrl: 'internal/psychologicalEvaluation/psychologicalTest/psyTestTask/notTestDetail.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/psychologicalTest/psyTestTask/notTestDetailController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 学校测试完成情况
                .state('access.app.internal.psychologicalTest.testPerformance', {
                    url: '/testPerformance',
                    templateUrl: 'internal/psychologicalEvaluation/psychologicalTest/testPerformance/testPerformance.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        serie: true,
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/psychologicalEvaluation/psychologicalTest/testPerformance/testPerformanceController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------优信主题包---------------------------start*/
                // 主题包定义
                .state('access.app.internal.ThemeSkins.listOfThemeskins', {
                    url: '/listOfThemeskins',
                    templateUrl: 'internal/ucuxinThemeManagement/ThemeSkins/listOfThemeskins/listOfThemeskinsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/ucuxinThemeManagement/ThemeSkins/listOfThemeskins/listOfThemeskinsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                //主题包权限推送
                .state('access.app.internal.SkinLimitConfig.listOfLimitConfig', {
                    url: '/listOfLimitConfig',
                    templateUrl: 'internal/ucuxinThemeManagement/SkinLimitConfig/listOfLimitConfig/listOfLimitConfig.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/ucuxinThemeManagement/SkinLimitConfig/listOfLimitConfig/listOfLimitConfig.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------优信主题包---------------------------end*/



                /*---------------------------优信配置信息L---------------------------start*/
                //优信配置信息config
                .state('access.app.internal.authorizationConfig.applicationTreeConfig', {
                    url: '/applicationTreeConfig',
                    templateUrl: 'internal/applicationAuthorization/authorizationConfig/applicationTreeConfig/applicationTreeConfigController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationAuthorization/authorizationConfig/applicationTreeConfig/applicationTreeConfigController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增或者编辑学优信配置信息config
                .state('access.app.internal.authorizationConfig.addApplicationTree', {
                    url: '/addApplicationTree?selectedGid&SubAppID',
                    templateUrl: 'internal/applicationAuthorization/authorizationConfig/applicationTreeConfig/addApplicationTreeController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationAuthorization/authorizationConfig/applicationTreeConfig/addApplicationTreeController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })


                //优信配置信息L1
                .state('access.app.internal.authorizationConfig.listOfAuthorizationL1', {
                    url: '/listOfAuthorizationL1',
                    templateUrl: 'internal/applicationAuthorization/authorizationConfig/listOfAuthorizationL1/listOfAuthorizationL1Contoller.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationAuthorization/authorizationConfig/listOfAuthorizationL1/listOfAuthorizationL1Contoller.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // //优信配置信息L2
                // .state('access.app.internal.authorizationConfig.listOfAuthorizationL2', {
                //     url: '/listOfAuthorizationL2',
                //     templateUrl: 'internal/applicationAuthorization/authorizationConfig/listOfAuthorizationL2/listOfAuthorizationL2Controller.html' + APPMODEL.dateMath,
                //     resolve: {
                //         deps: ['$ocLazyLoad',
                //             function ($ocLazyLoad) {
                //                 return $ocLazyLoad.load(['ui.select']).then(function () {
                //                     return $ocLazyLoad.load({
                //                         files: [
                //                             'public/css/productStyle.css' + APPMODEL.dateMath,
                //                             'internal/applicationAuthorization/authorizationConfig/listOfAuthorizationL2/listOfAuthorizationL2Controller.js' + APPMODEL.dateMath
                //                         ]
                //                     })
                //                 });
                //             }
                //         ]
                //     }
                // })
                //   //优信配置信息L3
                // .state('access.app.internal.authorizationConfig.listOfAuthorizationL3', {
                //   url: '/listOfAuthorizationL3',
                //   templateUrl: 'internal/applicationAuthorization/authorizationConfig/listOfAuthorizationL3/listOfAuthorizationL3Controller.html' + APPMODEL.dateMath,
                //   resolve: {
                //     deps: ['$ocLazyLoad',
                //       function ($ocLazyLoad) {
                //         return $ocLazyLoad.load(['ui.select']).then(function () {
                //           return $ocLazyLoad.load({
                //             files: [
                //               'public/css/productStyle.css' + APPMODEL.dateMath,
                //               'internal/applicationAuthorization/authorizationConfig/listOfAuthorizationL3/listOfAuthorizationL3Controller.js' + APPMODEL.dateMath
                //             ]
                //           })
                //         });
                //       }
                //     ]
                //   }
                // })

                /*---------------------------区域云管理---------------------------------------------start*/
                // 区域云管理
                .state('access.app.internal.CloudRegion.listOfCloudRegion', {
                    url: '/listOfCloudRegion',
                    templateUrl: 'internal/pointCloudRegionManage/CloudRegion/listOfCloudRegion/listOfCloudRegionController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/pointCloudRegionManage/CloudRegion/listOfCloudRegion/listOfCloudRegionController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                .state('access.app.internal.CloudRegion.listOfCloudRegionAdminList', {
                    url: '/listOfCloudRegionAdminList?id',
                    templateUrl: 'internal/pointCloudRegionManage/CloudRegion/listOfCloudRegion/listOfCloudRegionAdminList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/pointCloudRegionManage/CloudRegion/listOfCloudRegion/listOfCloudRegionAdminList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //    tablist

                .state('access.app.internal.CloudRegion.tablist', {
                    url: '/overallSituation',
                    templateUrl: 'internal/pointCloudRegionManage/CloudRegion/tablist/overallSituation.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/pointCloudRegionManage/CloudRegion/tablist/overallSituation.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })




                // add tab
                .state('access.app.internal.CloudRegion.addtabs', {
                    url: '/addtabs?TabID',
                    templateUrl: 'internal/pointCloudRegionManage/CloudRegion/tablist/addtabs.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/pointCloudRegionManage/CloudRegion/tablist/addtabs.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })


                //用户菜单权限--用户管理（内部运营）
                .state('access.app.internal.CloudRegion.listOfCloudRegionMenu', {
                    url: '/listOfCloudRegionMenu?orgID?UID&Name',
                    templateUrl: 'internal/pointCloudRegionManage/CloudRegion/listOfCloudRegion/listOfCloudRegionMenu.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/pointCloudRegionManage/CloudRegion/listOfCloudRegion/listOfCloudRegionMenu.js' + APPMODEL.dateMath
                                        ]);
                                    }
                                );
                            }]
                    }
                })
                //业务领域管理
                .state('access.app.internal.CloudRegion.businessAeaManage', {
                    url: '/businessAeaManage',
                    templateUrl: 'internal/pointCloudRegionManage/CloudRegion/businessAeaManage/businessAeaManageController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/pointCloudRegionManage/CloudRegion/businessAeaManage/businessAeaManageController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------区域云管理---------------------------------------------send*/



                /*---------------------------优信配置信息L---------------------------end*/


                /*---------------------------组织机构---------------------------start*/
                // 组织机构管理-组织机构（内部运营）
                .state('access.app.internal.organizationalInstitution.listOfOrganizations', {
                    url: '/listOfOrganizations',
                    templateUrl: 'internal/organizationAuthority/organizationalInstitution/listOfOrganizations/listOfOrganizationsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/organizationAuthority/organizationalInstitution/listOfOrganizations/listOfOrganizationsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 组织机构 - 合作伙伴学校权限
                .state('access.app.internal.organizationalInstitution.listOfPartnerSchools', {
                    url: '/listOfPartnerSchools',
                    controller: 'ListOfPartnerSchoolsController',
                    templateUrl: 'internal/organizationAuthority/organizationalInstitution/listOfPartnerSchools/listOfPartnerSchoolsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'public/js/constant/city.js',
                                            'internal/organizationAuthority/organizationalInstitution/listOfPartnerSchools/listOfPartnerSchoolsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 组织机构 - 合作伙伴学校权限 - 分配学校
                .state('access.app.internal.organizationalInstitution.saveNewPartnerSchool', {
                    url: '/saveNewPartnerSchool',
                    controller: 'SaveNewPartnerSchoolController',
                    templateUrl: 'internal/organizationAuthority/organizationalInstitution/listOfPartnerSchools/saveNewPartnerSchoolController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'public/js/constant/city.js',
                                            'internal/organizationAuthority/organizationalInstitution/listOfPartnerSchools/saveNewPartnerSchoolController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------组织机构---------------------------end*/
                /*---------------------------用户管理---------------------------start*/
                // 用户管理-用户管理（内部运营）
                .state('access.app.internal.userManagementInternal.userManagement', {
                    url: '/userManagement',
                    templateUrl: 'internal/organizationAuthority/userManagement/userManagementInternal/userManagementController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/organizationAuthority/userManagement/userManagementInternal/userManagementController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 添加用户菜单权限--用户菜单权限--用户管理（内部运营） 2017/10/13
                .state('access.app.internal.userManagementInternal.userMenuList', {
                    url: '/userMenuList?UID?Name',
                    templateUrl: 'internal/organizationAuthority/userManagement/userManagementInternal/userMenuList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/organizationAuthority/userManagement/userManagementInternal/userMenuList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 用户菜单权限--用户管理（内部运营）
                .state('access.app.internal.userManagementInternal.userMenuPermissions', {
                    url: '/userMenuPermissions?OrgID&UID',
                    templateUrl: 'internal/organizationAuthority/userManagement/userMenuPermissions/userMenuPermissionsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/organizationAuthority/userManagement/userMenuPermissions/userMenuPermissionsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 添加用户菜单权限--用户菜单权限--用户管理（内部运营）
                .state('access.app.internal.userManagementInternal.addUserMenuPermissions', {
                    url: '/addUserMenuPermissions?OrgID&UID',
                    templateUrl: 'internal/organizationAuthority/userManagement/userMenuPermissions/addUserMenuPermissionsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/organizationAuthority/userManagement/userMenuPermissions/addUserMenuPermissionsController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 用户管理 - 用户学校权限分配
                .state('access.app.internal.userManagementInternal.userSchoolAuthority', {
                    url: '/userSchoolAuthority?OrgID&UID',
                    controller: 'UserSchoolAuthorityController',
                    templateUrl: 'internal/organizationAuthority/userManagement/userSchoolAuthority/userSchoolAuthorityController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'public/js/constant/city.js',
                                            'internal/organizationAuthority/userManagement/userSchoolAuthority/userSchoolAuthorityController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 用户管理 - 用户学校权限分配 - 分配学校
                .state('access.app.internal.userManagementInternal.saveUserSchoolAuthority', {
                    url: '/saveUserSchoolAuthority?OrgID&UID',
                    controller: 'SaveUserSchoolAuthorityController',
                    templateUrl: 'internal/organizationAuthority/userManagement/userSchoolAuthority/saveUserSchoolAuthorityController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'public/js/constant/city.js',
                                            'internal/organizationAuthority/userManagement/userSchoolAuthority/saveUserSchoolAuthorityController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------用户管理---------------------------end*/
                /*---------------------------菜单管理---------------------------start*/
                // 菜单管理-添加菜单（内部运营）
                .state('access.app.internal.menuManagementInternal.addMenuJurisdiction', {
                    url: '/addMenuJurisdiction',
                    templateUrl: 'internal/organizationAuthority/menuManagementInternal/addMenuJurisdiction/addMenuJurisdictionController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/organizationAuthority/menuManagementInternal/addMenuJurisdiction/addMenuJurisdictionController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------菜单管理---------------------------end*/
                /*---------------------------学校应用管理（内部运营）---------------------------start*/
                // 学校应用开通--学校应用管理（内部运营）
                .state('access.app.internal.schoolApplicationManagement.schoolApplicationOpening', {
                    url: '/schoolApplicationOpening?selectedGid&selectedGidName',
                    templateUrl: 'internal/applicationFeeManagement/schoolApplicationManagement/schoolApplicationOpening/schoolApplicationOpeningController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/schoolApplicationManagement/schoolApplicationOpening/schoolApplicationOpeningController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增或者编辑学校应用开通
                .state('access.app.internal.schoolApplicationManagement.addOrEditSchoolApplicationOpening', {
                    url: '/addOrEditSchoolApplicationOpening?selectedGid&selectedGidName&GID&GName&GType&OpenBusiness&IsTel&Timeout&MorningSupply&CompanyToken$GroupBusiness&ClockSmsType&IsOpenExceptionClcok',
                    templateUrl: 'internal/applicationFeeManagement/schoolApplicationManagement/schoolApplicationOpening/addOrEditSchoolApplicationOpeningController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationFeeManagement/schoolApplicationManagement/schoolApplicationOpening/addOrEditSchoolApplicationOpeningController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增或者编辑学校应用开通(合作伙伴)
                .state('access.app.internal.schoolApplicationManagement.addOrEditSchoolApplicationOpen', {
                    url: '/addOrEditSchoolApplicationOpen?selectedGid&selectedGidName&GID&GName&GType&OpenBusiness&IsTel&Timeout&MorningSupply&CompanyToken$GroupBusiness&ClockSmsType&IsOpenExceptionClcok',
                    templateUrl: 'partners/schoolApplication/partnerSchoolApplication/addOrEditSchoolApplicationOpeningController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'partners/schoolApplication/partnerSchoolApplication/addOrEditSchoolApplicationOpeningController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------学校应用管理（内部运营）---------------------------end*/
                /*---------------------------江西禁毒权限设置（内部运营）---------------------------start*/
                // 学校报表权限分配
                .state('access.app.internal.setSchoolReportRight.schoolReportRight', {
                    url: '/schoolReportRight',
                    templateUrl: 'internal/jiangxiDrugcontrol/setSchoolReportRight/schoolReportRight/schoolReportRight.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/jiangxiDrugcontrol/setSchoolReportRight/schoolReportRight/schoolReportRightController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //  江西禁毒后台管理权限设置（内部运营）
                .state('access.app.internal.setSchoolReportRight.systemManagementRight', {
                    url: '/systemManagementRight',
                    templateUrl: 'internal/jiangxiDrugcontrol/setSchoolReportRight/systemManagementRight/systemManagementRight.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/jiangxiDrugcontrol/setSchoolReportRight/systemManagementRight/systemManagementRightController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 学校管理员审核
                .state('access.app.internal.setSchoolReportRight.managerAudit', {
                    url: '/managerAudit',
                    templateUrl: 'internal/jiangxiDrugcontrol/setSchoolReportRight/managerAudit/managerAudit.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/jiangxiDrugcontrol/setSchoolReportRight/managerAudit/managerAuditController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------西禁毒权限设置（内部运营）---------------------------end*/

                /*---------------------------西禁毒禁毒短信（内部运营）---------------------------start*/
                /*---------------------------通用短信发送（内部运营）---------------------------start*/
                .state('access.app.internal.antiDrugSMS.currencySMSRecords', {
                    url: '/currencySMSRule',
                    controller: 'CurrencySMSRecordsController',
                    templateUrl: 'internal/jiangxiDrugcontrol/antiDrugSMS/currencySMSRule/currencySMSRecords.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    files: [
                                        'public/css/productStyle.css' + APPMODEL.dateMath,
                                        'internal/jiangxiDrugcontrol/antiDrugSMS/currencySMSRule/currencySMSRecordsController.js' + APPMODEL.dateMath
                                    ]
                                })
                            }
                        ]
                    }
                })
                .state('access.app.internal.antiDrugSMS.saveCurrencySMSRecords', {
                    url: '/saveCurrencySMSRecords',
                    controller: 'SaveCurrencySMSRecordsController',
                    templateUrl: 'internal/jiangxiDrugcontrol/antiDrugSMS/currencySMSRule/saveCurrencySMSRecords.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load({
                                    files: [
                                        'public/css/productStyle.css' + APPMODEL.dateMath,
                                        'internal/jiangxiDrugcontrol/antiDrugSMS/currencySMSRule/saveCurrencySMSRecordsController.js' + APPMODEL.dateMath
                                    ]
                                })
                            }
                        ]
                    }
                })
                /*---------------------------西禁毒禁毒短信（内部运营）---------------------------end*/
                /*---------------------------优信云监控（内部运营）---------------------------start*/
                //参数设置
                .state('access.app.internal.ucuxinCloudMonitoring.parametersSet', {
                    url: '/parametersSet',
                    templateUrl: 'internal/uxuxinCloudMonitoring/parametersSet/parametersSet.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/uxuxinCloudMonitoring/parametersSet/parametersSet.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //设备维护
                .state('access.app.internal.ucuxinCloudMonitoring.plantMaintenance', {
                    url: '/plantMaintenance',
                    controller: 'ParametersSetController',
                    templateUrl: 'internal/uxuxinCloudMonitoring/plantMaintenance/plantMaintenance.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/uxuxinCloudMonitoring/plantMaintenance/plantMaintenance.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 修改
                .state('access.app.internal.ucuxinCloudMonitoring.savePlantMaintenance', {
                    url: '/savePlantMaintenance?id&gid',
                    controller: 'SavePlantMaintenanceController',
                    templateUrl: 'internal/uxuxinCloudMonitoring/plantMaintenance/savePlantMaintenance.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/uxuxinCloudMonitoring/plantMaintenance/savePlantMaintenance.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------优信云监控（内部运营）---------------------------end*/
                /*---------------------------应用图标维护（内部运营）---------------------------start*/
                //社团图标维护
                .state('access.app.internal.applicationIconMaintenance.corporateRegistrationIcon', {
                    url: '/corporateRegistrationIcon',
                    templateUrl: 'internal/applicationIconMaintenance/applicationIcon/corporateRegistrationIcon/corporateRegistrationIconController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/applicationIconMaintenance/applicationIcon/corporateRegistrationIcon/corporateRegistrationIconController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------心理健康（内部运营）---------------------------end*/
                //量表维护
                .state('access.app.internal.inventoryManagement.scaleMaintenance', {
                    url: '/scaleMaintenance',
                    templateUrl: 'internal/mentalHealth/inventoryManagement/scaleMaintenance/scaleMaintenanceController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/inventoryManagement/scaleMaintenance/scaleMaintenanceController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //添加量表基本信息
                .state('access.app.internal.inventoryManagement.addTheScale', {
                    url: '/addTheScale',
                    templateUrl: 'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScaleController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScaleController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //基本信息
                .state('access.app.internal.inventoryManagement.addTheScale.basicInformation', {
                    url: '/basicInformation?scaleID',
                    templateUrl: 'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/basicInformationController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/basicInformationController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //用户属性
                .state('access.app.internal.inventoryManagement.addTheScale.userAttributes', {
                    url: '/userAttributes?scaleID',
                    templateUrl: 'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/userAttributesController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/userAttributesController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //题库
                .state('access.app.internal.inventoryManagement.addTheScale.questionBank', {
                    url: '/questionBank?scaleID',
                    templateUrl: 'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/questionBankController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/questionBankController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //因子定义
                .state('access.app.internal.inventoryManagement.addTheScale.factorDefinition', {
                    url: '/factorDefinition?scaleID',
                    templateUrl: 'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/factorDefinitionController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/factorDefinitionController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //添加因子定义
                .state('access.app.internal.inventoryManagement.addTheScale.addFactorDefinition', {
                    url: '/addFactorDefinition?factorID',
                    templateUrl: 'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/addFactorDefinitionController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/inventoryManagement/scaleMaintenance/addTheScale/addFactorDefinitionController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //心理专家
                .state('access.app.internal.expertTeam.mentalExpert', {
                    url: '/mentalExpert',
                    templateUrl: 'internal/mentalHealth/expertTeam/mentalExpert/mentalExpert.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/expertTeam/mentalExpert/mentalExpert.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增心理专家
                .state('access.app.internal.expertTeam.addExpert', {
                    url: '/addExpert',
                    templateUrl: 'internal/mentalHealth/expertTeam/mentalExpert/addExpert.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/expertTeam/mentalExpert/addExpert.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //编辑心理专家
                .state('access.app.internal.expertTeam.editExpert', {
                    url: '/editExpert?id',
                    templateUrl: 'internal/mentalHealth/expertTeam/mentalExpert/editExpert.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/expertTeam/mentalExpert/editExpert.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //心理机构
                .state('access.app.internal.expertTeam.mentalOrganization', {
                    url: '/mentalOrganization',
                    templateUrl: 'internal/mentalHealth/expertTeam/mentalOrganization/mentalOrganization.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/expertTeam/mentalOrganization/mentalOrganization.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //新增心理机构
                .state('access.app.internal.expertTeam.addOrg', {
                    url: '/addOrg',
                    templateUrl: 'internal/mentalHealth/expertTeam/mentalOrganization/addOrg.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/expertTeam/mentalOrganization/addOrg.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //编辑 心理机构
                .state('access.app.internal.expertTeam.editOrg', {
                    url: '/editOrg?id',
                    templateUrl: 'internal/mentalHealth/expertTeam/mentalOrganization/editOrg.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'internal/mentalHealth/expertTeam/mentalOrganization/editOrg.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //学校量表授权
                .state('access.app.internal.inventoryManagement.inventorySchool', {
                    url: '/inventorySchool',
                    templateUrl: 'internal/mentalHealth/inventoryManagement/inventorySchool/inventorySchool.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/inventoryManagement/inventorySchool/inventorySchool.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //合作伙伴量表授权
                .state('access.app.internal.inventoryManagement.inventoryPartner', {
                    url: '/inventoryPartner',
                    templateUrl: 'internal/mentalHealth/inventoryManagement/inventoryPartner/inventoryPartner.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/inventoryManagement/inventoryPartner/inventoryPartner.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //心理功能开通
                .state('access.app.internal.mentalFunctionOpen.schoolMentalFunctionOpen', {
                    url: '/schoolMentalFunctionOpen',
                    templateUrl: 'internal/mentalHealth/mentalFunctionOpen/schoolMentalFunctionOpen/schoolMentalFunctionOpen.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/mentalFunctionOpen/schoolMentalFunctionOpen/schoolMentalFunctionOpen.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //查看心理管理员
                .state('access.app.internal.mentalFunctionOpen.getSchoolPsyManagers', {
                    url: '/getSchoolPsyManagers?GID',
                    templateUrl: 'internal/mentalHealth/mentalFunctionOpen/getSchoolPsyManagers/getSchoolPsyManagersController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/mentalFunctionOpen/getSchoolPsyManagers/getSchoolPsyManagersController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //服務包管理
                .state('access.app.internal.servicePackageManagement.mentalServicePackage', {
                    url: '/mentalServicePackage',
                    templateUrl: 'internal/mentalHealth/servicePackageManagement/mentalServicePackage/mentalServicePackage.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/servicePackageManagement/mentalServicePackage/mentalServicePackage.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 新增服务包
                .state('access.app.internal.servicePackageManagement.addPackage', {
                    url: '/addPackage?id',
                    templateUrl: 'internal/mentalHealth/servicePackageManagement/mentalServicePackage/addPackage.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/servicePackageManagement/mentalServicePackage/addPackage.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 服务包课程设置
                .state('access.app.internal.servicePackageManagement.servicePackageCourse', {
                    url: '/servicePackageCourse?id',
                    templateUrl: 'internal/mentalHealth/servicePackageManagement/mentalServicePackage/servicePackageCourse.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/servicePackageManagement/mentalServicePackage/servicePackageCourse.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                // 服务包量表
                .state('access.app.internal.servicePackageManagement.servicePackageScale', {
                    url: '/servicePackageScale?id',
                    templateUrl: 'internal/mentalHealth/servicePackageManagement/mentalServicePackage/servicePackageScale.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/servicePackageManagement/mentalServicePackage/servicePackageScale.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //学校心理服务包开通
                .state('access.app.internal.servicePackageManagement.schoolServicePackageOpen', {
                    url: '/schoolServicePackageOpen',
                    templateUrl: 'internal/mentalHealth/servicePackageManagement/schoolServicePackageOpen/schoolServicePackageOpen.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/mentalHealth/servicePackageManagement/schoolServicePackageOpen/schoolServicePackageOpen.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------心理健康（内部运营）---------------------------start*/

                /*---------------------------直播（内部运营）---------------------------start*/
                //校园直播管理
                .state('access.app.internal.afterManage.liveUserManage', {
                    url: '/liveUserManage',
                    templateUrl: 'internal/liveManage/afterManage/liveUserManage/listOfliveController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/liveManage/afterManage/liveUserManage/listOfliveController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //直播流量管理
                .state('access.app.internal.UXLive.trafficManagement', {
                    url: '/trafficManagement?year&month&PtnID&class&name',
                    templateUrl: 'internal/UXLive/trafficManagement/traffic.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/trafficManagement/traffic.js' + APPMODEL.dateMath,
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //合作伙伴流量明细
                .state('access.app.internal.UXLive.trafficPartner', {
                    url: '/trafficPartner?year&month&PtnID&name&id',
                    templateUrl: 'internal/UXLive/trafficManagement/trafficPartner.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/trafficManagement/trafficPartner.js' + APPMODEL.dateMath,
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //校流量明细
                .state('access.app.internal.UXLive.trafficSchool', {
                    url: '/trafficSchool?year&month&PtnID&name',
                    templateUrl: 'internal/UXLive/trafficManagement/trafficSchool.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/trafficManagement/trafficSchool.js' + APPMODEL.dateMath,
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //班级流量明细
                .state('access.app.internal.UXLive.trafficClass', {
                    url: '/trafficClass?year&month&school&name&PtnID',
                    templateUrl: 'internal/UXLive/trafficManagement/trafficClass.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/trafficManagement/trafficClass.js' + APPMODEL.dateMath,
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //用户流量明细
                .state('access.app.internal.UXLive.trafficUser', {
                    url: '/trafficUser?year&month&schoolID&PtnID&classID&name',
                    templateUrl: 'internal/UXLive/trafficManagement/trafficUser.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/trafficManagement/trafficUser.js' + APPMODEL.dateMath,
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /*---------------------------直播（内部运营）---------------------------end*/

                /*---------------------------直播官方后台（内部运营）---------------------------start*/
                //用户管理--直播员
                .state('access.app.internal.UXLive.UserList', {
                    url: '/UserList?activeType',
                    templateUrl: 'internal/UXLive/UserManage/UserList/UserListController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/UserManage/UserList/UserListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //用户管理--发布员
                .state('access.app.internal.UXLive.liveUserList', {
                    url: '/liveUserList',
                    templateUrl: 'internal/UXLive/UserManage/UserList/pubUserList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/UserManage/UserList/pubUserList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })

                //用户管理--发布员
                .state('access.app.internal.UXLive.PubUserList', {
                    url: '/PubUserList',
                    templateUrl: 'internal/UXLive/UserManage/UserList/pubUserList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/UserManage/UserList/pubUserList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //用户管理--受众用户
                .state('access.app.internal.UXLive.watchUserList', {
                    url: '/watchUserList',
                    templateUrl: 'internal/UXLive/UserManage/UserList/watchUserList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/UserManage/UserList/watchUserList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //直播记录列表
                .state('access.app.internal.UXLive.LiveRecordList', {
                    url: '/LiveRecordList?userID&ID&Name',
                    //url: '/addApplicationTree?selectedGid&SubAppID',
                    templateUrl: 'internal/UXLive/UserManage/UserList/LiveRecordList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/UserManage/UserList/LiveRecordList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //发布记录列表
                .state('access.app.internal.UXLive.ReleaseRecordList', {
                    url: '/ReleaseRecordList?userID&ID&Name',
                    //url: '/addApplicationTree?selectedGid&SubAppID',
                    templateUrl: 'internal/UXLive/UserManage/UserList/ReleaseRecordList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/UserManage/UserList/ReleaseRecordList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //观看记录记录列表
                .state('access.app.internal.UXLive.WatchRecordList', {
                    url: '/WatchRecordList?userID&ID&Name&Year&Month',
                    //url: '/addApplicationTree?selectedGid&SubAppID',
                    templateUrl: 'internal/UXLive/UserManage/UserList/WatchRecordList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/UserManage/UserList/WatchRecordList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //机构管理列表
                .state('access.app.internal.UXLive.institutionList', {
                    url: '/institutionList',
                    //url: '/addApplicationTree?selectedGid&SubAppID',
                    templateUrl: 'internal/UXLive/institutionManage/institutionList/institutionListController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/institutionManage/institutionList/institutionListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //机构管理 --直播列表
                .state('access.app.internal.UXLive.institutionListLiveManage', {
                    url: '/institutionListLiveManage?ID&Name',
                    templateUrl: 'internal/UXLive/institutionManage/institutionList/institutionListLiveManageController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/institutionManage/institutionList/institutionListLiveManageController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //机构管理 --修改机构详情
                .state('access.app.internal.UXLive.updateInstitution', {
                    url: '/updateInstitution?ID&Name',
                    templateUrl: 'internal/UXLive/institutionManage/institutionList/updateInstitutionController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/institutionManage/institutionList/updateInstitutionController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //直播管理(预告)
                .state('access.app.internal.UXLive.LiveList', {
                    url: '/LiveList',
                    templateUrl: 'internal/UXLive/LiveManage/LiveList/LiveListController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/LiveManage/LiveList/LiveListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //直播管理(进行中)
                .state('access.app.internal.UXLive.LivingList', {
                    url: '/LivingList',
                    templateUrl: 'internal/UXLive/LiveManage/LiveList/LivingListController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/LiveManage/LiveList/LivingListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //直播管理(往期回顾)
                .state('access.app.internal.UXLive.LiveHis', {
                    url: '/LiveHis',
                    templateUrl: 'internal/UXLive/LiveManage/LiveList/LiveHisController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/LiveManage/LiveList/LiveHisController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //数据统计
                .state('access.app.internal.UXLive.DataShow', {
                    url: '/DataShow?tabID',
                    templateUrl: 'internal/UXLive/DataStatistics/DataShow/DataShowController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/DataStatistics/DataShow/DataShowController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //数据明细列表
                .state('access.app.internal.UXLive.DataDetail', {
                    url: '/DataDetail?tabID&LiveChannel&PGType',
                    templateUrl: 'internal/UXLive/DataStatistics/DataShow/DataDetailController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/DataStatistics/DataShow/DataDetailController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //数据图表
                .state('access.app.internal.UXLive.DataCharts', {
                    url: '/DataCharts?tabID&LiveChannel&PtnID&GID&PGType',
                    templateUrl: 'internal/UXLive/DataStatistics/DataShow/DataChartsController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/DataStatistics/DataShow/DataChartsController.js' + APPMODEL.dateMath,
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //广告维护
                .state('access.app.internal.UXLive.adviertisement', {
                    url: '/adviertisement',
                    templateUrl: 'internal/UXLive/adviertisement/adviertisement.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/adviertisement/adviertisement.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //广告发布
                .state('access.app.internal.UXLive.advertising', {
                    url: '/advertising',
                    templateUrl: 'internal/UXLive/adviertisement/advertising.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/adviertisement/advertising.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //    广告修改
                .state('access.app.internal.UXLive.changenew', {
                    url: '/changenew?ID',
                    templateUrl: 'internal/UXLive/adviertisement/changenew.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'internal/UXLive/adviertisement/changenew.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
            /*---------------------------直播官方后台（内部运营）---------------------------end*/


        },
        /**
         * 优信云
         * */
        uxCloud: function () {
            $stateProvider
            //优信配置信息L2
                .state('access.app.cloud.authorizationConfig.listOfAuthorizationL2', {
                    url: '/listOfAuthorizationL2',
                    templateUrl: 'uxCloud/applicationAuthorization/authorizationConfig/listOfAuthorizationL2/listOfAuthorizationL2Controller.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'uxCloud/applicationAuthorization/authorizationConfig/listOfAuthorizationL2/listOfAuthorizationL2Controller.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /**
                 *  合作伙伴用户管理
                 * */
                .state('access.app.cloud.partnerUserManagement.partnerList', {
                    url: '/partnerList',
                    templateUrl: 'uxCloud/partnerManagement/partnerUserManagement/partnerList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'uxCloud/partnerManagement/partnerUserManagement/partnerList.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                .state('access.app.cloud.partnerUserManagement.partnerMenu', {
                    url: '/partnerMenu?UID?orgID?Name?level?orgName',
                    templateUrl: 'uxCloud/partnerManagement/partnerUserManagement/partnerMenu.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'uxCloud/partnerManagement/partnerUserManagement/partnerMenu.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                .state('access.app.cloud.partnerUserManagement.schoolRights', {
                    url: '/schoolRights?UID?orgID?Name?level?orgName',
                    templateUrl: 'uxCloud/partnerManagement/partnerUserManagement/schoolRights.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'uxCloud/partnerManagement/partnerUserManagement/schoolRights.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                .state('access.app.cloud.partnerSchoolManagementConfig.managementList', {
                    url: '/managementList',
                    templateUrl: 'uxCloud/partnerManagement/partnerSchoolManagementConfig/managementList/schoolManagement.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'uxCloud/partnerManagement/partnerSchoolManagementConfig/managementList/schoolManagementController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                .state('access.app.cloud.addPartnersConfig.addPartnersList', {
                    url: '/addPartnersList',
                    templateUrl: 'uxCloud/partnerManagement/addPartnersConfig/addPartnersList/addPartnersList.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'uxCloud/partnerManagement/addPartnersConfig/addPartnersList/addPartnersListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                .state('access.app.cloud.addPartnersConfig.addPartnersListSchool', {
                    url: '/addPartnersListSchool',
                    templateUrl: 'uxCloud/partnerManagement/addPartnersConfig/addPartnersList/distributionSchool.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'uxCloud/partnerManagement/addPartnersConfig/addPartnersList/addPartnersListController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                /**
                 * 区域云用户管理
                 */
                //  用户管理
                .state('access.app.cloud.userManagementPartner.userManagementPartners', {
                    url: '/userManagementPartners',
                    templateUrl: 'uxCloud/organizationAuthorityPartners/userManagementPartners/userManagementInternalPartners/userManagementPartnersController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load(['ui.select']).then(function () {
                                    return $ocLazyLoad.load({
                                        files: [
                                            'public/css/productStyle.css' + APPMODEL.dateMath,
                                            'uxCloud/organizationAuthorityPartners/userManagementPartners/userManagementInternalPartners/userManagementPartnersController.js' + APPMODEL.dateMath
                                        ]
                                    })
                                });
                            }
                        ]
                    }
                })
                //用户菜单权限--用户管理（区域云）
                .state('access.app.cloud.userManagementPartner.userMenuPermissionsPartners', {
                    url: '/userMenuPermissionsPartners?UID&Name',
                    templateUrl: 'uxCloud/organizationAuthorityPartners/userManagementPartners/userMenuPermissionsPartners/userMenuPermissionsPartnersController.html' + APPMODEL.dateMath,
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('ui.select').then(
                                    function () {
                                        return $ocLazyLoad.load(['public/css/productStyle.css' + APPMODEL.dateMath, 'uxCloud/organizationAuthorityPartners/userManagementPartners/userMenuPermissionsPartners/userMenuPermissionsPartnersController.js' + APPMODEL.dateMath]);
                                    }
                                );
                            }]
                    }
                })

        }
    };
    stateProvider.init();//初始化
}]);
