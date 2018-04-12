/**
 * Created by fanweihua on 8/8/2016.
 * permissionsController
 * user permissions management
 */
app.controller('permissionsController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    /**
     * user permissions management
     * @type {{init: init, localStorageUserParsing: localStorageUserParsing, icons: string[], getUserPermissionService: getUserPermissionService, userInfo: userInfo, navList: navList}}
     */
    var userPermissionsManagement = {
        /**
         * call init
         */
        init: function () {
            this.tip();
            userPermissionsManagement.localStorageUserParsing(function () {//user storage parsing string to object
                userPermissionsManagement.getUserPermissionService();//get user service about permission
            });
        },
        /**
         * user storage parsing string to object
         */
        localStorageUserParsing: function (callBack) {
            var userObj = JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            if (!APPMODEL.Storage.copPage_token) {
                toastr.error("登录过期");
                window.location.href = "index.html";
            } else {
                APPMODEL.Storage.setItem("orgid", userObj.OrgID);
                this.userInfo(userObj.OrgName);
                callBack();
            }
        },
        /**
         * icon collection
         */
        icons: ["icon-social-dribbble", "icon-graduation", "icon-basket-loaded", "icon-chemistry", "icon-book-open", "icon-control-pause", "icon-cursor", "icon-grid", "icon-pie-chart", "icon-calculator", "icon-compass", "icon-cup", "icon-diamond", "icon-direction", "icon-directions", "icon-docs", "icon-drawer", "icon-drop", "icon-earphones", "icon-earphones-alt", "icon-feed", "icon-film", "icon-folder-alt", "icon-frame", "icon-globe", "icon-globe-alt", "icon-handbag",
            "icon-pin", "icon-puzzle", "icon-arrow-down", "icon-bar-chart", "icon-control-forward", "icon-control-start", "icon-graph", " icon-list", "icon-microphone", "icon-pencil", "icon-share", " icon-size-fullscreen", "icon-umbrella", "icon-camcorder", "icon-close", "icon-cloud-download", "icon-cloud-upload", "icon-doc", "icon-envelope", "icon-eye", "icon-flag", "icon-folder", "icon-heart", "icon-info", "icon-key", "icon-link", "icon-lock", "icon-lock-open", "icon-magnifier", "icon-magnifier-add", "icon-magnifier-remove", "icon-paper-clip", "icon-paper-plane", "icon-plus", "icon-pointer", "icon-power", "icon-refresh", "icon-reload", "icon-settings", "icon-star", "icon-symbol-female", "icon-symbol-male", "icon-target"],
        /**
         * get user service about permission
         */
        getUserPermissionService: function () {
            $("#loaderNavMenus").show();
            var orglevel = JSON.parse(APPMODEL.Storage.getItem('copPage_orgid')).OrgLevel;
            applicationServiceSet.publicServiceApi.userPermissions.GetCurUserMenu.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem('orgid'),orglevel]).then(function (data) {
                if (data.Ret == 0) {
                    userPermissionsManagement.navList(data.Data);
                    $("#loaderNavMenus").hide();
                } else {
                    $("#loaderNavMenus").hide();
                }
            });
        },
        /**
         * user basic information
         */
        userInfo: function (partnersName) {
            var user = JSON.parse(APPMODEL.Storage.getItem('copPage_user'));
            if (user) {
                if (!user.Pic || user.Pic == '' || user.Pic == undefined || user.Pic == 'undefined') {
                    user.Pic = 'public/img/student.png';
                }
                $scope.pic = user.Pic;
                $scope.partnersName = partnersName;
                $scope.userList = user.identityList;
                $scope.userName = user.Name;
            }
            /**
             * choose different user information generate different button
             * @param list
             */
            $scope.changeUser = function (list) {
                APPMODEL.Storage.setItem('copPage_orgid', JSON.stringify(list));
                $scope.partnersName = list.OrgName;
                APPMODEL.Storage.setItem('orgid', list.OrgID);
                APPMODEL.Storage.setItem('cloudId', list.CloudID);

                userPermissionsManagement.getUserPermissionService();//get user service about permission
            };
            /**
             * window return judge
             */
            $(window).on('popstate', function () {
                var userManagement = location.hash.split('/');
                for (var i in userManagement) {
                    if (userManagement[i] == 'userManagement') {
                        window.history.forward();
                        break;
                    }
                }
            });
            setTimeout(function () {
                $("#settingsAsideFolded").click(function () {
                    if ($('.app-aside').width() > 100) {
                        $("#loader").css({
                            'left': '60px',
                            'width': '100%'
                        });
                    } else {
                        $("#loader").css({
                            'left': '200px',
                            'width': '100%'
                        });
                    }
                });
                if ($('.app-aside').width() > 100) {
                    $("#loader").css({
                        'left': '200px',
                        'width': '100%'
                    });
                } else {
                    $("#loader").css({
                        'left': '60px',
                        'width': '100%'
                    });
                }
            }, 1000);
        },
        /**
         * nav collection list
         * @param data
         */
        navList: function (data) {
            var iconsNum = 0;
            for (var i in data) {
                for (var s in data[i].ChildMenus) {
                    data[i].ChildMenus[s].Url = userPermissionsManagement.icons[iconsNum];
                    iconsNum++;
                    if (data[i].ChildMenus[s].ChildMenus) {
                        if (data[i].ChildMenus[s].ChildMenus.length > 0 && data[i].ChildMenus[s].ChildMenus[0].Url) {
                            var urlPath = data[i].ChildMenus[s].ChildMenus[0].Url.split(".");
                            data[i].ChildMenus[s].urlPath = urlPath[0] + "." + urlPath[1] + "." + urlPath[2] + "." + urlPath[3];
                        }
                    }
                }
            }
            $scope.menus = data;
//            $("*[data-type='nav-Blocks']").bind('DOMNodeInserted', function () {
//                $("*[data-type='nav-Blocks']").unbind('DOMNodeInserted');
//            });
            /**
             * cancellation
             */
            $scope.cancellation = function () {
                delete APPMODEL.Storage.copPage_user;
                delete APPMODEL.Storage.copPage_token;
            };
        },
        /**
         * tip
         */
        tip: function () {
            toastr.toastrConfig.positionClass = 'toast-top-center';
            toastr.toastrConfig.timeOut = 2000;
        }
    };
    userPermissionsManagement.init();//call init function
}]);