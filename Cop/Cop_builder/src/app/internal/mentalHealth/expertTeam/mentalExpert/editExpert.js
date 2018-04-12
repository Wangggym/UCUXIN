/**
 * Created by lxf on 2017/7/14.
 */
app.controller('editExpert', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var token = APPMODEL.Storage.getItem("copPage_token");
    var ctr = {
        init: function () {
            ctr.basic();
            ctr.getDetail();
            ctr._GetAllPsyOrgList();
            ctr._GetPsyAreaList();
            ctr._GetExpertRoleList();
        },
        basic: function () {
            /*
             *
             *  用户model
             * */
            $scope.model = {
                PsyAreas: [],
                Roles: []
            };
            /*
             *  状态
             * */
            $scope.status = [{value: -1, label: "无效"}, {value: 1, label: "正常"}];
            //富文本初始化
            $scope.context = new Object();

            /*-------------------------------*/
            //照片上传
            $scope.fileChange = function (file) {
                if (file) {
                    applicationServiceSet.mentalHealthService._ExpertTeam._ImageRegistrationUpload.fileUpload(file).then(function (data) {
                        if (data.Ret == 0) $scope.model.Pic = data.Data.ThumbUrl;
                    });
                }
            };
            $scope.onChangePro = function () {
                ctr.getArea($scope.model.PRID, 1);
            };
            $scope.cancel = function () {
                $state.go("access.app.internal.expertTeam.mentalExpert");
            };
            //选择擅长领域----------------------
            $scope.checkArea = function (item) {
                var arr = $scope.model.PsyAreas.filter(function (e, i) {
                    return e.ID == item.ID
                });
                if (arr.length == 0) {
                    $scope.model.PsyAreas.push(item);
                } else {
                    $scope.model.PsyAreas = $scope.model.PsyAreas.filter(function (e, i) {
                        return e.ID !== item.ID;
                    })
                }
            };
            //判断默认是否选中擅长领域
            $scope.isChecked = function (item) {
                var result = $scope.model.PsyAreas.filter(function (e, i) {
                    return e.ID === item.ID;
                });
                return result.length !== 0;
            };
            //选择系统角色----------------------
            $scope.checkRole = function (item) {
                var arr = $scope.model.Roles.filter(function (e, i) {
                    return e.RoleID == item.RoleID
                });
                if (arr.length == 0) {
                    $scope.model.Roles.push(item);
                } else {
                    $scope.model.Roles = $scope.model.Roles.filter(function (e, i) {
                        return e.RoleID !== item.RoleID;
                    })
                }
            };
            //判断默认是否选中系统角色
            $scope.isCheckedRole = function (item) {
                var result = $scope.model.Roles.filter(function (e, i) {
                    return e.RoleID === item.RoleID;
                });
                return result.length !== 0;
            };
            /*------------------------------------------*/

            $scope.ok = function () {
                //获取富文本的内容
                $scope.model.Cont = $scope.context.returnUeditText();

                var city = $scope.cityList.filter(function (data) {
                    return data.RID === $scope.model.CRID;
                });
                city = city[0];
                var province = $scope.provinceList.filter(function (data) {
                    return data.RID === $scope.model.PRID;
                });
                province = province[0];
                $scope.model.CRName = city.Name;
                $scope.model.PRName = province.Name;
                // $scope.model.ID,$scope.model.PsyOrgID,
                //   $scope.model.PsyOrgName,$scope.model.PRID,$scope.model.PRName,$scope.model.CRID,$scope.model.CRName,
                //   $scope.model.Name,$scope.model.Tel,$scope.model.Pic,$scope.model.Qualification,$scope.model.PsyAreas,
                //   $scope.model.Intro,$scope.model.Therapy,$scope.model.ConsultingStyle,$scope.model.ConsultingHours,
                //   $scope.model.ProfessionalGrowth,$scope.model.TrainingExperience,$scope.model.Publication,
                //   $scope.model.Cont,$scope.model.Seq,$scope.model.ST,$scope.model.Roles


                applicationServiceSet.mentalHealthService._ExpertTeam._AddOrUpExpert.send($scope.model, [token]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success("编辑成功");
                        $scope.cancel();
                    }
                })
            }
        },
        //获取系统角色
        _GetExpertRoleList: function () {
            applicationServiceSet.mentalHealthService._ExpertTeam._GetExpertRoleList.send([token, 1]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.role = data.Data;
                }
            })
        },
        //获取心理机构
        _GetAllPsyOrgList: function () {
            applicationServiceSet.mentalHealthService._ExpertTeam._GetAllPsyOrgList.send([token]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.psyList = data.Data;
                }
            })
        },
        //获取心理领域
        _GetPsyAreaList: function () {
            applicationServiceSet.mentalHealthService._ExpertTeam._GetPsyAreaList.send([token]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.psyAreaList = data.Data;
                }
            })
        },
        getDetail: function () {
            applicationServiceSet.mentalHealthService._ExpertTeam._GetExpert.send([token, $stateParams.id]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model = data.Data;
                    $scope.model.PRID = parseInt(data.Data.PRID);
                    $scope.model.CRID = parseInt(data.Data.CRID);
                    ctr.getArea(0,0);
                    //富文本加载初始值
                    $scope.context.receiveUeditText(data.Data.Cont);
                }
            })
        },
        //根据type类型判断 获取省==0 ,获取市==1
        getArea: function (rid, type) {
            if (type === 0) {
                applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([token, rid]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.provinceList = data.Data;
                        ctr.getArea($scope.model.PRID, 1);
                    }
                })
            } else {
                applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([token, rid]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.cityList = data.Data;
                    }
                })
            }
        }
    };
    ctr.init();
}]);
