/**
 * Created by xj on 2017/3/8.
 */
app.controller('addPartnerProductController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
    /**
     * First Add Product
     */
    var FirstAddProduct = {
        /**
         * function init
         */
        init: function () {
            this.variable();//variable declaration
            this.serviceApi.getOrgSchoolPage();//get school org pages list
            this.operation.basic();//search bank transfer registration list
        },
        /**
         * variable declaration
         */
        variable: function () {
            $scope.queryFields = {
                selectedGid: 0
            };
            $scope.itemList = [];
            // 分页指令配置
            $scope.pagination = {
                currentPage: 1,
                totalItems: undefined,
                itemsPerPage: 10, // 默认查询10条
                maxSize: 5,
                previousText: "上页",
                nextText: "下页",
                firstText: "首页",
                lastText: "末页"
            };
        },
        /**
         * service aggregate
         * @type {{getOrgSchoolPage: getOrgSchoolPage}}
         */
        serviceApi: (function () {
            return {
                /**
                 * get school org pages list
                 */
                getOrgSchoolPage: function () {
                    applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.schoolList = data.Data;
                        }
                    });
                },
                /**
                 * get all school configuration records
                 */
                getAllGroupConfig: function () {
                    applicationServiceSet.chargeServiceApi.chargeService.GetPageGroupData.send([APPMODEL.Storage.getItem('copPage_token'), $scope.pagination.currentPage, $scope.pagination.itemsPerPage, APPMODEL.Storage.getItem('orgid'), $scope.queryFields.selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.pagination.totalItems = data.Data.TotalRecords;
                            $scope.itemList = data.Data.ViewModelList;
                        }
                    });
                },
                /**
                 * 删除产品项
                 */
                removeProduct: function (item) {
                    applicationServiceSet.chargeServiceApi.chargeService.RemoveProductById.send(undefined, [APPMODEL.Storage.getItem('copPage_token'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success('删除成功');
                            $scope.itemList.splice($scope.itemList.indexOf(item), 1);
                        }
                    });
                }
            };
        })(),
        /**
         * operation
         */
        operation: {
            basic: function () {
                /**
                 * school change get gid
                 */
                $scope.changeGid = function () {
                    APPMODEL.Storage.setItem('selectedGid', $scope.queryFields.selectedGid);
                    $scope.search();//get all school configuration records
                };
                /**
                 * search
                 */
                $scope.search = function () {
                    FirstAddProduct.serviceApi.getAllGroupConfig();//get all school configuration records
                };
                /**
                 * 分页配置
                 */
                $scope.pageQuery = function () {
                    FirstAddProduct.serviceApi.getAllGroupConfig();//get all school configuration records
                };
                /**
                 * 删除
                 * @param item
                 */
                $scope.deleteMine = function (item) {
                    FirstAddProduct.serviceApi.removeProduct(item);//删除产品列表
                };
                /**
                 * 添加
                 */
                $scope.addItem = function (ID) {
                    //$location.url('access/app/partner/applicationFeeOpen/newAddProduct',{SchoolId: ID});
                    //$location.url('access/app/partner/applicationFeeOpen/newAddProduct?id=&GID=&SchoolId=' + ID);
                    $state.go('access.app.partner.applicationFeeOpen.newAddProduct',{SchoolId:ID})
                };
                /**
                 * 修改
                 * @param item
                 */
                $scope.save = function (item) {
                    if (!item) {
                        return;
                    }
                    $location.url('access/app/partner/applicationFeeOpen/newAddProduct?id=' + item.ID + '&GID=' + item.GID);
                };
                // 切换页码
                $scope.pageQuery = function () {
                    FirstAddProduct.serviceApi.getAllGroupConfig();
                };
                $scope.search();
            }
        }
    };
    FirstAddProduct.init();//Add product function init
}]);