/**
 * Created by Wang QiHan on 2016/11/21.
 * List Of Partner Schools Controller
 */

app.controller('ListOfPartnerSchoolsController', ['$scope', '$modal', '$location', 'cityList', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $modal, $location, cityList, toastr, toastrConfig, applicationServiceSet) {
    'use strict';

    toastrConfig.preventOpenDuplicates = true;
    $scope.cityList = cityList;

    $scope.queryFields = {
        partner: undefined,
        school: undefined,
        province: undefined,
        city: undefined,
        district: undefined,
        rid: undefined
    };

    $scope.config = {
        province: undefined,
        city: undefined,
        district: undefined,
        partner: undefined
    };

    // 分页指令配置
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 50, // 默认查询10条
        maxSize: 5,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
    };

    $scope.$watch('queryFields.province', function (nv, ov) {
        if (nv === ov) return;
        $scope.queryFields.city = $scope.queryFields.district = undefined;
        $scope.config.city = $scope.config.district = undefined;

        if (nv === undefined) return;
        $scope.config.city = cityList.filter(function (item, index, isArray) {
            return item.id === $scope.queryFields.province
        })[0]['sub'];
    });

    $scope.$watch('queryFields.city', function (nv, ov) {

        if (nv === ov) return;
        $scope.queryFields.district = undefined;
        $scope.config.district = undefined;
        if (nv === undefined) return;

        $scope.config.district = $scope.config.city.filter(function (item, index, isArray) {
            return item.id === $scope.queryFields.city
        })[0]['sub'];
    });

    // -----  服务方法配置开始  -------------------------------------------------------------------

    var partnerSchools = (function () {

        var token = APPMODEL.Storage.copPage_token;

        var service = function (method, arr, list, fn) {
            if (Object.prototype.toString.call(list) === '[object Function]') {
                fn = list;
                list = undefined;
            }
            applicationServiceSet.internalServiceApi.organizationalInstitution[method].send(arr, list).then(fn);
        };

        var getOrgList = function () {
            service('getOrgList', [token, 8], function (data) {
                if (data.Ret === 0) {
                    $scope.config.partner = data.Data || undefined;
                }
            });
        };

        var getOrgSchoolPage = function () {
            var school = $scope.queryFields.school || '',
                rid = $scope.queryFields.rid = $scope.queryFields.district || 0;
            service('getOrgSchoolPage', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, $scope.queryFields.partner, school, rid], function (data) {
                if (data.Ret === 0) {
                    if (data.Data) {
                        $scope.dataList = data.Data.ViewModelList;
                        $scope.pagination.totalItems = data.Data.TotalRecords;
                        $scope.pagination.numPages = data.Data.Pages;
                    } else {
                        $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
                    }
                }
            });
        };

        var deleteOrgSchool = function (orgid, gid) {
            service('deleteOrgSchool', undefined, [token, orgid, gid], function (data) {
                if (data.Ret === 0) {
                    toastr.success('删除成功！');
                    getOrgSchoolPage();
                }
                ;
            });
        };

        return {
            getOrgList: getOrgList,
            getOrgSchoolPage: getOrgSchoolPage,
            deleteOrgSchool: deleteOrgSchool
        }
    })();

// 获取组织列表
    partnerSchools.getOrgList();

    partnerSchools.getOrgSchoolPage();


    // 查询出列表
    $scope.submitQuery = $scope.pageQuery = function (event) {
        if (($scope.queryFields.province || $scope.queryFields.city) && !$scope.queryFields.district) {
            toastr.error('请选择城市与区县！');
            return;
        }

        if (event) {
            // 当点击查询时重置当页为首页
            var event = event || window.event;
            var target = event.target || window.srcElement;
            if (target.tagName.toLocaleLowerCase() == "button") {
                $scope.pagination.currentPage = 1;
            }
        }
        partnerSchools.getOrgSchoolPage();
    };

    $scope.save = function () {
        $location.path('access/app/internal/organizationalInstitution/saveNewPartnerSchool');
    };

    $scope.del = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'removeConfirm.html',
            size: 'sm',
            controller: 'RemoveConfirmCtrl',
            resolve: {
                items: function () {
                    return item
                }
            }
        });

        modalInstance.result.then(function (data) {
            partnerSchools.deleteOrgSchool(data.OrgID, data.ID);
        }, function () {
            // 取消时作出操作
        });
    }

}]);

app.controller('RemoveConfirmCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
    'use strict';
    $scope.item = items;
    $scope.comfirm = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
