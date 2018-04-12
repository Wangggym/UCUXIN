/**
 * Created by fanweihua on 2016/8/25.
 * addStuFuncServiceByGiveController
 * add student service package by give
 */
app.controller('addStuFuncServiceByGiveController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
    var addStuFuncServiceByGive = {
        /**
         * function init
         */
        init: function () {
            this.tip();//tip
            this.formDisabled();//form disabled init true
            this.getOrgSchoolPage();//get school org pages list
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                gidName: undefined,
                productPackageName: undefined,
                schoolList: [],
                selectedGid: undefined,
                productPackageID: undefined,
                productPackageList: [],
                pageSize: 20,
                pageIndex: 1,
                classList: [],//班级
                classId: undefined,
                studentPack: false,//可购买服务包学生
                studentName: undefined,//学生名称
                dateStart: undefined,//开始时间
                dateOver: undefined,//结束时间
                openProductId: undefined,//开通的服务包
                openProductList: [],//开通的服务包列表
                ID: undefined
            };
        },
        /**
         * get school org pages list
         */
        getOrgSchoolPage: function () {
            $scope.formServiceDisabled = false;
            applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.schoolList = data.Data;
                    addStuFuncServiceByGive.changeOperation();//change operation
                }
            });
        },
        /**
         * get class list
         * @param gid
         */
        getClassList: function (gid) {
            if (gid) {
                $scope.formClassDisabled = false;
                applicationServiceSet.parAppServiceApi.applicationFeeOpen.getClassList.send([APPMODEL.Storage.getItem('copPage_token'), gid]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.classList = data.Data;
                    }
                });
            }
        },
        /**
         * according to the school ID get product package
         */
        getProductListByGid: function () {
            applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.selectedGid]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.productPackageList = data.Data;
                }
            });
        },
        /**
         * get service pack list
         */
        getServicePack: function (callBack) {
            applicationServiceSet.chargeServiceApi.chargeService.GetChargeListByProductId.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.selectProductPackageID]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.openProductList = data.Data;
                    if (callBack) {
                        callBack(data.Data);
                    }
                }
            });
        },
        /**
         * get student list
         * @param id
         * @param callBack
         */
        getStudentList: function () {
            $scope.serviceName = undefined;
            applicationServiceSet.chargeServiceApi.chargeService.GetStudentsList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.queryFields.selectedGid, $scope.model.openProductId, $scope.classid, $scope.studentName]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.studentList = data.Data;
                }
            });
        },
        /**
         * give student service package
         */
        addStuFuncServiceByGive: function () {
            var judgeBoolean = addStuFuncServiceByGive.judgeBasicInfo.studentList();//judge basic information exist
            if (judgeBoolean) {
                applicationServiceSet.chargeServiceApi.chargeService.AddStuFuncServiceByGive.send([$scope.model.selectProductPackageID, $scope.model.openProductId, $scope.model.UMIDList, $scope.queryFields.selectedGid]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success("保存成功");
                        delete addStuFuncServiceByGive.judgeBasicInfo;
                        $timeout(function () {
                            $("button[name='return']").trigger('click');
                        }, 10);
                    }
                });
            }
        },
        /**
         * judge basic information exist
         */
        judgeBasicInfo: function () {
            var basic = {
                studentList: function () {
                    $scope.model.UMIDList = [];
                    if ($scope.studentList) {
                        if ($scope.studentList.length > 0) {
                            for (var i in $scope.studentList) {
                                if ($scope.studentList[i].checked == true) {
                                    $scope.model.UMIDList.push($scope.studentList[i].UMID);
                                }
                            }
                        } else {
                            $scope.formSaveDisabled = true;
                        }
                    }
                    return basic.judge();
                },
                judge: function () {
                    // if (!$scope.model.FuncServiceProductID) {
                    //     toastr.error("请选择服务包");
                    //     return false;
                    // }
                    if (!$scope.model.ClassID) {
                        toastr.error("请选择班级");
                        return false;
                    }
                    if ($scope.model.UMIDList.length == 0) {
                        toastr.error("请选择学生");
                        return false;
                    }
                    return true;
                }
            };
            return basic;
        }(),
        /**
         * change operation
         */
        changeOperation: function () {
            $scope.model = {
                GID: undefined,
                FName: undefined,
                UMIDList: [],
                ClassID: undefined,
                ClassName: undefined,
                FuncServiceProductID: undefined,
                FuncServiceProductName: undefined
            };
            $scope.queryFields = {
                selectedGid: undefined,
                selectedClassID: undefined,
                selectedServiceID: undefined
            };
            /**
             * choose school
             * @param selectedGid
             */
            $scope.changeGid = function (selectedGid) {
                $scope.model.GID = selectedGid.ID;
                $scope.model.FName = selectedGid.FName;
                $scope.formServiceDisabled = false;
                $scope.queryFields.selectedClassID = undefined;
                $scope.queryFields.selectedServiceID = undefined;

                $scope.studentList = null;
                addStuFuncServiceByGive.getClassList($scope.queryFields.selectedGid);//get class list
                addStuFuncServiceByGive.getProductListByGid();//get product list
            };
            /**
             * 选择服务包
             */
            $scope.productPackageChange = function () {
                addStuFuncServiceByGive.getServicePack();
            }
            /**
             * choose class
             * @param selectedClassID
             */
            $scope.changeClass = function (selectedClassID) {
                $scope.model.ClassID = selectedClassID.ClassID;
                $scope.model.ClassName = selectedClassID.ClassName;
                $scope.classid = selectedClassID.ClassID;
                addStuFuncServiceByGive.getStudentList(selectedClassID.ClassID);//get student list
            };
            $scope.search = function () {
                if(!$scope.queryFields.selectedGid){
                    toastr.error("请选择学校！")
                    return;
                }
                if(!$scope.model.selectProductPackageID){
                    toastr.error("请选择产品！")
                    return;
                }
                if(!$scope.model.openProductId){
                    toastr.error("请选择服务包！")
                    return;
                }
                if(!$scope.queryFields.selectedClassID&&!$scope.studentName){
                    toastr.error("请选择班级或者填入学生名字！")
                    return;
                }
                addStuFuncServiceByGive.getStudentList();//get student list
            }
            /**
             * change service pack
             * @param selectedServiceID
             */
            $scope.changeService = function (selectedServiceID) {
                // $scope.model.FuncServiceProductID = selectedServiceID.ID;
                // $scope.model.FuncServiceProductName = selectedServiceID.Name;
                // $scope.serviceID = selectedServiceID.ID;
                // $scope.formSaveDisabled = false;
                for (var i in $scope.model.productPackageList) {
                    if ($scope.model.productPackageList[i].ID == $scope.model.productPackageID) {
                        $scope.model.productPackageName = $scope.model.productPackageList[i].Name;
                        break;
                    }
                }
                addStuFuncServiceByGive.serviceApi.getChargeListByProductId();//根据产品Id获取服务包列表
            };
            /**
             * traverse student list
             * @param studentList
             * @param index
             */
            $scope.checkedOne = function (studentList, index) {
                angular.forEach(studentList, function (value, key) {
                    if (key == index) {
                        if (value.checked) {
                            value.checked = false;
                        } else {
                            value.checked = true;
                        }
                    }
                });
            };
            /**
             * save
             */
            $scope.save = function () {
                addStuFuncServiceByGive.addStuFuncServiceByGive();//give student service package
            };
            /**
             * delete gid
             */
            $scope.deleteQueryFieldsGid = function () {
                $scope.queryFields.selectedGid = undefined;
                $scope.queryFields.selectedClassID = undefined;
                $scope.queryFields.selectedServiceID = undefined;
                $scope.model.GID = undefined;
                $scope.formClassDisabled = true;
                $scope.formServiceDisabled = true;
                $scope.formSaveDisabled = true;
                $scope.studentList = null;
            };
            /**
             * delete class ID
             */
            $scope.deleteQueryFieldsClassID = function () {
                $scope.queryFields.selectedClassID = undefined;
                $scope.model.ClassID = undefined;
                $scope.studentList = null;
            };
            /**
             * delete service ID
             */
            $scope.deleteQueryFieldsServiceID = function () {
                $scope.queryFields.selectedServiceID = undefined;
                $scope.formSaveDisabled = true;
            };
        },
        /**
         * form disabled init true
         */
        formDisabled: function () {
            $scope.formClassDisabled = true;
            $scope.formServiceDisabled = true;
            $scope.formSaveDisabled = true;
        },
        /**
         * tip
         */
        tip: function () {
            toastr.toastrConfig.positionClass = 'toast-top-center';
            toastr.toastrConfig.timeOut = 2000;
        }
    };
    addStuFuncServiceByGive.init();//function init
}]);