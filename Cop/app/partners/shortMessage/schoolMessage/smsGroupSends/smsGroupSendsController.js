/**
 * Created by Wang QiHan on 2016/12/7.
 */
app.controller('SmsGroupSendsController', ['$scope','$filter','$location', '$modal', 'toastr', 'toastrConfig', 'applicationServiceSet', function ($scope,$filter,$location, $modal, toastr, toastrConfig, applicationServiceSet) {
  'use strict';

  toastrConfig.preventOpenDuplicates = true;
    // --- 时间配置 开始--------------------------------------------------
    /*var currentDay = $filter('date')(new Date(), 'yyyy-MM-dd');
     $scope.sDate = currentDay;
     $scope.eDate = currentDay;*/

    $scope.clear = function () {
        $scope.sDate = null;
        $scope.eDate = null;
    };

    $scope.minDate = $scope.minDate ? null : new Date();

    $scope.openStartDate = function ($event) {
        $scope.endOpened = false;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.openedStart = true;
    };

    $scope.openEndDate = function ($event) {
        $scope.openedStart = false;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.endOpened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1,
        class: 'datepicker'
    };
    $scope.format = 'yyyy-MM-dd';
    //---- 时间配置 结束 -------------------------------------------------------
  $scope.queryFields = {
    keywords: undefined
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

    /**
     *导出数据
     */
    $scope.export = function () {
        var keywords = $scope.queryFields.keywords || '';
        var sDate = $scope.sDate?$filter('date')($scope.sDate, 'yyyy-MM-dd'):'';
        var eDate = $scope.sDate?$filter('date')($scope.eDate, 'yyyy-MM-dd'):'';
        // alert(urlConfig+'public/v3/SmsWeb/ExportSmsSendList?token='+APPMODEL.Storage.copPage_token+'&bID='+APPMODEL.Storage.orgid+'&rvName='+keywords+'&sDate='+sDate+'&eDate='+eDate)
        window.open(urlConfig+'public/v3/SmsWeb/ExportSmsSendList?token='+APPMODEL.Storage.copPage_token+'&bID='+APPMODEL.Storage.orgid+'&rvName='+keywords+'&sDate='+sDate+'&eDate='+eDate);
    };

  var smsGroupSends = (function () {
    var token = APPMODEL.Storage.copPage_token,
      orgid = APPMODEL.Storage.orgid,
      applicationToken = APPMODEL.Storage.applicationToken;

    var getService = function (method, arr, list, fn) {
      if (Object.prototype.toString.call(list) === '[object Function]') {
        fn = list;
        list = undefined;
      }
      applicationServiceSet.parAppServiceApi.message[method].send(arr, list).then(fn);
    }

    var getSmsList = function () {

      var keywords = $scope.queryFields.keywords || '';
      var sDate = $scope.sDate?$filter('date')($scope.sDate, 'yyyy-MM-dd'):null;
      var eDate = $scope.sDate?$filter('date')($scope.eDate, 'yyyy-MM-dd'):null;

      getService('getSmsMassSendList', [APPMODEL.Storage.copPage_token, orgid, keywords, $scope.pagination.currentPage, $scope.pagination.itemsPerPage,sDate,eDate], function (data) {
        if (data.Ret === 0) {
          if (data.Data) {
            $scope.dataList = data.Data.ViewModelList;
            // 分页配置项更新
            $scope.pagination.totalItems = data.Data.TotalRecords;
            $scope.pagination.numPages = data.Data.Pages;
          } else {
            $scope.dataList = $scope.pagination.totalItems = $scope.pagination.numPages = undefined;
          }
        }
      });
    }

    var saveSmsMass = function (sData) {
      getService('saveSmsMass', sData, function (data) {
        if (data.Ret === 0) {
          toastr.success('新加短信成功！');
          getSmsList();
        }
      });
    }


    return {
      getSmsList: getSmsList,
      saveSmsMass: saveSmsMass
    }
  })();

  smsGroupSends.getSmsList();


  // 提交查询与分页查询
  $scope.submitQuery = $scope.pageQuery = function (event) {
    if (event) {
      // 当点击查询时重置当页为首页
      var event = event || window.event;
      var target = event.target || window.srcElement;
      if (target.tagName.toLocaleLowerCase() == "button") {
        $scope.pagination.currentPage = 1;
      }
    }
    smsGroupSends.getSmsList();
  };

  // 新增
  $scope.add = function () {

    var modalInstance = $modal.open({
      templateUrl: 'AddSmsGroupSend.html',
      controller: 'AddSmsGroupSendCtrl',
      backdrop: false,
      resolve: {
        items: function () {
          return ''
        }
      }
    });

    modalInstance.result.then(function (data) {
      smsGroupSends.saveSmsMass(data);
    }, function () {

    });
  };

  $scope.detail = function (item) {
    var modalInstance = $modal.open({
      templateUrl: 'DetailSmsGroupSend.html',
      controller: 'DetailSmsGroupSendCtrl',
      backdrop: false,
      resolve: {
        items: function () {
          return item.SendID
        }
      }
    });

    modalInstance.result.then(function (data) {

    }, function () {

    });
  }

}]);

app.controller('AddSmsGroupSendCtrl', ['$scope', '$modalInstance', 'items', '$modal', 'applicationServiceSet', 'toastr', 'toastrConfig', function ($scope, $modalInstance, items, $modal, applicationServiceSet, toastr, toastrConfig) {
  'use strict';

  toastrConfig.preventOpenDuplicates = true;
  $scope.pushData = {
    bID: APPMODEL.Storage.orgid,
    RvName: undefined,
    SmsCont: undefined,
    rvItems: []
  }
  $scope.submitModelData = {
    stage: {name: '学前', id: 30010},
    year: {name: '2011级', id: 2011},
    MType: {name: '教师', id: 11},
    Status: {name: '已激活', id: 1},
    school: undefined
  }

  $scope.limitConfig = {
    stage: [
      {name: '学前', id: 30010},
      {name: '小学', id: 30020},
      {name: '初中', id: 30030},
      {name: '高中', id: 30040},
      {name: '职校', id: 30050},
      {name: '大学', id: 30060}
    ],
    years: [
      {name: '2011级', id: 2011},
      {name: '2012级', id: 2012},
      {name: '2013级', id: 2013},
      {name: '2014级', id: 2014},
      {name: '2015级', id: 2015},
      {name: '2016级', id: 2016},
      {name: '2017级', id: 2017},
      {name: '2018级', id: 2018},
      {name: '2019级', id: 2019},
      {name: '2020级', id: 2020}
    ]
  }

  var smsGroupSends = (function () {
    var applicationToken = APPMODEL.Storage.applicationToken,
      token = APPMODEL.Storage.copPage_token,
      orgid = APPMODEL.Storage.orgid;

    var getService = function (method, arr, list, fn) {
      if (Object.prototype.toString.call(list) === '[object Function]') {
        fn = list;
        list = undefined;
      }
      applicationServiceSet.parAppServiceApi.message[method].send(arr, list).then(fn);
    }

    // 获取当前用户学校 （ 模糊查询 ）
    var getSchool = function () {
      getService('getSchoolList', [token, orgid], function (data) {
        if (data.Ret == 0) {
          $scope.schoolList = data.Data.length ? data.Data : undefined;
        }
      });
    };

    var getSmsMassSend = function (isContainRv, sendID) {
      getService('getSmsMassSend', [token, isContainRv, sendID], function (data) {
        if (data.Ret == 0) {
          $scope.singleDate = data.Data;
        }
      });
    }

    return {
      getSchool: getSchool,
      getSmsMassSend: getSmsMassSend
    }
  })();

  // 查询学校
  smsGroupSends.getSchool();

  $scope.$watch('pushData.SmsCont', function (nv, ov) {
    if (nv === ov) return;
    $scope.record = function () {
      var smsLangth = $scope.pushData.SmsCont.length;
      if (!smsLangth) return 0;
      if (smsLangth + 6 <= 70) return 1;
      return Math.ceil((smsLangth + 6) / 67);
    }();
  });

  var combination = function (ov, nv, st) {
    $scope.pushData.RvName = !$scope.pushData.RvName ? [] : $scope.pushData.RvName.split('_');

    if ($scope.pushData.RvName.indexOf(ov) > -1) {
      $scope.pushData.RvName.splice($scope.pushData.RvName.indexOf(ov), 1);
    }
    if (st) {
      $scope.pushData.RvName.push(nv);
    }

    $scope.pushData.RvName = $scope.pushData.RvName.join('_');
  }

  $scope.changeSchool = function (item, st) {
    st = (st === undefined) ? true : st;
    combination($scope.oldSchool, item.FName, st);
    $scope.oldSchool = item.FName;
  }

  $scope.changeStage = function (item, st) {
    st = (st === undefined) ? true : st;
    combination($scope.oldStage, item.name, st);
    $scope.oldStage = item.name;
  }

  $scope.changeYear = function (item, st) {
    st = (st === undefined) ? true : st;
    combination($scope.oldYear, item.name, st);
    $scope.oldYear = item.name;
  }

  $scope.changeMType = function (item, st) {
    st = (st === undefined) ? true : st;
    $scope.submitModelData.MType = item;
    combination($scope.oldMType, item.name, st);
    $scope.oldMType = item.name;
  }

  $scope.changeStatus = function (item, st) {
    st = (st === undefined) ? true : st;
    $scope.submitModelData.Status = item;
    combination($scope.oldStatus, item.name, st);
    $scope.oldStatus = item.name;
  }

  $scope.changeLimit = function (st, stage, year) {
    $scope.changeStage(stage, st);
    $scope.changeYear(year, st);
  };

  $scope.changeIdentity = function (st, MType) {
    $scope.changeMType(MType, st);
  }

  $scope.changeParentStatus = function (st, status) {
    $scope.changeStatus(status, st);
  }

  $scope.comfirm = function () {
    $scope.pushData.rvItems = [];

    if (!$scope.pushData.RvName) {
      toastr.error('请填写接收对象！');
      return;
    }

    if (!$scope.pushData.SmsCont) {
      toastr.error('请填写短信内容！');
      return;
    }

    if (!$scope.submitModelData.school) {
      toastr.error('请选择接收的学校！');
      return;
    }

    if ($scope.submitModelData.school) {
      $scope.pushData.rvItems.push({
        AttrType: 5,
        AttrValue: $scope.submitModelData.school.ID,
        AttrValueName: $scope.submitModelData.school.FName
      });
    }

    if ($scope.limit) {
      $scope.pushData.rvItems.push({
        AttrType: 8,
        AttrValue: '' + $scope.submitModelData.stage.id + $scope.submitModelData.year.id,
        AttrValueName: $scope.submitModelData.stage.name + $scope.submitModelData.year.name
      });

    }

    if ($scope.identity) {
      $scope.pushData.rvItems.push({
        AttrType: 7,
        AttrValue: $scope.submitModelData.MType.id,
        AttrValueName: $scope.submitModelData.MType.name
      });
    }

    if ($scope.status) {
      $scope.pushData.rvItems.push({
        AttrType: 9,
        AttrValue: $scope.submitModelData.Status.id,
        AttrValueName: $scope.submitModelData.Status.name
      });
    }


    var modalInstance = $modal.open({
      templateUrl: 'ConfirmSmsGroupSend.html',
      controller: 'ConfirmSmsGroupSendCtrl',
      backdrop: false,
      size: 'sm',
      resolve: {}
    });

    modalInstance.result.then(function () {
      $modalInstance.close($scope.pushData);
    }, function () {

    });

  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

}]);

app.controller('DetailSmsGroupSendCtrl', ['$scope', '$modalInstance', 'items', 'applicationServiceSet', '$filter', function ($scope, $modalInstance, items, applicationServiceSet, $filter) {
  'use strict';

  var smsGroupSends = (function () {
    var applicationToken = APPMODEL.Storage.applicationToken;

    var getService = function (method, arr, list, fn) {
      if (Object.prototype.toString.call(list) === '[object Function]') {
        fn = list;
        list = undefined;
      }
      applicationServiceSet.parAppServiceApi.message[method].send(arr, list).then(fn);
    }

    var getSmsMassSend = function (isContainRv, sendID) {
      getService('getSmsMassSend', [ APPMODEL.Storage.copPage_token, isContainRv, sendID], function (data) {
        if (data.Ret == 0) {
          $scope.singleDate = data.Data;

          $scope.smsSchool = $filter('propsFilter')(data.Data.rvItems, {AttrType: 5});
          $scope.smsLimit = $filter('propsFilter')(data.Data.rvItems, {AttrType: 8});
          $scope.smsIdentity = $filter('propsFilter')(data.Data.rvItems, {AttrType: 7});
          $scope.smsStatus = $filter('propsFilter')(data.Data.rvItems, {AttrType: 9});
        }
      });
    }
    return {
      getSmsMassSend: getSmsMassSend
    }
  })();

  if (items) {
    smsGroupSends.getSmsMassSend(true, items);
  }
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);

app.controller('ConfirmSmsGroupSendCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';
  $scope.confirmSms = function () {
    $modalInstance.close();
  }
  $scope.cancelSms = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
