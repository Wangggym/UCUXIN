/**
 * Created by ljq on 2017/8/15
 */
app.controller('userCanceAuthorzationController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {

    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAll = false;
    $scope.checkAll = function () {
        $scope.selectedList = [];
        angular.forEach($scope.model.itemList, function (item) {
            if ($scope.checkedAll) {
                item.checked = true;
                $scope.selectedList.push(item.ID);
            } else {
                item.checked = false;
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
    var userCanceAuthorzation = {


        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
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
                Tel:undefined,

            };
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.parterID=orgModel.OrgType;
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                /**
                 * 获取组织下的所有用户
                 */
                GetTelMembers: function () {

                    applicationServiceSet.internalServiceApi.userManagementInstitution.GetTelMembers.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.Tel,APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            userCanceAuthorzation.setting.dataChange(data)
                        }
                    });
                },

                //取消授权
                UnRelateMembers:function (item,callBack) {
                    var data = {};
                    data.msg = item.Name;
                    console.log(item.ids);
                    data.delet = function () {

                        applicationServiceSet.internalServiceApi.userManagementInstitution.UnRelateMembers.send([ item.ids   ],[APPMODEL.Storage.getItem('applicationToken'),APPMODEL.Storage.getItem("orgid")]).then(function (data) {

                            if (data.Ret == 0) {

                                if(callBack)callBack();
                                $scope.search();
                            }
                            else {
                                // toastr.error(data.Msg)
                            }
                        });
                    };
                    var modalInstance = $modal.open({
                        templateUrl: 'pushMsgDetail.html',
                        controller: 'ModalPushMsgDetailCtrl',
                        size: 'sm',
                        resolve: {
                            items: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (data) {
                        $scope.data = data;
                    }, function () {

                    });
                },
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
                if(!$scope.model.Tel || $scope.model.Tel.length<11){
                    toastr.error('请输入完整的电话号码');
                    return;
                }
                userCanceAuthorzation.serviceApi.GetTelMembers();//服务集合
            };
            //取消授权
            $scope.cancelAuthorizetion=function () {
                var ids=[];
                for (var i = 0; i < $scope.model.itemList.length; i++) {
                    var ni = $scope.model.itemList[i];
                    if (ni.checked) {

                        ids.push(ni.MID);
                    }
                }

                userCanceAuthorzation.serviceApi.UnRelateMembers({Name:'',ids:ids},function () {
                    toastr.error('操作成功');
                    userCanceAuthorzation.serviceApi.GetTelMembers();
                })
            }


         //   $scope.search();//查询
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

                    for (var i in data.Data) {

                        if(data.Data[i].UID>0){
                            data.Data[i].stateName='已激活'
                        }else {
                            data.Data[i].stateName='未激活'
                        }

                    }
                    $scope.model.itemList = data.Data;

                },
                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                },

            };
        })()
    };
    userCanceAuthorzation.init();//函数入口

}]);


//确定删除
app.controller('ModalPushMsgDetailCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.msgDetail = items.msg;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.cancelDelet = function () {
        items.delet();
        $modalInstance.dismiss('cancel');
    };
}]);
app.controller('showImgCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    $scope.msgDetail = items;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

