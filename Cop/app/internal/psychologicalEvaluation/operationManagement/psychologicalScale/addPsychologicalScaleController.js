/**
 * Created by WangQiHan on 2016/9/13.
 * Add Psychological Scale Controller
 */
app.controller('AddPsychologicalScaleController', ['$scope', '$location','$rootScope','$stateParams', '$filter', '$modal', 'editableOptions', 'editableThemes', 'toastr', 'toastrConfig', 'Upload', 'applicationServiceSet', function ($scope, $location, $rootScope, $stateParams, $filter, $modal, editableOptions, editableThemes, toastr, toastrConfig, Upload, applicationServiceSet) {
  'use strict';

  /** === 基本交互配置 开始 ====================================================================== **/

  // toastr 配置
  toastrConfig.preventOpenDuplicates = true;
  // angular xeditable configure
  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';

  /** === 数据服务集合 开始 ====================================================================== **/
  var addPsychologicalScale = (function () {
    // 取出当前token 与 orgid值
    var token = APPMODEL.Storage.copPage_token,
      orgid = APPMODEL.Storage.orgid,
      applicationToken = APPMODEL.Storage.applicationToken;

    var getService = function (method, arr, list, fn) {
      if(Object.prototype.toString.call(list) === '[object Function]'){
        fn = list;
        list = undefined;
      }
      applicationServiceSet.internalServiceApi.psychologicalEvaluation[method].send(arr, list).then(fn);
    };

/*    // 用户类型转换
    var userAttrType = function (value, type) {
      switch (parseInt(value)){np
        case 11:
          return type == "text"? "教师" : "teacher" ;
          break;
        case 12:
          return type == "text"? "家长" : "parent" ;
          break;
        case 13:
          return type == "text"? "学生" : "student" ;
          break;
      }
    };*/
    // 获取用户全部属性
    var getPhyProperties = function () {
      getService('getPhyProperties', [token, scale.id], function (data) {
        if (data.Ret === 0) {
          $scope.userAttrList = data.Data || undefined;
          /*angular.forEach(data.Data, function (item) {
            for(var i in $scope.userAttrList){
              if($scope.userAttrList[i].name == userAttrType(item.MType, 'name')){
                $scope.userAttrList[i].attrs.push({
                  id: item.ID,
                  name: item.Name,
                  SeqNo: item.SeqNo,
                  Remark: item.Remark
                });
                return;
              }
            }
            $scope.userAttrList.push({
              name: userAttrType(item.MType, 'name'),
              text: userAttrType(item.MType, 'text'),
              attrs: [{id: item.ID, name: item.Name, SeqNo: item.SeqNo, Remark: item.Remark}]
            });
          });*/
        }
      });
    };

    var getPhyQuestions = function () {
      getService('getPhyQuestions', [token, scale.id], function (data) {
        if(data.Ret === 0){
          scale.questionsBank = $scope.questionList = data.Data;
        }
      });
    };

    var getPhySingleScale = function () {
      getService('getPhySingleScale', [token, scale.id], function (data) {
        if(data.Ret === 0){
          scale.basicInfo.id = data.Data.ID;
          scale.basicInfo.scaleName = data.Data.Name;
          scale.basicInfo.scaleSource = data.Data.Origion;
          scale.basicInfo.scaleIntroduce = data.Data.Instro;
          scale.basicInfo.testNotice = data.Data.Notice;
          scale.basicInfo.MType = data.Data.MType;
          scale.basicInfo.scalePicUrl = data.Data.ImgUrl;
          scale.basicInfo.remark = data.Data.Remark;
          scale.basicInfo.CDate = data.Data.CDate;
          scale.basicInfo.ST = data.Data.ST;
          scale.basicInfo.Url = data.Data.Url;
          scale.basicInfo.IsProduct = data.Data.IsProduct;

          // Save a Copy
          $scope.copyData.basicInfo = angular.copy(scale.basicInfo);

        }
      });
    };

    // 提交量表基本信息
    var saveScaleDefine = function (arr, fn) {
      getService('saveScaleDefine', arr, function (data) {
        if (data.Ret == 0) {
          //alert('提交成功');
          scale.id = data.Data.ID;
          //
          APPMODEL.Storage.ScaleID = scale.id = scale.basicInfo.id =  data.Data.ID;
          // 获取用户属性列表
          getPhyProperties();
          toastr.success('基本信息保存成功!');
          fn();
        }
      });
    };

    // 提交量表属性（题目集合、量表因子描述集合、量表因子异常判断集合、量表属性）
    var saveScaleProperties = function (obj, fn) {
      getService('saveScaleProperties', obj, function (data) {
        if(data.Ret === 0){
          toastr.success('用户属性保存成功！');
          fn();
        }
      });
    };

    // 保存新增题库
    var saveScaleQuestions =  function (obj, fn) {
      getService('saveScaleQuestions', obj, function (data) {
        if(data.Ret === 0){
          getPhyQuestions();
          toastr.success('题库保存成功！');
          fn();
        }
      });
    };

    // 修改当前题
    var updateScaleSingleQuestion =  function (obj) {
      getService('updateScaleSingleQuestion', obj, function (data) {
        if(data.Ret === 0){
          toastr.success('修改成功！');
        }
      });
    };

    // 删除当前题
    var removeScaleQuestion =  function (questionID) {
      getService('removeScaleQuestion',undefined, [questionID], function (data) {
        if(data.Ret === 0){
          toastr.success('删除成功！');
        }
      });
    };

    // 获取当前因子定义列表
    var getPhyFactorDefinition =  function () {
      getService('getPhyFactorDefinition', [token, scale.id], function (data) {
        if(data.Ret === 0){
          scale.factorDefinition = $scope.factorDefinitionList = data.Data;
          scale.factorDataList = angular.copy(data.Data);
          // scale.factorDataList.unshift({ID:'0',Name:'总分'});
        }
      });
    };

    // 提交因子定义
    var saveScaleFactorDefinition = function (obj) {
      getService('saveScaleFactorDefinition', obj, function (data) {
        if(data.Ret === 0){
          getPhyFactorDefinition();
          toastr.success('因子定义保存成功！');
        }
      });
    };
    // 删除因子定义
    var removeScaleFactorDefinition = function (id) {
      getService('removeScaleFactorDefinition', undefined, [id], function (data) {
        if(data.Ret === 0){
          getPhyFactorDefinition();
          toastr.success('因子定义删除成功！');
        }
      });
    }

    // 获取因子异常判定
    var getScaleFactorAnomaly = function () {
      getService('getPhyFactorAnomaly', [token, scale.id], function (data) {
        if(data.Ret === 0){
          $scope.anomalyList = data.Data || undefined;
        }
      });
    };

    // 提交因子异常判定
    var saveScaleFactorAnomaly = function (obj, fn) {
      getService('saveScaleFactorAnomaly', obj, function (data) {
        if(data.Ret === 0){
          getScaleFactorAnomaly();
          toastr.success('因子异常保存成功！');
          fn();
        }
      });
    };

    // 修改因子异常
    var updateScaleFactorAnomaly = function (obj) {
      getService('updateScaleFactorAnomaly', obj, function (data) {
        if(data.Ret === 0){
          getScaleFactorAnomaly();
          toastr.success('因子异常修改成功！');
        }
      });
    };

    // 删除因子异常
    var delScaleFactorAnomaly =  function (id) {
      getService('delScaleFactorAnomaly',undefined, [id], function (data) {
        if(data.Ret === 0){
          getScaleFactorAnomaly();
          toastr.success('因子异常删除成功！');
        }
      });
    };

    // 获取失效规则
    var getScaleInvalid = function () {
      getService('getScaleInvalid', [token, scale.id], function (data) {
        if(data.Ret === 0){
          $scope.failureRuleList = data.Data || undefined;
        }
      });
    };

    // 提交失效规则
    var saveScaleInvalid = function (obj, fn) {
      getService('saveScaleInvalid', obj, function (data) {
        if(data.Ret === 0){
          getScaleInvalid();
          toastr.success('测慌规则保存成功！');
          fn();
        }
      });
    };

    // 修改失效规则
    var updateScaleInvalid = function (obj) {
      getService('updateScaleInvalid', obj, function (data) {
        if(data.Ret === 0){
          getScaleInvalid();
          toastr.success('失效规则修改成功！');
        }
      });
    };


    // 删除因子异常
    var delScaleInvalid =  function (id) {
      getService('delScaleInvalid',undefined, [id], function (data) {
        if(data.Ret === 0){
          getScaleFactorAnomaly();
          toastr.success('测慌规则删除成功！');
        }
      });
    };

    // 获取因子解释列表
    var getScaleFactorExplain = function () {
      getService('getScaleFactorExplain', [token,scale.id, 1, 1000], function (data) {
        if(data.Ret === 0){
          if(data.Data){
            scale.factorExplain = $scope.interpretationList = [];
            angular.forEach(data.Data.ViewModelList, function (item) {
              scale.factorExplain = $scope.interpretationList.push(item);
            });
          }else{
            scale.factorExplain = $scope.interpretationList = undefined;
          }
        }
      });
    };

    // 添加因子解释
    var saveScaleFactorExplain = function (obj) {
      getService('saveScaleFactorExplain', obj, function (data) {
        if(data.Ret === 0){
          getScaleFactorExplain();
          toastr.success('因子解释保存成功！');
        }
      });
    };

    // 修改选中因子解释
    var updateScaleFactorExplain =  function (obj) {
      getService('updateScaleFactorExplain', obj, function (data) {
        if(data.Ret === 0){
          //getScaleFactorExplain();
          toastr.success('因子解释修改成功！');
        }
      });
    };

    // 删除选中因子解释
    var removeScaleFactorExplain = function (id) {
      getService('removeScaleFactorExplain',undefined, [id], function (data) {
        if(data.Ret === 0){
          getScaleFactorExplain();
          toastr.success('因子解释删除成功！');
        }
      });
    };

    // 检测量表维护完整性
    var checkScalePerfect =  function (id, fn) {
      getService('checkScalePerfect',undefined, [id], function (data) {
        if(data.Ret === 0){
          fn();
        }
      });
    };

    // 量表静态化
    var psychologicalScaleStatic =  function (id) {
      checkScalePerfect(id, getService('psychologicalScaleStatic',undefined, [id], function (data) {
        if(data.Ret === 0){
          getScaleFactorExplain();
          toastr.success('量表静态化成功！');
          $location.path('access/app/internal/operationManagement/psychologicalScale');
        }
      }));
    };

    return {
      getPhySingleScale            : getPhySingleScale,
      getPhyProperties             : getPhyProperties,
      getPhyQuestions              : getPhyQuestions,
      getPhyFactorDefinition       : getPhyFactorDefinition,
      getScaleFactorAnomaly        : getScaleFactorAnomaly,
      getScaleFactorExplain        : getScaleFactorExplain,

      saveScaleDefine              : saveScaleDefine,
      saveScaleProperties          : saveScaleProperties,
      saveScaleQuestions           : saveScaleQuestions,
      updateScaleSingleQuestion    : updateScaleSingleQuestion,
      removeScaleQuestion          : removeScaleQuestion,

      saveScaleFactorDefinition    : saveScaleFactorDefinition,
      removeScaleFactorDefinition  : removeScaleFactorDefinition,

      saveScaleFactorAnomaly       : saveScaleFactorAnomaly,
      updateScaleFactorAnomaly     : updateScaleFactorAnomaly,
      delScaleFactorAnomaly        : delScaleFactorAnomaly,

      getScaleInvalid              : getScaleInvalid,
      saveScaleInvalid             : saveScaleInvalid,
      updateScaleInvalid           : updateScaleInvalid,
      delScaleInvalid              : delScaleInvalid,

      saveScaleFactorExplain       : saveScaleFactorExplain,
      updateScaleFactorExplain     : updateScaleFactorExplain,
      removeScaleFactorExplain     : removeScaleFactorExplain,

      psychologicalScaleStatic     : psychologicalScaleStatic
    }
  })();
  /** === 数据服务集合 结束 ====================================================================== **/

  // 量表添加提交数据
  var scale = $scope.scale ={
    id: APPMODEL.Storage.ScaleID,       // 量表ID
    basicInfo: {
      id: 0,
      scaleName: undefined,
      scaleSource: undefined,
      scaleIntroduce: undefined,
      testNotice: undefined,
      scalePicUrl: undefined,
      remark: undefined,
      MType: 13,
      CDate: undefined,
      ST: undefined,
      Url: undefined,
      IsProduct: undefined,
    },
    userAttribute: {
      userAttributeList: []
    },
    questionsBank: undefined,
    factorDefinition: undefined,
    factorExplain: undefined,
    factorDataList: undefined
  };
  // 存放初始数据
  $scope.copyData = {};

  $scope.userAttrList = undefined;

  // 进度显示
  $scope.steps = {percent: 15, index: APPMODEL.Storage.ScaleStep || 1};

   // 路由配置 -- 监听路由进入状态
   $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
     // 当路由跳转其它路由时移除量表相关信息
     if(toState.name.split('.').indexOf('addPsychologicalScale') == -1){
       APPMODEL.Storage.removeItem('ScaleStep');
       APPMODEL.Storage.removeItem('ScaleID');
       return;
     }
    // 当前量表不存在时则跳加新增量表
     if(!parseInt(APPMODEL.Storage.ScaleID)){
       $location.path('access/app/internal/operationManagement/addPsychologicalScale/basicInfo');
       APPMODEL.Storage.ScaleStep = $scope.steps.index = 1;
     }else {
       switch (toState.url){
         case '/basicInfo':             APPMODEL.Storage.ScaleStep = $scope.steps.index = 1; break;
         case '/userAttribute':         APPMODEL.Storage.ScaleStep = $scope.steps.index = 2; break;
         case '/questionBank':          APPMODEL.Storage.ScaleStep = $scope.steps.index = 3; break;
         case '/factorDefinition':      APPMODEL.Storage.ScaleStep = $scope.steps.index = 4; break;
         case '/anomalyJudgment':       APPMODEL.Storage.ScaleStep = $scope.steps.index = 5; break;
         case '/factorInterpretation':  APPMODEL.Storage.ScaleStep = $scope.steps.index = 6; break;
       }
       $scope.steps.percent = APPMODEL.Storage.ScaleStep *15;
     }
   });


  var stepRouter = function (index) {
    var step = function (router) {
      $location.path('access/app/internal/operationManagement/addPsychologicalScale/'+ router);
      $scope.steps.percent = 15 * $scope.steps.index;
    };
    switch (parseInt(index)){
      case 1:   step('basicInfo');            break;
      case 2:   step('userAttribute');        break;
      case 3:   step('questionBank');         break;
      case 4:   step('factorDefinition');     break;
      case 5:   step('anomalyJudgment');      break;
      case 6:   step('factorInterpretation'); break;
      default:  step('basicInfo');            break;
    }
  }


  var next = function () {
    $scope.steps.index++;
    $scope.steps.percent = 15 * $scope.steps.index;
    APPMODEL.Storage.ScaleStep = $scope.steps.index;

    stepRouter($scope.steps.index);
  }
  $scope.prev = function () {
    $scope.steps.index--;
    $scope.steps.percent = 15 * $scope.steps.index;
    APPMODEL.Storage.ScaleStep = $scope.steps.index;

    stepRouter($scope.steps.index);
  }


  /** === 基本交互配置 结束 ====================================================================== **/



  /** === 数据交互 开始 ====================================================================== **/


  // 用户属性列表

/*  $scope.$watch('userAttrList', function () {
    scale.userAttribute.userAttributeList = [];
    angular.forEach($scope.userAttrList, function (user) {
      var x = {};
      angular.forEach(user.attrs, function (attr) {
        if (attr.checked) {
          if (!Array.isArray(x[user.name])) {
            x[user.name] = [];
          }
          x[user.name].push(attr.id);
        }
      });
      if (x[user.name]) {
        x[user.name] = x[user.name].join(',');
        scale.userAttribute.userAttributeList.push(x);
      }
    });
  }, true);*/

  $scope.$watch('userAttrList', function () {
     scale.userAttribute.userAttributeList = [];
     angular.forEach($scope.userAttrList, function (attr) {
       if (attr.IsCheck) {
         angular.extend(attr, {ScaID: scale.id, PropID:attr.ID});
         scale.userAttribute.userAttributeList.push(angular.extend(angular.copy(attr),{ID:0}));
       }
     });
   }, true);

  // 如果量表ID不为0则修改
  if(parseInt(scale.id)){
    addPsychologicalScale.getPhySingleScale();
    addPsychologicalScale.getPhyProperties();
    addPsychologicalScale.getPhyQuestions();
    addPsychologicalScale.getPhyFactorDefinition();
    addPsychologicalScale.getScaleFactorAnomaly();
    addPsychologicalScale.getScaleInvalid();
    addPsychologicalScale.getScaleFactorExplain();
  }
  if(parseInt(APPMODEL.Storage.ScaleStep)){
    $scope.steps.percent = APPMODEL.Storage.ScaleStep *15;
  }

  // 基本信息图片上传
  $scope.fileChange = function (file) {
    if (!file) return;
    applicationServiceSet.parAppServiceApi.applicationFeeOpen.imageFileUpload.fileUpload(file).then(function (data) {
      if (data.Ret == 0) {
        scale.basicInfo.scalePicUrl = data.Data.Url;
      } else {
        toastr.error("图片上传失败");
      }
    });
  };

  // 量表基本信息提交
  $scope.submitInfo = function (event) {

    if (!scale.basicInfo.scaleName) {
      toastr.error('请填写量表名称！');
      event.preventDefault();
      return;
    }
    if (!scale.basicInfo.scaleSource) {
      toastr.error('请填写量表来源！');
      event.preventDefault();
      return;
    }
    if (!scale.basicInfo.scaleIntroduce) {
      toastr.error('请填写量表介绍！');
      event.preventDefault();
      return;
    }
    if (!scale.basicInfo.testNotice) {
      toastr.error('请填写测试须知！');
      event.preventDefault();
      return;
    }

    var isUpdate = true;

    if(scale.basicInfo.id){
      for(var i in $scope.copyData.basicInfo){
        //for(var n in scale.basicInfo){
          if($scope.copyData.basicInfo[i] !== scale.basicInfo[i]){
            scale.basicInfo.ST = false;
            scale.basicInfo.IsProduct = false;

            isUpdate = true;
            break;
          }

          isUpdate = false;
        //}
      }
    }

    if(isUpdate){
      scale.basicInfo.Url = scale.basicInfo.Url || null;
      scale.basicInfo.scalePicUrl = scale.basicInfo.scalePicUrl || null;
      scale.basicInfo.CDate = scale.basicInfo.CDate || null;

      // 下一步进度控制
      addPsychologicalScale.saveScaleDefine([scale.id,scale.basicInfo.scaleName, scale.basicInfo.scaleSource, scale.basicInfo.scaleIntroduce, scale.basicInfo.testNotice, scale.basicInfo.scalePicUrl, scale.basicInfo.MType,scale.basicInfo.remark,scale.basicInfo.CDate, scale.basicInfo.ST, scale.basicInfo.Url, scale.basicInfo.IsProduct], next);
    }else {
      next();
    }
  };

  // 量表用户属性提交
  $scope.submitUserAttr = function () {

    // 判断是否有选中属性，若没有则表示没有属性添加
    var selectedUserAttr = scale.userAttribute.userAttributeList.length ? scale.userAttribute.userAttributeList : [{ID:0, IsCheck:false, MType:15, Name:"", PropID:"0", Remark:"", ScaID:scale.id, SeqNo:0}];
    addPsychologicalScale.saveScaleProperties({ScaleProperties:selectedUserAttr}, next);

    /*if(scale.userAttribute.userAttributeList.length){
      addPsychologicalScale.saveScaleProperties({ScaleProperties:scale.userAttribute.userAttributeList}, next);
    }else{
      next();
    }*/

  };

  // 量表题库
  $scope.submitQuestionsBank = function () {
    if (!scale.questionsBank.length) {
      toastr.error('请先添加测试题库！');
      return;
    }

    // 提交新增加的数据
    var newQuestion = [];
    angular.forEach(scale.questionsBank, function (item) {
      if(!item.ID){
        newQuestion.push(item);
      }
    });

    // 判断当前提交数据是否新增, 新增则保存,否则直接下一步
    if(!newQuestion.length){
      next();
    }else{
      addPsychologicalScale.saveScaleQuestions({Questiones:newQuestion}, next);
    }

  };

  // 量表因子
  $scope.submitFactorDefine = function () {
    if(!$scope.factorDefinitionList.length){
      toastr.error('请添加因子定义！');
      return;
    }
    next();
  };

  // 因子异常批量添加
  $scope.submitFactorAnomaly = function () {
    // 新增加数据
    var factorAnomalyData = [];
    if($scope.anomalyList.length) {
      angular.forEach($scope.anomalyList, function (item) {
        if (!item.ID) {
          factorAnomalyData.push(item);
        }
      });
    }

    var failureRuleData = [];
    if($scope.failureRuleList.length){
      angular.forEach($scope.failureRuleList, function(item){
        if(!item.ID){
          failureRuleData.push(item);
        }
      });
    }

    // 判断当前提交数据是否新增, 新增则保存,否则直接下一步
    if(factorAnomalyData.length && failureRuleData.length){
      addPsychologicalScale.saveScaleFactorAnomaly({FactorExces:factorAnomalyData});
      addPsychologicalScale.saveScaleInvalid({ScaleInvalids:failureRuleData}, next);
      return;
    }

    if(!factorAnomalyData.length && failureRuleData.length){
      addPsychologicalScale.saveScaleInvalid({ScaleInvalids:failureRuleData}, next);
      return;
    }

    if(factorAnomalyData.length && !failureRuleData.length){
      addPsychologicalScale.saveScaleFactorAnomaly({FactorExces:factorAnomalyData}, next);
      return;
    }

    next();

  };

  // 因子解释列表
  $scope.submitFactorExplain = function () {

    if(!$scope.interpretationList.length){
      toastr.error('请先添加因子解释！');
      return;
    }

    var factorExplainData = [];
    angular.forEach($scope.interpretationList, function (item) {
      if(!item.ID){
        factorExplainData.push(item);
      }
    });

    if(factorExplainData.length){
      addPsychologicalScale.saveScaleFactorExplain({FactorDescs: factorExplainData});
    }else{
      toastr.success('量添加成功！')
    }
    $scope.steps.percent = 100;
  }

  // 生成量表数据
  $scope.scaleStatic = function () {
    //addPsychologicalScale.checkScalePerfect(scale.id)
    addPsychologicalScale.psychologicalScaleStatic(scale.id);
  };

  /** === 数据交互 结束 ====================================================================== **/

  /** === 题库 开始 ====================================================================== **/


    scale.questionsBank = $scope.questionList = [];
  // 查看详细
  $scope.open = function (index) {
    if ($scope.isOpen == index) {
      $scope.isOpen = undefined;
    } else {
      $scope.isOpen = index
    }
  };

  // 删除问题
  $scope.delQuestion = function (question) {
    var modalInstance = $modal.open({
      templateUrl: 'removeConfirm.html',
      size: 'sm',
      controller:'RemoveConfirmCtrl',
      resolve: {
        items: function () {
          return {
            data: question,
            name: '测试题'
          }
        }
      }
    });

    modalInstance.result.then(function (res) {
      $scope.questionList.splice($scope.questionList.indexOf(res), 1);

      // 删除当前题
      if(parseInt(res.ID)){
        addPsychologicalScale.removeScaleQuestion(res.ID);
      }else{
        toastr.success('删除成功！');
      }
    }, function () {
      // 取消时作出操作
    });
  };

  // 编辑问题 当参数存在时表示修改
  $scope.addQuestion = $scope.editQuestion = function (question) {
    var oldQuestion = angular.copy(question) || '';
    // 取出当题库题号
    var seqNoArr = [];
    for(var i in $scope.questionList){
      seqNoArr.push(parseInt($scope.questionList[i].SeqNo));
    }

    var modalInstance = $modal.open({
      templateUrl: 'addQuestion.html',
      controller: 'AddQuestionCtrl',
      backdrop: false,
      resolve: {
        items: function () {
          return {
            target: question ? question : scale.id,
            seqNoArr : seqNoArr
          };
        }
      }
    });

    modalInstance.result.then(function (addQuestionItem) {
      if (question) {
        for (var i in $scope.questionList) {
          if ($scope.questionList[i].SeqNo === addQuestionItem.SeqNo) {
            $scope.questionList.splice(i, 1, addQuestionItem);

            // 如果当前ID不为0则表示修改数据库数据
            if(!!question.ID){
              addPsychologicalScale.updateScaleSingleQuestion(question);
            }
            return;
          }
        }
      } else {
        //angular.extend(addQuestionItem, {SeqNo: $scope.questionList.length ? $scope.questionList[$scope.questionList.length - 1].SeqNo + 1 : 1});
        $scope.questionList.push(addQuestionItem);
      }

    }, function () {
      // 取消时还原当前题
      if(question) angular.extend(question,oldQuestion);
      // 取消操作
      if(!$scope.questionList.length) return;
      angular.forEach($scope.questionList, function (question) {
        var newQuestion = angular.copy(question.Options);
        angular.forEach(question.Options, function (answer) {
          if(answer.Cont == undefined){
            newQuestion.splice(newQuestion.indexOf(answer), 1);
          }
        });
        question.Options = newQuestion;
      });
    });
  }
  /** === 题库 结束 ====================================================================== **/

  /** === Anomaly Judgment Start====================================================================== **/
// 异常条件数据
  $scope.anomalyList = [];

  $scope.delAnomalyJudgment = function (index, anomaly) {
    var modalInstance = $modal.open({
      templateUrl: 'removeConfirm.html',
      size: 'sm',
      controller:'RemoveConfirmCtrl',
      resolve: {
        items: function () {
          return {
            data: anomaly,
            name: '异常判定'
          }
        }
      }
    });

    modalInstance.result.then(function (res) {
      if(res.ID){
        addPsychologicalScale.delScaleFactorAnomaly(res.ID);
      }else{
        $scope.anomalyList.splice(index, 1);
      }
    }, function () {
      // 取消时作出操作
    });
  };

  // 编辑异常判定 当参数存在时表示修改
  $scope.addAnomalyJudgment = $scope.editAnomalyJudgment = function (anomaly) {
    var oldAnomaly = angular.copy(anomaly) || '';

    var modalInstance = $modal.open({
      templateUrl: 'addAnomalyJudgment.html',
      controller: 'AddAnomalyJudgmentCtrl',
      backdrop: false,
      resolve: {
        items: function () {
          return {
            target: anomaly ? anomaly : scale.id,
            factorList: scale.factorDataList
          }
        }
      }
    });

    modalInstance.result.then(function (addAnomalyData) {
      if(anomaly){
        if(addAnomalyData.ID){
          addPsychologicalScale.updateScaleFactorAnomaly(addAnomalyData);
        }else{
          for(var i in $scope.anomalyList){
            if($scope.anomalyList[i].Sign === addAnomalyData.Sign){
              $scope.anomalyList.splice(i,1,addAnomalyData);
              return;
            }
          }
        }

      }else{
        if($scope.anomalyList.length){
          angular.extend(addAnomalyData, {Sign:$scope.anomalyList[$scope.anomalyList.length-1].Sign ? $scope.anomalyList[$scope.anomalyList.length-1].Sign + 1 : 1});
        }else{
          angular.extend(addAnomalyData, {Sign:1});
        }

        $scope.anomalyList.push(addAnomalyData);
      }

    }, function () {
      // 取消时作出操作
      if(anomaly) angular.extend(anomaly,oldAnomaly);
    });
  }

  /* ------  失效规则  ----------------------------------------------------------------------------- */
  $scope.failureRuleList = [];

  // 删除失效规则
  $scope.delFailureRule = function (index, failure) {
    var modalInstance = $modal.open({
      templateUrl: 'removeConfirm.html',
      size: 'sm',
      controller:'RemoveConfirmCtrl',
      resolve: {
        items: function () {
          return {
            data: failure,
            name: '测慌规则'
          }
        }
      }
    });

    modalInstance.result.then(function (res) {
      $scope.failureRuleList.splice($scope.failureRuleList.indexOf(res), 1);

      // 删除当前题
      if(parseInt(res.ID)){
        addPsychologicalScale.delScaleInvalid(res.ID);
      }else{
        toastr.success('删除成功！');
      }
    }, function () {
      // 取消时作出操作
    });
  };

  $scope.addFailureRule = $scope.editFailureRule = function (failure) {
    var oldFailure = angular.copy(failure) || '';

    var modalInstance = $modal.open({
      templateUrl: 'addFailureRule.html',
      controller: 'AddFailureRuleCtrl',
      backdrop: false,
      resolve: {
        items: function () {
          return failure ? failure : scale.id
        }
      }
    });

    modalInstance.result.then(function (addFailureRuleData) {
      if(failure){
        if(addFailureRuleData.ID){
          addPsychologicalScale.updateScaleInvalid(addFailureRuleData);
        }else{
          for(var i in $scope.failureRuleList){
            if($scope.failureRuleList[i].Sign === addFailureRuleData.Sign){
              $scope.failureRuleList.splice(i,1,addFailureRuleData);
              return;
            }
          }
        }

      }else{
        if($scope.failureRuleList.length){
          angular.extend(addFailureRuleData, {Sign:$scope.failureRuleList[$scope.failureRuleList.length-1].Sign ? $scope.failureRuleList[$scope.failureRuleList.length-1].Sign + 1 : 1});
        }else{
          angular.extend(addFailureRuleData, {Sign:1});
        }

        $scope.failureRuleList.push(addFailureRuleData);
      }

    }, function () {
      // 取消时作出操作
      if(failure) angular.extend(failure,oldFailure);
    });
  };

  /** === Anomaly Judgment End ====================================================================== **/

  /** === Factor Definition Start ====================================================================== **/
  $scope.factorDefinitionList = [];

  // 删除因子定义
  $scope.delFactorDefinition = function (factor) {
    var modalInstance = $modal.open({
      templateUrl: 'removeConfirm.html',
      size: 'sm',
      controller:'RemoveConfirmCtrl',
      resolve: {
        items: function () {
          return {
            data: factor,
            name: '因子'
          }
        }
      }
    });

    modalInstance.result.then(function (res) {
      addPsychologicalScale.removeScaleFactorDefinition(res.ID);
      $scope.factorDefinitionList.splice($scope.factorDefinitionList.indexOf(res), 1);
    }, function () {
      // 取消时作出操作
    });
  };

  // 编辑问题 当参数存在时表示修改
  $scope.addFactorDefinition = $scope.editFactorDefinition = function (factor) {
    var oldFactor = angular.copy(factor) || '';
    var modalInstance = $modal.open({
      templateUrl: 'addFactorDefinition.html',
      controller: 'AddFactorDefinitionCtrl',
      backdrop: false,
      resolve: {
        items: function () {
          return {
            target: factor ? factor : scale.id,
            factorList: $scope.factorDefinitionList
          }
        }
      }
    });

    modalInstance.result.then(function (addFactorItem) {
      /*if (factor) {
        for (var i in $scope.factorDefinitionList) {
          if ($scope.factorDefinitionList[i].id === addFactorItem.id) {
            $scope.factorDefinitionList.splice(i, 1, addFactorItem);
            return;
          }
        }
      } else {
        angular.extend(addFactorItem, {id: $scope.factorDefinitionList.length ? $scope.factorDefinitionList[$scope.factorDefinitionList.length - 1].id + 1 : 1});
        $scope.factorDefinitionList.push(addFactorItem);
      }*/

      addPsychologicalScale.saveScaleFactorDefinition(addFactorItem);

    }, function () {
      // 取消时作出操作
      if(factor) angular.extend(factor,oldFactor);
    });
  }

  /** === Factor Definition End ====================================================================== **/

  /** === Factor Interpretation Start ====================================================================== **/

  $scope.interpretationList = [];

  // 删除因子解释
  $scope.delFactorInterpretation = function (interpretation) {
    var modalInstance = $modal.open({
      templateUrl: 'removeConfirm.html',
      size: 'sm',
      controller:'RemoveConfirmCtrl',
      resolve: {
        items: function () {
          return {
            data: interpretation,
            name: '因子解释'
          }
        }
      }
    });

    modalInstance.result.then(function (res) {
      if(res.ID){
        addPsychologicalScale.removeScaleFactorExplain(res.ID);
      }else {
        $scope.interpretationList.splice($scope.interpretationList.indexOf(res), 1);
      }
    }, function () {
      // 取消时作出操作
    });
  };

  $scope.addFactorInterpretation = $scope.editFactorInterpretation = function (interpretation) {
    var oldInterpretation = angular.copy(interpretation) || '';
    var modalInstance = $modal.open({
      templateUrl: 'addFactorInterpretation.html',
      controller: 'AddFactorInterpretationCtrl',
      backdrop: false,
      resolve: {
        items: function () {
          return {
            interpretation: interpretation ? interpretation : scale.id,
            factor : scale.factorDataList
          }
        }
      }
    });

    modalInstance.result.then(function (addInterpretationItem) {
      if (interpretation) {
        // 如果ID不为0，则表示更新数据库数据
        if(interpretation.ID){
          addPsychologicalScale.updateScaleFactorExplain(addInterpretationItem);
        }

        var sign = interpretation.ID ? 'ID' :'Sign';
        for (var i in $scope.interpretationList) {
          if ($scope.interpretationList[i][sign] === addInterpretationItem[sign]) {
            $scope.interpretationList.splice(i, 1, addInterpretationItem);
            return;
          }
        }
      } else {
        angular.extend(addInterpretationItem, {Sign: $scope.interpretationList.length ? $scope.interpretationList[$scope.interpretationList.length - 1].Sign + 1 : 1, ScaID: scale.id});
        $scope.interpretationList.push(addInterpretationItem);
      }
    }, function () {
      // 取消时作出操作
      if(interpretation) angular.extend(interpretation,oldInterpretation);
    });

  }
  /** === Factor Interpretation End ====================================================================== **/

}]);

/** === New Add Questions ====================================================================== **/
app.controller('AddQuestionCtrl', ['$scope', '$modalInstance', 'items', 'toastr', 'toastrConfig', function ($scope, $modalInstance, items, toastr, toastrConfig) {
  'use strict';

  toastrConfig.preventOpenDuplicates = true;
  $scope.question = {
    ID:0,
    SeqNo: items.seqNoArr.length ? Math.max.apply(null,items.seqNoArr) + 1 : 1,
    ScaID:undefined,
    Title: undefined,
    QuestionTypeID: "96734479500017598",
    ImgUrl: '',
    Options:[]
  };

  if((typeof items.target) === 'object'){
    $scope.addQuestionTitle = '修改';
    // 修改数据获取
    $scope.question = items.target;

    items.seqNoArr.splice(items.seqNoArr.indexOf(parseInt($scope.question.SeqNo)), 1);

  }else{
    $scope.addQuestionTitle = '新增';
    $scope.question.ScaID = items.target;
  }

  $scope.cancel = function () {
    $modalInstance.dismiss($scope.question);
  };
  $scope.confirm = function () {
    if (!$scope.question.Title) {
      toastr.error('请填写问题题干！');
      return;
    }
    if (!$scope.question.SeqNo) {
      toastr.error('请填写题号！');
      return;
    }

    if(items.seqNoArr.indexOf(parseInt($scope.question.SeqNo)) != -1){
      toastr.error('当前题号已存在，请重新填写！');
      return;
    }
    if(!parseInt($scope.question.SeqNo)) {
      toastr.error('当前题号不能为0，请重新填写！');
      return;
    }

    if (!$scope.question.Options.length) {
      toastr.error('请添加问题答案！');
      return;
    } else {
      var errorRecord = '';
      angular.forEach($scope.question.Options, function (item, i) {
        if (!item.Sign || !item.Cont || !item.Score) {
          var order = ++i;
          errorRecord += (!errorRecord ? order : '、' + order);
        }
      });
      if (!!errorRecord) {
        toastr.error('第' + errorRecord + '条答案未填写完整！');
        return;
      }
    }

    $modalInstance.close($scope.question);
  };

  ///===========================
  $scope.checkSign = function (data) {
    if (!(/^[A-Za-z]$/.test(data))) {
      //toastr.error('请填写A-Z的大写字母！');
      return '请填写A-Z的大写字母！';
    }
  };
  $scope.checkCont = function (data) {
    if (!data) {
      //toastr.error('请填写问题答案！');
      return '请填写问题答案！';
    }
  };
  $scope.checkScore = function (data) {
    if (!(/^[+-]?\d+\.?\d*$/.test(data))) {
      //toastr.error('请填写正0-100的整数！');
      return '请填写正正确定的数值！';
    }
  };
  $scope.saveAnswer = function (data, ID) {
    //$scope.user not updated yet
    angular.extend(data, {ID: ID});
    //return $http.post('/saveUser', data);
  };

  // remove user
  $scope.delAnswer = function (index) {
    $scope.question.Options.splice(index, 1);
  };

  // add answer
  $scope.addAnswer = function () {
    $scope.inserted = {
      //ID: $scope.question.Options.length ? $scope.question.Options[$scope.question.Options.length - 1].ID + 1 : 1,
      ID:0,
      Sign: String.fromCharCode((65 + $scope.question.Options.length)),
      Cont: undefined,
      Score: undefined
    }
    $scope.question.Options.push($scope.inserted);
  };

  // 批量导入答案
  $scope.importAnswer = function () {
      var copyAnswerData = JSON.parse(APPMODEL.Storage.copyAnswer);
      angular.forEach(copyAnswerData, function (item) {
          item.ID = 0;
      });
      $scope.question.Options = copyAnswerData;
      toastr.success('答案已导入成功！');
  };

  // 批量导出答案
  $scope.exportAnswer = function () {
      if (!$scope.question.Options.length) {
          toastr.error('请添加问题答案！');
          return;
      } else {
          var errorRecord = '';
          angular.forEach($scope.question.Options, function (item, i) {
              if (!item.Sign || !item.Cont || !item.Score) {
                  var order = ++i;
                  errorRecord += (!errorRecord ? order : '、' + order);
              }
          });
          if (!!errorRecord) {
              toastr.error('第' + errorRecord + '条答案未填写完整！');
              return;
          }
      }
      APPMODEL.Storage.copyAnswer = JSON.stringify($scope.question.Options);
      toastr.success('答案已导出副本！');
 };

  ///===========================
    setTimeout(function () {
        $(".modal-content").draggable({ containment: "#app", scroll: false });
    }, 100);
}]);
/** === New Add Factor Definition Controller ====================================================================== **/
app.controller('AddFactorDefinitionCtrl', ['$scope', '$modalInstance', 'items', 'toastr', 'toastrConfig', function ($scope, $modalInstance, items, toastr, toastrConfig) {
  'use strict';

  $scope.factor = {
    ID: 0,
    ScaID: undefined,
    LstSqeNo:undefined,
    Name: undefined,
    StandardScore: 0,
    Rule: undefined,
    Remark: undefined
  };

  $scope.factorList = items.factorList;

  // 配置提示消息框
  toastrConfig.preventOpenDuplicates = true;
   if((typeof items.target) === 'object'){
     $scope.factor = items.target;
     $scope.addFactorTitle = '修改';
   }else {
     $scope.addFactorTitle = '新增';
     $scope.factor.ScaID = items.target;
   }


  $scope.confirm = function () {
    if (!$scope.factor.Name) {
      toastr.error('请填写因子名称！');
      return;
    }

    if (!$scope.factor.Rule) {
      toastr.error('请填写计算公式！');
      return;
    }

    // 新增因子时验证当前因子是否存在
    if($scope.factorList.length && (typeof items.target) !== 'object'){
      for(var i in $scope.factorList){
        if($scope.factorList[i].Name === $scope.factor.Name){
          toastr.error('因子已存在，请重新定义！');
          return;
        }
      }
    };

    $scope.factor.Rule =  $scope.factor.Rule.replace(/\s*/g, '');
    var factorRuleIsTrue = function () {
      try{
        return  new Function('return ' + $scope.factor.Rule.replace(/{\d+}/g, 0)).call();
      }catch (error){
        return false;
      }
    };


    if(!/^[+-]?\d+\.?\d*$/.test(factorRuleIsTrue())){
      toastr.error('请填写正确定的因子公式！');
      return;
    }

    $modalInstance.close($scope.factor);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
/** === New Add Anomaly Judgment Controller ====================================================================== **/
app.controller('AddAnomalyJudgmentCtrl', ['$scope', '$modalInstance', 'items', '$filter', 'toastr', 'toastrConfig', function ($scope, $modalInstance, items, $filter, toastr, toastrConfig) {
  'use strict';

  $scope.anomaly = {
    ID: 0,
    ScaID: undefined,
    FactorID: undefined,
    FactorName: undefined,
    MinAge: undefined,
    MaxAge: undefined,
    MinScore: undefined,
    MaxScore: undefined,
    Sex: -1,
    Age: true,
    Sign: undefined
  };

  // 因子列表
  $scope.factorList = items.factorList;


  // 配置提示消息框
  toastrConfig.preventOpenDuplicates = true;
  if((typeof items.target) === 'object'){
    if(!items.target.MinAge && !items.target.MinAge){
      $scope.anomaly = angular.extend(items.target,{Age: true});
    }else{
      $scope.anomaly = angular.extend(items.target,{Age: false});
    }

    $scope.addAnomalyTitle = '修改';
  }else {
    $scope.addAnomalyTitle = '新增';
    $scope.anomaly.ScaID = items.target;
  }

$scope.$watch('anomaly.Age', function (nv, ov) {
  if (nv){
    $scope.anomaly.MinAge = $scope.anomaly.MaxAge = 0;
  }
});
  $scope.changeFactor = function () {
    var selected = $filter('propsFilter')($scope.factorList, {ID:$scope.anomaly.FactorID});
    $scope.anomaly.FactorName = selected[0].Name;
  }

  $scope.confirmAnomaly = function () {
    if (!$scope.anomaly.FactorID) {
      toastr.error('请选择因子！');
      return;
    }
    if (!$scope.anomaly.Sex) {
      toastr.error('请选择性别！');
      return;
    }
    if ($scope.anomaly.MinAge == undefined || $scope.anomaly.MaxAge == undefined) {
      toastr.error('请填写年龄范围！');
      return;
    }else{
      if(($scope.anomaly.MinAge - $scope.anomaly.MaxAge) > 0){
        toastr.error('最小年龄不能大于最大年龄！');
        return;
      }
    }
    if ($scope.anomaly.MinScore == undefined || $scope.anomaly.MaxScore == undefined) {
      toastr.error('请填写得分范围！');
      return;
    }else{
      if(($scope.anomaly.MinScore - $scope.anomaly.MaxScore) > 0){
        toastr.error('最小得分不能大于最大得分！');
        return;
      }
    }

    $modalInstance.close($scope.anomaly);
  };

  $scope.cancelAnomaly = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
/** === New Add Failure Rule Controller ====================================================================== **/
app.controller('AddFailureRuleCtrl', ['$scope', '$modalInstance', 'items', '$filter', 'toastr', 'toastrConfig', function ($scope, $modalInstance, items, $filter, toastr, toastrConfig) {
  'use strict';

  $scope.failureRule = {
    ID: 0,
    ScaID: undefined,
    Name: undefined,
    Rule: undefined,
    Sex: -1,
    MinScore: undefined,
    MaxScore: undefined
  };


  // 配置提示消息框
  toastrConfig.preventOpenDuplicates = true;
  if((typeof items) === 'object'){
    $scope.failureRule = items;
    $scope.failureRuleTitle = '修改';
  }else {
    $scope.failureRuleTitle = '新增';
    $scope.failureRule.ScaID = items;
  }


  $scope.confirmFailureRule = function () {
    if (!$scope.failureRule.Sex) {
      toastr.error('请选择性别！');
      return;
    }
    if ($scope.failureRule.MinScore == undefined || $scope.failureRule.MaxScore == undefined) {
      toastr.error('请填写得分范围！');
      return;
    }else{
      if(($scope.failureRule.MinScore - $scope.failureRule.MaxScore) > 0){
        toastr.error('最小得分不能大于最大得分！');
        return;
      }
    }

    if(!$scope.failureRule.Rule){
      toastr.error('请填写测慌规则！');
      return;
    }

    $scope.failureRule.Rule =  $scope.failureRule.Rule.replace(/\s*/g, '');
    var failureRuleIsTrue = function () {
      try{
        return  new Function('return ' + $scope.failureRule.Rule.replace(/{\d+}/g, 0)).call();
      }catch (error){
        return false;
      }
    };

    if(!/^[+-]?\d+\.?\d*$/.test(failureRuleIsTrue())){
      toastr.error('请填写正确定的测慌规则！');
      return;
    }

    $modalInstance.close($scope.failureRule);
  };

  $scope.cancelFailureRule = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
/** === New Add Factor Definition Controller ====================================================================== **/
app.controller('AddFactorInterpretationCtrl', ['$scope', '$filter', '$modalInstance', 'items', 'toastr', 'toastrConfig', function ($scope,$filter, $modalInstance, items, toastr, toastrConfig) {
  'use strict';

  // 配置提示消息框
  toastrConfig.preventOpenDuplicates = true;

  $scope.factorList = items.factor;

  $scope.interpretData = {
    ID: 0,
    FactorID: undefined,
    FactorName: undefined,
    ScaID: undefined,
    MinAge: undefined,
    MaxAge: undefined,
    MaxScore: undefined,
    MinScore: undefined,
    Sex: -1,
    Desc: undefined,
    PositiveRule: undefined,
    Age: true
  }

  $scope.$watch('interpretData.Age', function (nv, ov) {
    if (nv){
      $scope.interpretData.MinAge = $scope.interpretData.MaxAge = 0;
    }
  });

  $scope.changeFactor = function () {
    var selected = $filter('propsFilter')($scope.factorList, {ID:$scope.interpretData.FactorID});
   $scope.interpretData.FactorName = selected[0].Name;
   }

  if((typeof items.interpretation) === 'object'){
    if(!items.interpretation.MinAge && !items.interpretation.MinAge){
      $scope.interpretData = angular.extend(items.interpretation,{Age: true});
    }else{
      $scope.interpretData = angular.extend(items.interpretation,{Age: false});
    }

    $scope.addInterpretationTitle = '修改';
  }else {
    $scope.addInterpretationTitle = '新增';
    $scope.interpretData.ScaID = items.interpretation;
  }

  // 提交因子解释
  $scope.confirmInterpret = function () {

    if (!$scope.interpretData.FactorID) {
      toastr.error('请选择因子！');
      return;
    }

    if ($scope.interpretData.MinAge == undefined || $scope.interpretData.MaxAge == undefined) {
      toastr.error('请填写年龄范围！');
      return;
    }else{
      if(($scope.interpretData.MinAge - $scope.interpretData.MaxAge) > 0){
        toastr.error('最小年龄不能大于最大年龄！');
        return;
      }
    }
    if ($scope.interpretData.MinScore == undefined || $scope.interpretData.MaxScore == undefined) {
      toastr.error('请填写得分范围！');
      return;
    }else{
      if(($scope.interpretData.MinScore - $scope.interpretData.MaxScore) > 0){
        toastr.error('最小得分不能大于最大得分！');
        return;
      }
    }

    if (!$scope.interpretData.Desc) {
      toastr.error('请填写因子解释内空！');
      return;
    }

    $modalInstance.close($scope.interpretData);
  };

  $scope.cancelInterpret = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
app.filter('sexFormat', function () {
  return function (value) {
    switch (parseInt(value)){
      case 0:
        return '女';
        break;
      case 1:
        return '男';
         break;
      case -1:
        return '不限';
        break;
    };
  }
});

app.controller('RemoveConfirmCtrl', ['$scope', '$modalInstance', 'items', function ($scope, $modalInstance, items) {
  'use strict';
  $scope.item = items.data;
  $scope.name = items.name;
  $scope.comfirm = function () {
      $modalInstance.close($scope.item);
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
