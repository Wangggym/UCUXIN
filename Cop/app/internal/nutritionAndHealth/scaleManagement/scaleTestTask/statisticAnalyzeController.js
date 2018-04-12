/**
 * Created by wangbin on 2017/6/15.
 */
app.controller('statisticAnalyzeController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', 'applicationServiceSet', 'toastr', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, applicationServiceSet, toastr) {
   var analyze = {
       /**
        * 入口
        */
       init:function () {
           //提示框初始化
           toastr.toastrConfig.positionClass = 'toast-top-center';
           toastr.toastrConfig.timeOut = 1500;
           analyze.pageData();
           analyze.onEvent();
           analyze.getClassList();
           analyze.getFactors();
       },
       /**
        * 页面数据初始化
        */
       pageData : function(){
           // 第1个,柱状图的参数
            $scope.model = {
                orderId : $stateParams.orderId,
                topGID : $stateParams.topGID,
                showTip :  false,
                oneClass : undefined,
                oneStudent: undefined,
                classList : [],
                studentList : [],
                factorList : []
            };
           // 第2个,柱状图的参数
           $scope.modelTwo = {
               showTip :  false,
               class:undefined,
               schoolOrClass : 1,
               stateTwo: 0
           };
           // 第3个,饼状图的参数
           $scope.modelThree = {
               showTip :  false,
               class:undefined,
               factor:undefined,
               sex:-1,
               schoolOrClass : 1
           };
           // 第4个,饼状图的参数
           $scope.modelFour = {
               showTip :  false,
               class:undefined,
               factor:undefined,
               sex:-1,
               schoolOrClass : 1,
               age:0,
               minAge : 0,
               maxAge : 100,
               ageState:false
           }
       },
       /**
        * 页面相关操作
        */
       onEvent : function () {
           /**
            * 第一个图的相关操作
            */
           // 选择学生
           $scope.choiceStudent = function () {
               analyze.getOneBarInfo();
           };
           // 选择班级
           $scope.choiceClass = function (type) {
               if(type == 1){
                   analyze.getStudentList();
               }else if(type == 2){
                   analyze.getSexBarGraphBySex();
               }else if(type == 3){
                   analyze.getPieByFactorOrSex();
               }else if(type == 4) {
                   analyze.getPieByFactorOrAge();
               }
           };
           /**
            * 第二个图的相关操作
            */
           // 选择以班级为维度
           $scope.byClass = function (type) {
               if(type == '1'){
                   setTimeout(function () {
                       if(!$scope.modelTwo.class){
                           $scope.modelTwo.class = $scope.model.classList[0].ClassID;
                       }
                       $('.choice').eq(0).trigger('click');
                       analyze.getSexBarGraphBySex();
                   },0);
               }else if(type == '2'){
                   setTimeout(function () {
                       if(!$scope.modelThree.class){
                           $scope.modelThree.class = $scope.model.classList[0].ClassID;
                       }
                       $('.choice').eq(1).trigger('click');
                       analyze.getPieByFactorOrSex();
                   },0)
               }else if(type == '3'){
                   setTimeout(function () {
                       if(!$scope.modelFour.class){
                           $scope.modelFour.class = $scope.model.classList[0].ClassID;
                       }
                       $('.choice').eq(2).trigger('click');
                       analyze.getPieByFactorOrAge();
                   },0)
               }
           };
           // 选择以学校为维度
           $scope.bySchool = function (type) {
               if(type == '1'){
                   analyze.getSexBarGraphBySex();
               }else if(type == '2'){
                   analyze.getPieByFactorOrSex();
               }else if(type == '3'){
                   analyze.getPieByFactorOrAge();
               }
           };
           // 班级变换的时候
           $scope.choiceClassTwo = function () {
               analyze.getSexBarGraphBySex();
           };
            // 选择不同的状态
           $scope.choiceState = function () {
               analyze.getSexBarGraphBySex();
           };
           /**
            * 第三个图的相关操作
            */
           // 选择不同的性别
           $scope.choiceSex = function (type) {
               if(type == 1){
                   analyze.getPieByFactorOrSex();
               }else if(type == 2) {
                   analyze.getPieByFactorOrAge();
               }
           };
           // 选择不同的因子
           $scope.changFactor = function (type) {
               if(type == 1){
                   analyze.getPieByFactorOrSex();
               }else if(type == 2) {
                   analyze.getPieByFactorOrAge();
               }
           };
           /**
            * 第四个图的相关操作
            */
           // 填写年龄失去焦点
           $scope.lostBlur = function (value) {
                var reg=/^(0|\+?[1-9][0-9]*)$/;
                if(!reg.test($scope.modelFour.minAge) || !reg.test($scope.modelFour.maxAge)){
                  $scope.modelFour.ageState = true;
                }else {
                  $scope.modelFour.ageState = false;
                }
                if(!$scope.modelFour.ageState){
                    analyze.getPieByFactorOrAge();
                }
           };
           // 选择年龄
           $scope.choiceAge = function () {
               analyze.getPieByFactorOrAge();
           }
       },
       /**
        * 获取班级列表
        */
       getClassList : function () {
         applicationServiceSet.internalServiceApi.psychologicalEvaluation.getClassList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.topGID]).then(function (data) {
               if (data.Ret == 0) {
                   if(data.Data.length > 0){
                       $scope.model.classList = data.Data;
                       $scope.model.oneClass = data.Data[0].ClassID;
                       analyze.getStudentList();
                       analyze.getSexBarGraphBySex();
                   }else {
                       $scope.model.showTip = true;
                       $scope.modelTwo.showTip = true;
                       $scope.modelThree.showTip = true;
                       $scope.modelFour.showTip = true;
                   }
               }
           });
       },
       /**
        * 获取学生列表
        */
       getStudentList : function () {
         applicationServiceSet.internalServiceApi.nutritionHealth.getHastestStudentList.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.orderId,$scope.model.topGID,$scope.model.oneClass]).then(function (data) {
               if (data.Ret == 0) {
                   $scope.model.showTip = false;
                   $scope.model.studentList = data.Data;
                   $scope.model.oneStudent = data.Data[0].UMID;
                   analyze.getOneBarInfo();
               }else {
                   $scope.model.studentList = [];
                   $scope.model.oneStudent = undefined;
                   $scope.model.showTip = true;
               }
           });
       },
       /**
        *  按量表获取因子清单
        */
       getFactors : function () {
           applicationServiceSet.internalServiceApi.nutritionHealth.GetFactors.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.scalId]).then(function (data) {
                if(data.Ret == 0){
                    $scope.model.factorList = data.Data;
                    $scope.modelThree.factor = data.Data[0].ID;
                    $scope.modelFour.factor = data.Data[0].ID;
                    analyze.getPieByFactorOrSex();
                    analyze.getPieByFactorOrAge();
                }
           });
       },
       /**
        *  根据学生UMID获取柱状图数据   柱状图第一个
        */
       getOneBarInfo : function () {
           applicationServiceSet.internalServiceApi.nutritionHealth.GetStuBarGraphDataByUMID.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.orderId,$scope.model.oneClass,$scope.model.oneStudent]).then(function (data) {
               if (data.Ret == 0) {
                   $scope.model.showTip = false;
                   analyze.showBar(1,data.Data.Container);
               }else {
                   $scope.model.showTip = true;
               }
           });
       },
       /**
        * 根据学校或班级按照性别获取图表统计数据  柱状图第二个
        */
       getSexBarGraphBySex : function () {
           var classId ='';
           if($scope.modelTwo.schoolOrClass == 1){
               classId = 0;
           }else {
               classId = $scope.modelTwo.class;
           }
           applicationServiceSet.internalServiceApi.nutritionHealth.GetSexBarGraphBySex.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.orderId,classId,$scope.modelTwo.stateTwo]).then(function (data) {
               if (data.Ret == 0) {
                   $scope.modelTwo.showTip = false;
                   analyze.showBar(2,data.Data.Container);
               }else {
                   $scope.modelTwo.showTip = true;
               }
           });
       },
       /**
        * 根据学校或班级与性别按照因子获取图表统计数据  饼状图第一个
        */
       getPieByFactorOrSex : function () {
           var classId ='';
           if($scope.modelThree.schoolOrClass == 1){
               classId = 0;
           }else {
               classId = $scope.modelThree.class;
           }
           applicationServiceSet.internalServiceApi.nutritionHealth.GetPieByFactorOrSex.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.orderId,classId,$scope.modelThree.sex,$scope.modelThree.factor]).then(function (data) {
               if (data.Ret == 0) {
                   $scope.modelThree.showTip = false;
                   analyze.showPie(1,data.Data.Series);
               }else {
                   $scope.modelThree.showTip = true;
               }
           });
       },
       /**
        * 根据学校或班级与性别按照因子获取图表统计数据  饼状图第二个
        */
       getPieByFactorOrAge : function () {
           var classId ='',minAge,maxAge;
           if($scope.modelFour.schoolOrClass == 1){
               classId = 0;
           }else {
               classId = $scope.modelFour.class;
           }
           if($scope.modelFour.age == 0){
               minAge = undefined;
               maxAge = undefined;
           }else {
               minAge =  $scope.modelFour.minAge;
               maxAge =  $scope.modelFour.maxAge;
           }
           applicationServiceSet.internalServiceApi.nutritionHealth.GetPieByFactorOrAge.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.orderId,classId,$scope.modelFour.sex,$scope.modelFour.factor,minAge,maxAge]).then(function (data) {
               if (data.Ret == 0) {
                   $scope.modelFour.showTip = false;
                   analyze.showPie(2,data.Data.Series);
               }else {
                   $scope.modelFour.showTip = true;
               }
           });
       },
       /**
        * 展示柱状图
        */
       showBar : function (index,chartJson) {
           var myChart,obj = undefined,name;
           if(index == 1){
               myChart = echarts.init(document.getElementById('chartBar1'),'theme');
           }else {
               myChart = echarts.init(document.getElementById('chartBar2'),'theme');
           }
           $.each($scope.model.studentList,function (e,item) {
               if(item.UMID == $scope.model.oneStudent){
                   obj = item;
               }
           });
           if(index == 1){
               name = obj.Name +'得分情况';
           }else {
               if($scope.modelTwo.schoolOrClass == 2){
                   $.each($scope.model.classList,function (e,item) {
                       if($scope.modelTwo.class == item.ClassID){
                           name = item.ClassName+'男女测试情况对比';
                       }
                   });
               }else {
                   name = '男女测试情况对比';
               }
           }
           var option = {
                   title : {
                       text:name,
                       x:'center'
                   },
               tooltip : {
                   trigger: 'axis',
                   confine:true,
                   axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                       type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                   },
                   textStyle:{
                       fontSize:'12px'
                   },
                   formatter:function (params, ticket, callback) {
                        if(index == 1){
                            var item = chartJson[0].Series[params[0].dataIndex];
                            return '<div style="max-width: 200px;height:auto;word-wrap:break-word;word-break:break-all;"><p style="margin: 0">'+item.Name+'</p><p style="margin: 0">得分：'+item.Value+'分</p><span style="word-wrap:break-word;word-break:break-all;">'+item.Tooltip+'</span></div>';
                        }else {
                            if(params.length>1){
                                var item1 = chartJson[0].Series[params[0].dataIndex];
                                var item2 = chartJson[1].Series[params[1].dataIndex];
                                return '<div style="max-width: 200px;height:auto;word-wrap:break-word;word-break:break-all;">' +
                                    '<p style="margin: 0">'+item1.Name+'</p>' +
                                    '<p style="margin: 0">男：'+item1.Value+'人</p>' +
                                    '<p style="margin: 0">女：'+item2.Value+'人</p>' +
                                    '</div>';
                            }else {
                                var str = '',item;
                                if(params[0].seriesName == '男'){
                                    item = chartJson[0].Series[params[0].dataIndex];
                                    str =  '<p style="margin: 0">男：'+item.Value+'人</p>';
                                }else {
                                    item = chartJson[1].Series[params[0].dataIndex];
                                    str =  '<p style="margin: 0">女：'+item.Value+'人</p>';
                                }
                                return '<div style="max-width: 200px;height:auto;word-wrap:break-word;word-break:break-all;">' +
                                    '<p style="margin: 0">'+item.Name+'</p>' + str+
                                    '</div>';
                            }
                        }
                   }
               },
               legend: {
                   top: '2%',
                   left:'20%',
                   orient: 'horizontal',
                   data:[]
               },
               grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '15%',
                   containLabel: true
               },
               xAxis : [
                   {
                       type : 'category',
                       data : [],
                       axisLabel: {
                           interval: 0,
                           rotate: 45,
                           margin: 6,
                           textStyle: {
                               color: "#222"
                           }
                       }
                   }
               ],
               yAxis : [
                   {
                       type : 'value',
                       minInterval: 1,
                       axisLabel: {
                           formatter: '{value} 分'
                       }
                   }
               ],
               series : []
           };
           if(index == 2){
               option.yAxis[0].axisLabel.formatter = '{value} 人'
           }
           $.each(chartJson,function (e,item) {
               var dataItem  = {
                   name:item.Name,
                   type:'bar',
                   label:{
                       normal:{
                           show:true,
                           position:'top',
                           formatter: function (params) {
                               var item;
                             item = chartJson[0].Series[params.dataIndex];
                             return item.Text;
                           },
                           textStyle:{
                               color:'#232323'
                           }
                       },
                       emphasis:{
                           show:true,
                           position:'top',
                           formatter: function (params) {
                               var item;
                             item = chartJson[0].Series[params.dataIndex];
                             return item.Text;
                           },
                           textStyle:{
                               color:'#232323'
                           }
                       }
                   },
                   itemStyle:{
                       normal:{
                           color:'#5B9BD5'
                       }
                   },
                   data:[]
               };
               if(item.Name == '男') {
                   dataItem.itemStyle.normal.color = '#5B9BD5'
               }
               if(item.Name == '女') {
                   dataItem.itemStyle.normal.color = '#ED7D31'
               }
               $.each(item.Series,function (i,element) {
                   var elet = {
                       value:element.Value,
                       // itemStyle:{
                       //     normal:{
                       //         color:'#5B9BD5'
                       //     }
                       // }
                   };
                   dataItem.data.push(elet);
                   if(e == 0){
                       if(element.Name.length>8){
                           var str = element.Name.substring(0,8)+'...';
                           option.xAxis[0].data.push(str);
                       }else {
                           option.xAxis[0].data.push(element.Name);
                       }
                   }
               });
               if(index == 2){
                   option.legend.data.push(item.Name);
               }
               option.series.push(dataItem);
           });
           myChart.setOption(option);
           window.onresize = function () {
               myChart.resize();
           }
       },
       /**
        * 展示饼状图
        */
       showPie : function (index,chartJson) {
           var myChart,option,name,factorId;
           if(index == 1){
               myChart = echarts.init(document.getElementById('chartPei1'),'theme');
               factorId = $scope.modelThree.factor;
           }else {
               myChart = echarts.init(document.getElementById('chartPei2'),'theme');
               factorId = $scope.modelFour.factor;
           }
           $.each($scope.model.factorList,function (e,item) {
                if(item.ID == factorId){
                    name = item.Name;
                }
           });
           option = {
               title : {
                   text: name,
                   x:'center'
               },
               tooltip : {
                   trigger: 'item',
                   formatter: "{a} <br/>{b} : {c} ({d}%)"
               },
               legend: {
                   bottom: '15%',
                   orient: 'horizontal',
                   data: []
               },
               series : [
                   {
                       name: '',
                       type: 'pie',
                       radius : '55%',
                       center: ['50%', '40%'],
                       data:[
                           // {value:335, name:'直接访问'},
                           // {value:310, name:'邮件营销'},
                           // {value:234, name:'联盟广告'},
                           // {value:135, name:'视频广告'},
                           // {value:1548, name:'搜索引擎'}
                       ]
                       // itemStyle: {
                       //     emphasis: {
                       //         shadowBlur: 10,
                       //         shadowOffsetX: 0,
                       //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                       //     }
                       // }
                   }
               ]
           };
           $.each(chartJson,function (e,item) {
               var obj = {
                   value:item.Value,
                   name:item.Name,
                   itemStyle: {
                       normal:{
                           color:''
                       },
                       emphasis: {
                           shadowBlur: 10,
                           shadowOffsetX: 0,
                           shadowColor: 'rgba(0, 0, 0, 0.5)'
                       }
                   }
               };
               if(item.Other == 0){
                   obj.itemStyle.normal.color = '#5B9BD5';
               }else if(item.Other == 1){
                   obj.itemStyle.normal.color = '#ED7D31';
               }else {
                   obj.itemStyle.normal.color = '#A5A5A5';
               }
               option.legend.data.push(item.Name);
               option.series[0].data.push(obj);
           });
           myChart.setOption(option);
       }
   };
    analyze.init();
}]);
