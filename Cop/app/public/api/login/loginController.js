/**
 * Created by fanweihua on 8/4/2016.
 * loginController
 * The user login
 */
app.controller('loginController', ['$scope', 'loginServiceSet', 'toastr', function ($scope, loginServiceSet, toastr) {
    /**
     * loginManagement
     * @type {{init: init, getService: getService, getUserPermissions: getUserPermissions, identityChange: identityChange, sessionJudge: sessionJudge, localStorage: localStorage, userLogin: userLogin, tip: tip, generateValidation: generateValidation, validation: validation}}
     */
    var loginManagement = {
        /**
         * init
         */
        init: function () {
            var browser = this.tip.init();//tip
            if (!browser) {
                return;
            }
            this.sessionJudge(function (user) {//get login service
                loginManagement.getUserPermissions(user);//get user permissions
                loginManagement.getOpenAPITokenByAppid();//Access to application level get token
            });
        },
        /**
         * get login service
         */
        getService: function () {
            var userInfo = loginManagement.userLogin() ? loginManagement.userLogin() : false;
            if (userInfo) {
                loginServiceSet.loginServiceApi.login.GetOpenAPITokenByUser.send([userInfo.AppID, userInfo.user, userInfo.passWord, userInfo.timestamp, userInfo.md5ts]).then(function (data) {
                    if (data.Ret == 0) {
                        loginManagement.localStorage(data.Data.Token);
                        loginManagement.getUserPermissions(data.Data.Token);
                        loginManagement.getOpenAPITokenByAppid();//Access to application level get token
                    }
                });
            }
        },
        /**
         * Access to application level get token
         */
        getOpenAPITokenByAppid: function () {
            var applicationUseInfo = {
                AppID: APPMODEL.APPID,
                ts: parseInt(new Date().getTime() / 1000),
                md5ts: hex_md5(APPMODEL.AppSecret + parseInt(new Date().getTime() / 1000))
            };
            loginServiceSet.loginServiceApi.login.GetOpenAPITokenByAppid.send([applicationUseInfo.AppID, applicationUseInfo.ts, applicationUseInfo.md5ts]).then(function (data) {
                if (data.Ret == 0) {
                    APPMODEL.Storage.setItem("applicationToken", data.Data.Token);
                }
            });
        },
        /**
         * get user permissions
         * @param token
         */
        getUserPermissions: function (token) {
            if (token) {
                loginServiceSet.loginServiceApi.login.GetCurUserRole.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success("登录成功");
                        loginManagement.identityChange(data.Data);
                    } else {
                        delete APPMODEL.Storage.token;
                        delete APPMODEL.Storage.copPage_token;
                        toastr.error('用户没有权限，请更换账号或者开通权限');
                        setTimeout(function () {
                            window.location.reload();
                        }, 5000);
                    }
                });
            } else {
                toastr.error("token为空");
            }
        },
        /**
         * identity choose
         * @param data
         */
        identityChange: function (data) {
            $scope.include = "public/tpl/userManagement/identityChoose.html";
            for (var i in data.RoleRightList) {
                data.RoleRightList[i].path = 'access.app.userManagement';
            }
            $scope.identityList = data.RoleRightList;
            var userIndetity = {
                Name: data.Name,
                Pic: data.Pic,
                Tel: data.Tel,
                UID: data.UID,
                identityList: data.RoleRightList
            };
            APPMODEL.Storage.setItem('copPage_user', JSON.stringify(userIndetity));
            /**
             * storage orGid
             * @param identity
             */
            $scope.storageOrGid = function (identity) {
                APPMODEL.Storage.setItem("copPage_orgid", JSON.stringify(identity));
                APPMODEL.Storage.setItem("cloudId", identity.CloudID);
            };
            /**
             * cancellation
             */
            $scope.cancellation = function () {
                delete APPMODEL.Storage.copPage_user;
                delete APPMODEL.Storage.copPage_token;
                window.location.reload();
            };
        },
        /**
         * judge user permission
         * @param callBack
         */
        sessionJudge: function (callBack) {
            var user = APPMODEL.Storage.getItem("copPage_token");
            if (!user) {
                this.generateValidation();
            } else {
                callBack(user);
            }
        },
        /**
         * user record token to localStorage
         * @param Token
         */
        localStorage: function (Token) {
            if (Token) {
                APPMODEL.Storage.setItem("copPage_token", Token);
            }
        },
        /**
         * judge user info
         * @returns {{AppID: number, AppSecretText: string, AppSecret: string, user: (*|jQuery), passWord: *, timestamp: number, md5ts: string}}
         */
        userLogin: function () {
            var useInfo = {
                AppID: APPMODEL.APPID,
                AppSecretText: APPMODEL.AppSecret,//测试AppSecret
                AppSecret: APPMODEL.AppSecret,//正式AppSecret
                user: $("#user").val(),
                passWord: hex_md5($("#password").val()),
                timestamp: parseInt(new Date().getTime() / 1000),
                md5ts: hex_md5(APPMODEL.AppSecret + parseInt(new Date().getTime() / 1000))
            };
            if ($scope.validation.toLowerCase() == $("#validationCode").val().toLowerCase()) {
                return useInfo;
            } else {
                toastr.error('验证码输入错误');
                return null;
            }
        },
        /**
         * judge explorer
         */
        judgeExplorer: (function () {
            return {
                browser: true,
                initExplorer: function () {
                    var userAgent = navigator.userAgent.toLowerCase();
                    // Figure out what browser is being used
                    jQuery.browser = {
                        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
                        safari: /webkit/.test(userAgent),
                        opera: /opera/.test(userAgent),
                        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
                        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
                    };
                    if ($.browser.msie && (parseInt($.browser.version) < 10)) {
                        toastr.error('浏览器版本过低');
                        this.browser = this.msie();
                    }
                    return this.browser;
                },
                /**
                 * IE
                 */
                msie: function () {
                    $scope.include = "public/tpl/userManagement/browser.html";
                    return false;
                }
            };
        })(),
        /**
         * tip
         */
        tip: (function () {
            return {
                init: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                    return loginManagement.judgeExplorer.initExplorer();//judge explorer
                }
            };
        })(),
        /**
         * generate validation
         */
        generateValidation: function () {
            this.validation();
            /**
             * refresh
             */
            $scope.refresh = function () {
                loginManagement.validation();
            };
            /**
             * click login
             */
            $scope.login = function () {
                loginManagement.getService();
            };
            /**
             * click refresh validation
             */
            $scope.validationClick = function () {
                $scope.refresh();
            };
            $scope.include = 'public/tpl/userManagement/userLogin.html';
        },
        /**
         * validation
         */
        validation: function () {
//            var validationCode = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
            var validationCode = "2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,U,V,W,X,Y,Z",
                colors = ["red", "white", "blue", "chartreuse", "yellow", "purple", "camel", "green", "ivory", "khaki"],
                valArr = validationCode.split(","),
                arr = [];
            for (var i = 0; i < 4; i++) {
                var num = Math.ceil(Math.random() * 55);
                var color = Math.ceil(Math.random() * colors.length - 1);
                var validationInit = {
                    number: valArr[num],
                    color: colors[color]
                };
                arr.push(validationInit);
            }
            $scope.validationList = arr;
            $scope.validation = "";
            for (var s in arr) {
                $scope.validation += arr[s].number;
            }
        }
    };
    loginManagement.init();//init function
}]);