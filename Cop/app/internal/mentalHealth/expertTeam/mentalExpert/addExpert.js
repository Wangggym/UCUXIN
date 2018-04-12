/**
 * Created by lxf on 2017/7/14.
 */
app.controller('addExpert', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    var token = APPMODEL.Storage.getItem("copPage_token");

    var ctr = {
        init: function () {
            ctr.basic();
            ctr._GetAllPsyOrgList();
            ctr._GetPsyAreaList();
            ctr._GetExpertRoleList();
            ctr.getArea(0, 0);
        },
        basic: function () {
            //用户model
            $scope.model = {
                PsyAreas: [],
                Roles: [],
                ID: 0,
                Name: "",
                Tel: "",
                Pic: "",
                Qualification: "",
                Intro: "",
                Therapy: "",
                ConsultingStyle: "",
                ConsultingHours: "",
                ProfessionalGrowth: "",
                TrainingExperience: "",
                Publication: "",
                Cont: "",
                Seq: ""
            };
            /*
            *  状态
            * */
            $scope.status = [{value: -1, label: "无效"}, {value: 1, label: "正常"}];
            $scope.context = new Object();
            /*-------------------------------*/
            //照片上传
            $scope.fileChange = function (file) {
                if (file) {
                    applicationServiceSet.mentalHealthService._ExpertTeam._ImageRegistrationUpload.fileUpload(file).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.Pic = data.Data.ThumbUrl;
                        }
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
                // console.log($scope.model.Roles)

                if (arr.length == 0) {
                    $scope.model.Roles.push(item);
                } else {
                    $scope.model.Roles = $scope.model.Roles.filter(function (e, i) {
                        return e.RoleID !== item.RoleID;
                    })
                }
                // console.log($scope.model.Roles)
            };
            //判断默认是否选中系统角色
            $scope.isCheckedRole = function (item) {
                var result = $scope.model.Roles.filter(function (e, i) {
                    return e.RoleID === item.RoleID;
                });
                return result.length !== 0;
            };
            /*------------------------------------------*/
            $scope.onCityChange = function () {
                if ($scope.model.PRID) {
                    ctr.getArea($scope.model.PRID, 1);
                }
            };
            $scope.ok = function () {
                if(!$scope.model.PsyOrgID){
                    toastr.error('请选择心理机构');
                    return;
                }
                if(!$scope.model.CRID || !$scope.model.PRID){
                    toastr.error('请选择城市');
                    return;
                }
                if(!$scope.model.Name){
                    toastr.error('请填写专家名称');
                    return;
                }
                if(!$scope.model.Tel){
                    toastr.error('请填写优信账号');
                    return;
                }
                if(!(/^1[34578]\d{9}$/.test($scope.model.Tel))){
                    toastr.error('请填写正确的优信账号');
                    return;
                }
                if(!$scope.model.Pic){
                    toastr.error('请上传头像');
                    return;
                }
                if($scope.model.PsyAreas.length == 0){
                    toastr.error('请选择擅长领域');
                    return;
                }
                if(!$scope.model.Seq){
                    toastr.error('请填写排序值');
                    return;
                }
                if(!$scope.model.ST){
                    toastr.error('请选择状态');
                    return;
                }
                if($scope.model.Roles.length == 0){
                    toastr.error('请选择系统角色');
                    return;
                }


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
                    if (data.Ret === 0) {
                        toastr.success("新增成功");
                        $scope.cancel();
                    }
                })
            }
        },
        //获取系统角色
        _GetExpertRoleList: function () {
            applicationServiceSet.mentalHealthService._ExpertTeam._GetExpertRoleList.send([token, 1]).then(function (data) {
                if (data.Ret === 0) {
                    $scope.role = data.Data;
                    $scope.model.Roles = [];
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
                if (data.Ret === 0) {
                    $scope.psyAreaList = data.Data;
                }
            })
        },
        //根据type类型判断 获取省==0 ,获取市==1
        getArea: function (rid, type) {
            if (type === 0) {
                applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([token, rid]).then(function (data) {
                    if (data.Ret === 0) {
                        $scope.provinceList = data.Data;
                    }
                })
            } else {
                applicationServiceSet.mentalHealthService._ExpertTeam._GetRegionList.send([token, rid]).then(function (data) {
                    if (data.Ret === 0) {
                        $scope.cityList = data.Data;
                    }
                })
            }
        }
    };
    ctr.init();
}]);
