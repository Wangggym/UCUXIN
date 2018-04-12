/**
 * Created by Administrator on 2017/3/18.
 */
app.controller('paymentPersonNumberController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal','$filter', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal,$filter,applicationServiceSet) {
  var PersonNumber = {
      /**
       * 入口
       */
      init : function () {
          PersonNumber.pageTimeInit();
          PersonNumber.pageDataInit();
          PersonNumber.onEvent();
          PersonNumber.getProvinceList();
      },
      /**
       * 时间控件初始化
       */
      pageTimeInit : function () {
          // 服务包开通时间控件配置
          $scope.openServiceStartDate = function ($event) {
              $event.preventDefault();
              $event.stopPropagation();
              $scope.dateStateOne = true;
              $scope.dateStateTwo = false;
              $scope.dateStateThree = false;
              $scope.dateStateFour = false;
          };
          $scope.openServiceEndDate = function ($event) {
              $event.preventDefault();
              $event.stopPropagation();
              $scope.dateStateOne = false;
              $scope.dateStateTwo = true;
              $scope.dateStateThree = false;
              $scope.dateStateFour = false;
          };
          //  付款时间配置
          $scope.openPayStartDate = function ($event) {
              $event.preventDefault();
              $event.stopPropagation();
              $scope.dateStateOne = false;
              $scope.dateStateTwo = false;
              $scope.dateStateThree = true;
              $scope.dateStateFour = false;
          };
          $scope.openPayEndDate = function ($event) {
              $event.preventDefault();
              $event.stopPropagation();
              $scope.dateStateOne = false;
              $scope.dateStateTwo = false;
              $scope.dateStateThree = false;
              $scope.dateStateFour = true;
          };
          $scope.dateOptions = {
              formatYear: 'yy',
              startingDay: 1,
              class: 'datepicker'
          };
          $scope.format = 'yyyy-MM-dd';
          // 查询学校
          $scope.refreshSchool = function (name) {
              if(name && name != ''){
                  PersonNumber.getOrgSchoolPage(name);
              }
          };
          // 查询
          $scope.pageQuery =  $scope.search = function () {
              PersonNumber.getPaymentStudent();
          };
      },
      /**
       * 页面数据初始化
       */
      pageDataInit : function () {
          //初始化数据
          $scope.pageData = {
              json: 'internal/applicationFeeManagement/paymentTableSearch/paymentBySchoolStatistics/city.json',
              provinceList: [],//省list
              cityList: [],//市list
              countyList: [],//县list
              schoolList: [], //学校list
              productList: [], //产品list
              serviceList: [], //服务list
              pamentStudentList: [] //缴费人数统计list
          };
         // 查询数据model
          $scope.serchData = {
              itemList: [],
              partners: undefined,
              partnersList: [],
              province: 0,//省
              city: 0,//市
              county: 0,//县
              school: 0,//学校
              product: 0,//产品
              service: 0,//服务
              sDate: '',//服务
              eDate: '',//服务
              paySdate: '',//服务
              payEdate: ''//服务
          };
          // 分页指令配置
          $scope.pagination = {
              totalItems: undefined,
              currentPage: 1,
              itemsPerPage: 40, // 默认查询50条
              maxSize: 5,
              previousText: "上页",
              nextText: "下页",
              firstText: "首页",
              lastText: "末页"
          };
      },
      /**
       * 页面相关操作
       */
      onEvent : function () {
         //选择省
          $scope.province = function (provinceId) {
              PersonNumber.getCityList(provinceId);
              $scope.serchData.city = undefined, //市
              $scope.serchData.county = undefined //县
          };
          //删除省
          $scope.deleteProvince = function () {
              $scope.serchData.province =  undefined,//省
              $scope.serchData.city = undefined, //市
              $scope.serchData.county = undefined, //县
              $scope.pageData.cityList =  [],//市list
              $scope.pageData.countyList =  []//县list
          };
          // 选择市
          $scope.selectCity = function (cityId) {
              PersonNumber.getCountyList(cityId);
              $scope.serchData.county = undefined;//县
          };
          // 删除市
          $scope.deleteCity = function () {
              $scope.serchData.city = undefined, //市
              $scope.serchData.county = undefined, //县
              $scope.pageData.countyList =  []//县list
          };
          //选择学校
          $scope.selectSchool = function () {
              PersonNumber.getProductListByGid();
          };
          // 删除学校
          $scope.deleteSchool = function () {
              $scope.serchData.school = undefined;
              $scope.serchData.product = undefined;
              $scope.serchData.service = undefined;
          };
          // 选择产品包
          $scope.selectProduct = function () {
              PersonNumber.getServiceList();
          };
          // 删除产品包
          $scope.deleteProduct = function () {
              $scope.serchData.product = undefined;
              $scope.serchData.service = undefined;
          };
          // 导出
          $scope.import = function () {
              $scope.serchData.sDate = $filter('date')($scope.serchData.sDate, 'yyyy-MM-dd') || '';
              $scope.serchData.eDate = $filter('date')($scope.serchData.eDate, 'yyyy-MM-dd') || '';
              $scope.serchData.paySdate = $filter('date')($scope.serchData.paySdate, 'yyyy-MM-dd') || '';
              $scope.serchData.payEdate = $filter('date')($scope.serchData.payEdate, 'yyyy-MM-dd') || '';
            window.open(urlConfig + "Charge/v3/ChargeManage/ExportPaymentStatistic?token="+APPMODEL.Storage.getItem('copPage_token')+'&orgid=0'+'&ProvinceId='+
              $scope.serchData.province+'&CityId='+$scope.serchData.city+'&CountyId='+$scope.serchData.county+'&gid='+
              $scope.serchData.school+'&productId='+$scope.serchData.product+'&chargeId='+$scope.serchData.service+'&sDate='+
              $scope.serchData.sDate+'&eDate='+$scope.serchData.eDate+'&PsDate='+$scope.serchData.paySdate+'&PeDate='+$scope.serchData.payEdate);
          };
      },
      /**
       * 获取省
       */
      getProvinceList: function () {
          $http.get($scope.pageData.json).success(function (data) {
              $scope.pageData.provinceList = data;
          })
      },
      /**
       * 获取市
       */
      getCityList: function (provinceId) {
          $http.get($scope.pageData.json).success(function (data) {
              for (var i in data) {
                  if (data[i].id == provinceId) {
                      $scope.pageData.cityList = data[i].sub;
                      break;
                  }
              }
          })
      },
      /**
       * 获取县
       */
      getCountyList: function (cityId) {
          $http.get($scope.pageData.json).success(function (data) {
              for (var i in data) {
                  if (data[i].id == $scope.serchData.province) {
                      for (var s in data[i].sub) {
                          if (data[i].sub[s].id == cityId) {
                              $scope.pageData.countyList = data[i].sub[s].sub;
                              break;
                          }
                      }
                      break;
                  }
              }
          })
      },
      /**
       * 获取学校list
       */
      getOrgSchoolPage: function (keyword) {
          applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.applicationToken, keyword]).then(function (data) {
              if (data.Ret == 0) {
                  $scope.pageData.schoolList = data.Data;
              }
          });
      },
      /**
       * 获取学校所在的产品包
       */
      getProductListByGid: function () {
          if ($scope.serchData.school) {
              applicationServiceSet.chargeServiceApi.chargeService.GetProductListByGid.send([APPMODEL.Storage.getItem('copPage_token'), $scope.serchData.school]).then(function (data) {
                  if (data.Ret == 0) {
                      $scope.pageData.productList = data.Data;
                  }
              });
          }
      },
      /**
       * 获取产品包含的服务list
       */
      getServiceList: function () {
          applicationServiceSet.chargeServiceApi.chargeService.GetChargeListByProductId.send([APPMODEL.Storage.getItem('copPage_token'),$scope.serchData.product]).then(function (data) {
              if (data.Ret == 0) {
                  $scope.pageData.serviceList = data.Data;
              }
          });
      },
      /**
       * 查询已缴费人数
       */
      getPaymentStudent: function () {
          $scope.serchData.sDate = $filter('date')($scope.serchData.sDate, 'yyyy-MM-dd') || '';
          $scope.serchData.eDate = $filter('date')($scope.serchData.eDate, 'yyyy-MM-dd') || '';
          $scope.serchData.paySdate = $filter('date')($scope.serchData.paySdate, 'yyyy-MM-dd') || '';
          $scope.serchData.payEdate = $filter('date')($scope.serchData.payEdate, 'yyyy-MM-dd') || '';
          applicationServiceSet.chargeServiceApi.chargeService.GetPaymentStatisticPage.send([$scope.pagination.itemsPerPage,$scope.pagination.currentPage,0,
              $scope.serchData.province,$scope.serchData.city,$scope.serchData.county,$scope.serchData.school,$scope.serchData.product,$scope.serchData.service,
              $scope.serchData.sDate, $scope.serchData.eDate,$scope.serchData.paySdate,$scope.serchData.payEdate
          ]).then(function (data) {
              if (data.Ret == 0) {
                  $scope.pagination.totalItems =  data.Data.TotalRecords;
                  $scope.pageData.pamentStudentList = data.Data.ViewModelList;
              }
          });
      }

  };
    PersonNumber.init();
}]);