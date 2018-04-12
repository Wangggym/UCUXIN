
/**
 * Created by lqw on 2017/8/16
 */

app.controller('ListOfEffectiveRoleController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {


    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAll = false;
    $scope.checkAll = function () {
        $scope.selectedList = [];
        angular.forEach($scope.model.itemList, function (item) {
            if ($scope.checkedAll) {
                item.IsChecked = true;
                $scope.selectedList.push(item.ID);
            } else {
                item.IsChecked = false;
            }
        });
    };
    $scope.checkedSingle = function (checked, id) {
        if (checked) {
            $scope.selectedList.push(id);
            if ($scope.selectedList.length === $scope.model.itemList.length) {
                $scope.checkedAll = true;
            }
        } else {
            $scope.checkedAll = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
        }
    };
    // --- 表格全选功能 结束 --------------------------------------------------

    /**
     * c积分策略列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    var ListOfEffectiveRole = {


        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作
            this.setting.tip();//tip

        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                parterID:0,
                pSize: 20,
                pIndex: 1,
                sid:undefined,
                sName:undefined,
                schoolList:[],
                schoolID:undefined,
                name_v:undefined
            };
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.parterID=orgModel.OrgType;


            if ($stateParams.sid) {
                $scope.model.sid=$stateParams.sid;
                $scope.model.sName=$stateParams.sName;
            }


        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                GetStrategyRoles: function () {

                    applicationServiceSet.shopInternalServiceApi.shopService.GetStrategyRoles.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.sid ,$scope.model.schoolID,$scope.model.name_v]).then(function (data) {

                        if (data.Ret == 0) {

                            ListOfEffectiveRole.setting.dataChange(data.Data);//类型转换
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                GetCurUserSchool:function ( ) {
                    applicationServiceSet.shopInternalServiceApi.shopService.GetCurUserSchool.send([APPMODEL.Storage.getItem('copPage_token') ,$scope.model.parterID ]).then(function (data) {

                        if (data.Ret == 0) {
                              $scope.model.schoolList=data.Data;
                              if(data.Data.length>0)
                                $scope.model.schoolID= data.Data[0].ID;
                              ListOfEffectiveRole.serviceApi.GetStrategyRoles();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                SetStrategyRoles: function (selectedList) {

                    applicationServiceSet.shopInternalServiceApi.shopService.SetStrategyRoles.send([selectedList],[APPMODEL.Storage.getItem('copPage_token') ,$scope.model.sid, $scope.model.schoolID]).then(function (data) {

                        if (data.Ret == 0) {
                            ListOfEffectiveRole.serviceApi.GetStrategyRoles();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                pageIndex: function () {}

            };
        })(),
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {
                if(!$scope.model.schoolID){
                    ListOfEffectiveRole.serviceApi.GetCurUserSchool();
                }
                else {

                    ListOfEffectiveRole.serviceApi.GetStrategyRoles();
                }
            };

            /**
            * 保存
            * */
            $scope.save=function () {
                var selectedList=[];
                angular.forEach($scope.model.itemList, function (item) {
                    if(item.IsChecked){
                        selectedList.push(item);
                    }
                });

                ListOfEffectiveRole.serviceApi.SetStrategyRoles(selectedList);
            }


            //创建关爱使
            $scope.newIntergral=function () {
                $location.url('/access/app/internal/internalPolicy/createIntegral')
            }

            //返回
$scope.return=function () {
    $location.url('access/app/internal/internalPolicy/listOfEffectiveRoleAll?sid='+$scope.model.sid+'&sName=' +$scope.model.sName);
}

            $scope.search();//查询
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据类型转换
                 * @param data
                 */
                dataChange: function (data) {

                    $scope.model.itemList = data;

                },

                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                },
                /**
                 * dateFormart
                 */
                dateFormart:function(date, format){
                    date = date.substring(0,10);
                    return date;
                    if (typeof (date)=="undefined") {
                        return "";
                    }
                    if (!(date instanceof  Date)) {
                        return "";
                    }

                    var $this = date;
                    var o = {
                        "M+": $this.getMonth() + 1, //month
                        "d+": $this.getDate(), //day
                        "h+": $this.getHours(), //hour
                        "m+": $this.getMinutes(), //minute
                        "s+": $this.getSeconds(), //second
                        "q+": Math.floor(($this.getMonth() + 3) / 3), //quarter
                        "S": $this.getMilliseconds() //millisecond
                    }
                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, ($this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    }

                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                        }
                    }
                    return format;
                }
            };
        })()
    };
    ListOfEffectiveRole.init();//函数入口

}]);


