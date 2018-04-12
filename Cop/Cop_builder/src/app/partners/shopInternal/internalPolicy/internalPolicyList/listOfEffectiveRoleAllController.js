
/**
 * Created by lqw on 2017/8/16
 */

app.controller('ListOfEffectiveRoleAllController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {


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
    var ListOfEffectiveRoleAll = {


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
                schoolID:0,
                name_v:undefined
            };
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.parterID=APPMODEL.Storage.getItem("orgid");


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

                GetPageStrategyRoles: function () {

                    applicationServiceSet.shopInternalServiceApi.shopService.GetPageStrategyRoles.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.sid ,$scope.model.schoolID,$scope.model.name_v,$scope.model.pSize, $scope.model.pIndex]).then(function (data) {

                        if (data.Ret == 0) {

                            ListOfEffectiveRoleAll.setting.dataChange(data.Data);//类型转换
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
                            $scope.model.schoolList.push({ID:0,FName:'全部学校'})
                            if(data.Data.length>0)
                                //$scope.model.schoolID= data.Data[0].ID;
                                ListOfEffectiveRoleAll.serviceApi.GetPageStrategyRoles();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                SetStrategyRoles: function (selectedList) {

                    applicationServiceSet.shopInternalServiceApi.shopService.SetStrategyRoles.send([selectedList],[APPMODEL.Storage.getItem('copPage_token') ,$scope.model.sid, $scope.model.schoolID]).then(function (data) {

                        if (data.Ret == 0) {
                            ListOfEffectiveRoleAll.serviceApi.GetPageStrategyRoles();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },
                RemoveStrategyRoles: function (ids) {

                    applicationServiceSet.shopInternalServiceApi.shopService.RemoveStrategyRoles.send([ids],[APPMODEL.Storage.getItem('copPage_token'),$scope.model.sid  ]).then(function (data) {

                        if (data.Ret == 0) {
                            ListOfEffectiveRoleAll.serviceApi.GetPageStrategyRoles();
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                pageIndex: function () {
                    /**
                     * paging index send
                     */
                    $scope.pageIndex = {
                        /**
                         * click paging
                         * @param page
                         */
                        fliPage: function (page) {
                            applicationServiceSet.shopInternalServiceApi.shopService.internalPolicyList.send( [APPMODEL.Storage.getItem('copPage_token'),  $scope.model.sid ,$scope.model.schoolID,$scope.model.name_v,$scope.model.pSize, page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {

                                    ListOfEffectiveRoleAll.setting.dataChange(data.Data);//类型转换
                                }
                                else {
                                    // toastr.error(data.Msg)
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.internalPolicyList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.sid ,$scope.model.schoolID,$scope.model.name_v,$scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {

                                    ListOfEffectiveRoleAll.setting.dataChange(data.Data);//类型转换
                                }
                                else {
                                    // toastr.error(data.Msg)
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.internalPolicyList.send( [APPMODEL.Storage.getItem('copPage_token'),  $scope.model.sid ,$scope.model.schoolID,$scope.model.name_v,$scope.model.pSize, pageNext]).then(function (data) {
                                if (data.Ret == 0) {

                                    ListOfEffectiveRoleAll.setting.dataChange(data.Data);//类型转换
                                }
                                else {
                                    // toastr.error(data.Msg)
                                }
                            });
                        }
                    };
                }

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
                    ListOfEffectiveRoleAll.serviceApi.GetCurUserSchool();
                }
                else {

                    ListOfEffectiveRoleAll.serviceApi.GetPageStrategyRoles();
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

                ListOfEffectiveRoleAll.serviceApi.SetStrategyRoles(selectedList);
            }

            $scope.add=function () {

                $location.url('access/app/partner/internalPolicy/listOfEffectiveRole?sid='+$scope.model.sid+'&sName=' +$scope.model.sName);
            }

            //删除关爱使
            $scope.delInternal = function (item) {
                var ids=[item.UID];
                // for (var i = 0; i < $scope.model.itemList.length; i++) {
                //     var ni = $scope.model.itemList[i];
                //     if (ni.IsChecked) {
                //
                //         ids.push(ni.UID);
                //     }
                // }

                ListOfEffectiveRoleAll.serviceApi.RemoveStrategyRoles(ids);
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

                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
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
    ListOfEffectiveRoleAll.init();//函数入口

}]);


