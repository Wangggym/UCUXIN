/**
 * Created by Wang QiHan on 2016/11/21.
 * User School Authority Controller
 */

app.controller('UserSchoolAuthorityPartnersController', ['$scope', '$modal', '$state', '$stateParams', 'cityList', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope, $modal, $state, $stateParams, cityList, toastr, toastrConfig, applicationServiceSet) {
    'use strict';

    toastrConfig.preventOpenDuplicates = true;
    $scope.cityList = cityList;
    $scope.a ={};
    $scope.b ={};
    $scope.queryFields = {
        school: '',
        user: undefined
    };

    $scope.config = {
        school: undefined,
        user: undefined,
        choiceAll:false,
        title:$stateParams.Name.split(' ')[0]+'/'+$stateParams.Name.split(' ')[1]
    };

    // 分页指令配置
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 30, // 默认查询30条
        totalItems:0,
        maxSize: 5,
        previousText: "上页",
        nextText: "下页",
        firstText: "首页",
        lastText: "末页"
    };
    /*获取省份*/
    applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([APPMODEL.Storage.getItem('copPage_token'),0]).then(function (data) {
        if(data.Ret==0){
            $scope.provinceList = data.Data;
        }
    });
    /*获取市区*/
    $scope.getCity = function (rid) {
        $scope.a.selectCity = undefined;
        $scope.b.selectArea = undefined;

        applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([APPMODEL.Storage.getItem('copPage_token'),rid]).then(function (data) {
            if(data.Ret==0){
                $scope.citysList = data.Data;
                $scope.a.selectCity = data.Data[0].RID;
            }
        });
    };
    /*获取市区*/
    $scope.getArea = function (rid) {
        $scope.b.selectArea = undefined;
        applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([APPMODEL.Storage.getItem('copPage_token'),rid]).then(function (data) {
            if(data.Ret==0){
                $scope.areaList = data.Data;
                $scope.b.selectArea = data.Data[0].RID;
            }
        });
    };
    /*获取查询列表*/
    $scope.search = function () {
        applicationServiceSet.couldRegionServiceApi.couldRegion.GetPageAdminAccessGroups.send([APPMODEL.Storage.getItem('copPage_token'),
            $scope.pagination.itemsPerPage,$scope.pagination.currentPage,APPMODEL.Storage.getItem('cloudId'),APPMODEL.Storage.getItem('orgid'),
            $stateParams.UID,$scope.a.selectCity?$scope.a.selectCity:0,$scope.queryFields.school,true]).then(function (data) {
            if(data.Ret==0){
                $scope.dataList = data.Data.ViewModelList;
                $.each($scope.dataList,function (e,item) {
                    item.check = false;
                });
                $scope.pagination.totalItems = data.Data.TotalRecords;
            }
        });
    };
    $scope.search();

    /**
     *选择
     */
    $scope.check = function (item) {
        if(item.check==true){
            item.check = false;
        }else {
            item.check = true;
        }
    };
    /**
     * 全选
     */
    $scope.checkAll = function () {
        if(!$scope.config.choiceAll){
            $.each($scope.dataList,function (e,item) {
                item.check = true;
            });
            $scope.config.choiceAll = true;
        }else {
            $.each($scope.dataList,function (e,item) {
                item.check = false;
            });
            $scope.config.choiceAll = false;
        }
    };
    /**
     *删除
     */
    $scope.delet = function () {
        var list = [];
        $.each($scope.dataList,function (e,item) {
            if(item.check){
                list.push(item.ID);
            }
        });
        if(list.length == 0){
            toastr.error('请选择要删除的学校！');
            return;
        }
        applicationServiceSet.parAppServiceApi.userManagementInstitution.deleteOrgAdminGroup.send([list],[APPMODEL.Storage.getItem('copPage_token'),
            APPMODEL.Storage.getItem('orgid'),$stateParams.UID
        ]).then(function (data) {
            if(data.Ret==0){
                toastr.success('删除成功！');
                $scope.search();
            }
        });
    };
    /**
     *
     */
    // -----  服务方法配置开始  -------------------------------------------------------------------

    var userSchools = (function () {

        var token = APPMODEL.Storage.copPage_token,
            appToken = APPMODEL.Storage.applicationToken,
            orgid = APPMODEL.Storage.orgid;

        var service = function (method, arr, list, fn) {
            if (Object.prototype.toString.call(list) === '[object Function]') {
                fn = list;
                list = undefined;
            }
            applicationServiceSet.parAppServiceApi.userManagementInstitution[method].send(arr, list).then(fn);
        };

        var getSimpleOrgUsers = function () {
            service('getSimpleOrgUsers', [token, orgid], function (data) {
                if (data.Ret === 0) {
                    if ($scope.queryFields.user !== $stateParams.UID) {
                        $scope.config.user = undefined;
                        $scope.queryFields.user = undefined;
                    }
                    $scope.config.user = data.Data || undefined;
                }
            });
        };

        var getFuzzyQuerySchool = function (keyword) {
            service('getFuzzyQuerySchool', [appToken, keyword], function (data) {
                if (data.Ret === 0) {
                    $scope.config.school = data.Data || undefined;
                }
            });
        };

        var getSchoolList = function () {
          service('getSchoolList', [token, orgid], function (data) {
            if(data.Ret === 0){
              $scope.config.school = data.Data;
            }
          });
        };

        var getUserGroupPage = function () {
            if (!$scope.queryFields.user) return;
            var school = $scope.queryFields.school || 0;
            service('getUserGroupPage', [token, $scope.pagination.currentPage, $scope.pagination.itemsPerPage, orgid, $scope.queryFields.user, school], function (data) {
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

        // 删除用户学校
        var deleteUserSchool = function (orgid, uid, gid) {
            service('deleteUserSchool', undefined, [token, orgid, uid, gid], function (data) {
                if (data.Ret === 0) {
                    toastr.success('删除成功！');
                    getUserGroupPage();
                }
                ;
            });
        };

        return {
            getSchoolList: getSchoolList,
            getUserGroupPage: getUserGroupPage,
            deleteUserSchool: deleteUserSchool,
            getSimpleOrgUsers: getSimpleOrgUsers
        }
    })();


    if ($stateParams.UID) {
        $scope.queryFields.user = $stateParams.UID;
        //userSchools.getUserGroupPage();
    }

    userSchools.getSchoolList();
    //userSchools.getSimpleOrgUsers();//根据合作伙伴获取用户列表

    // 查询学校


    // 查询出列表
    $scope.submitQuery = $scope.pageQuery = function (event) {
        if (event) {
            // 当点击查询时重置当页为首页
            var event = event || window.event;
            var target = event.target || window.srcElement;
            if (target.tagName.toLocaleLowerCase() == "button") {
                $scope.pagination.currentPage = 1;
            }
        }
        if(!$scope.queryFields.school){
            $scope.queryFields.school = '';
        }

        $scope.search();
    };

    $scope.save = function (uid) {
        $state.go('access.app.partner.userManagementPartner.saveUserSchoolAuthorityPartners', uid ? { UID: uid,Name:$stateParams.Name} : '');
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
            userSchools.deleteUserSchool(data.OrgID, data.UID, data.GID);
        }, function () {
            // 取消时作出操作
        });
    };
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
