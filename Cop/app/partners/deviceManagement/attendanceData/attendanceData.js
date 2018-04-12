/**
 * Created by lxf on 2017/6/24.
 * applicationFeeVerificationController
 * application fee verification
 */
app.controller('attendanceData', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var ctr = {
        init:function () {
            ctr.basic();
            ctr.date();
            ctr.pageIndex();
            ctr.getSchoolList();
        },
        //查询考勤数据
        GetClockRosterPage:function () {
            $scope.dateStart = ctr.dateChange($scope.dateStart);
            $scope.dateOver = ctr.dateChange($scope.dateOver);

            applicationServiceSet.attendanceService.basicDataControlService.GetClockRosterPage.send([20,1,$scope.model.school,$scope.dateStart,$scope.dateOver,$scope.model.clockTime,$scope.model.class,$scope.stuName]).then(function (data) {
                if(data.Ret==0){
                    $scope.pageIndex.pages = data.Data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data.Data);//paging
                   $scope.model.viewList = data.Data.ViewModelList;
                }
            })
        },
        //获取学校
        GetClassGrades:function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetClassGrades.send([$scope.model.school]).then(function (data) {
                if(data.Ret==0){
                    var arr =[];
                    data.Data.map(function (item, i) {
                        item.ClassList.map(function (e, index) {
                            e.label = item.Name;
                            arr.push(e);
                        })
                    });
                    arr.unshift({ClassID:"0",ClassName:"所有班级",label:""});

                    $scope.model.classList = arr;
                }
            })     
        },
        //根据token prgid获取学校列表
        getSchoolList: function () {
            applicationServiceSet.parAppServiceApi.paymentTableSearch.getSchoolList.send([APPMODEL.Storage.getItem('copPage_token'), APPMODEL.Storage.getItem("orgid")]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.model.schoolList = data.Data;
                }
            });
        },
        dateChange: function (date) {
            var isEffective = date instanceof Date ? true : false;
            if (isEffective) {
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            } else {
                return date;
            }
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
                    $scope.dateStart = ctr.dateChange($scope.dateStart);
                    $scope.dateOver = ctr.dateChange($scope.dateOver);
                    applicationServiceSet.attendanceService.basicDataControlService.GetClockRosterPage.send([20,page.pIndex,$scope.model.school,$scope.dateStart,$scope.dateOver,$scope.model.clockTime,$scope.model.class,$scope.stuName]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.viewList = data.Data.ViewModelList;//transformation Data
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                /**
                 * nextPage
                 * @param pageNext
                 */
                nextPage: function (pageNext) {
                    $scope.dateStart = ctr.dateChange($scope.dateStart);
                    $scope.dateOver = ctr.dateChange($scope.dateOver);
                    applicationServiceSet.attendanceService.basicDataControlService.GetClockRosterPage.send([20,pageNext,$scope.model.school,$scope.dateStart,$scope.dateOver,$scope.model.clockTime,$scope.model.class,$scope.stuName]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.viewList = data.Data.ViewModelList;//transformation Data
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                },
                /**
                 * previousPage
                 * @param pageNext
                 */
                previousPage: function (pageNext) {
                    $scope.dateStart = ctr.dateChange($scope.dateStart);
                    $scope.dateOver = ctr.dateChange($scope.dateOver);
                    applicationServiceSet.attendanceService.basicDataControlService.GetClockRosterPage.send([20,pageNext,$scope.model.school,$scope.dateStart,$scope.dateOver,$scope.model.clockTime,$scope.model.class,$scope.stuName]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.viewList = data.Data.ViewModelList;//transformation Data
                            $scope.pageIndex.pages = data.Data.Pages;//paging pages
                            $scope.pageIndex.pageindexList(data.Data);//paging
                        }
                    });
                }
            };
        },

        basic:function () {
            $scope.model = {
                schoolList:[],
                class:"0",
                clockTime:"0"
            };
            $scope.stuName = "";

            $scope.search = function () {
                if($scope.model.school){
                    ctr.GetClockRosterPage();
                }
            };
            /*学校模糊查询*/
            $scope.deleteSchool = function () {
                $scope.model.school = undefined;
            };
            $scope.changeSchool = function () {
                if($scope.model.school){
                    applicationServiceSet.attendanceService.basicDataControlService.GetClockTimeList.send([APPMODEL.Storage.getItem("copPage_token"),$scope.model.school]).then(function (data) {
                        if(data.Ret==0){
                            $scope.model.clockTimeList = data.Data;
                        }
                    });
                    ctr.GetClassGrades();
                }
             };
            $scope.refreshAddresses = function (schoolName) {
                if (schoolName) {
                    $scope.schoolName = schoolName;
                    ctr.getSchoolList(schoolName);//get school org pages list
                }
            };
            $scope.export = function () {
                if($scope.model.school && $scope.dateOver && $scope.dateStart){
                    $scope.dateStart = ctr.dateChange($scope.dateStart);
                    $scope.dateOver = ctr.dateChange($scope.dateOver);
                    window.open(urlConfig + "OCS/v3/SafeAttend/ExportClockRoster?token=" + APPMODEL.Storage.getItem('copPage_token') + "&gid=" + $scope.model.school
                        +"&sDate=" + $scope.dateStart + "&eDate=" + $scope.dateOver +"&clockTimeID=" + $scope.model.clockTime +"&classid=" + $scope.model.class +"&name="+$scope.stuName, "_blank ")
                }
            }
        },
        date:function () {
            $scope.today = function () {
                var date = new Date();
                $scope.dateStart = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                $scope.dateOver = $scope.dateStart;
            };
            $scope.today();
            $scope.clear = function () {
                $scope.dt = null;
            };
            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };
            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.openStart = function ($event) {
                $scope.openedOver = false;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedStart = true;
            };
            $scope.openOver = function ($event) {
                $scope.openedStart = false;
                $event.preventDefault();
                $event.stopPropagation();
                $scope.openedOver = true;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                class: 'datepicker'
            };
            $scope.initDate = new Date('2016-15-20');
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[1];
        }
    };
    ctr.init()
}]);
