app.controller('addPackageController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    var addCourse = {
        /**
         * 入口
         */
        init : function () {
            addCourse.pageData();
            addCourse.onEvent();
            addCourse.getAllPriceType();
        },
        /**
         * 页面数据初始化
         */
        pageData : function () {
            $scope.id = $stateParams.id || 0;
            // 类型
            $scope.featured = {
                allType:[
                    {field:true,Name:'是'},
                    {field:false,Name:'否'}
                ],
                choiceType:undefined
            };
            // 推荐位
            $scope.courseType = {
                allType:[
                    {ID:0,Name:'学校服务包'},
                    {ID:1,Name:'个人购买'}
                ],
                choiceType:undefined
            };
            // 上传图片
            $scope.imgUrl = undefined;
            // 简介
            $scope.intro = undefined;
            // 价格
            $scope.price = {
                choiceType:undefined,
                typeList:[]
            };
            // 详细介绍
            $scope.context = new Object();
        },
        /**
         * 绑定页面相关的事件
         */
        onEvent : function () {
            // 上传图片
            $scope.fileChange = function (file) {
                addCourse.fileUp(file);
            };
            // 选择收费类型
            $scope.choicePriceInput = function ($event,item) {
                $event.stopPropagation();
                if(item.inputSate == true){
                    item.inputSate = false;
                    item.price = '';
                }else {
                    item.inputSate = true;
                }
            };
            // 添加课程
            $scope.addListCourse = function (item) {
                if(!item || item == ''){
                    toastr.error('请先查询课程！');
                    return;
                }
                if($scope.course.choiceList.length>0){
                    $.each($scope.course.choiceList,function (e,elet) {
                        if(elet.ID == item.ID){
                            $scope.course.choiceList.splice(e,1);
                        }
                    })
                }
                $scope.course.choiceList.push(item);
            };
            // 删除已选择的课程
            $scope.deletCourse = function (item) {
                $.each($scope.course.choiceList,function (e,elet) {
                    if(elet.ID == item.ID){
                        $scope.course.choiceList.splice(e,1);
                    }
                })
            };
            // 保存
            $scope.confirm = function () {
                addCourse.confirm();
            }
        },
        /**
         * 上传图片
         */
        fileUp:function(file){
            if (file) {
                applicationServiceSet.mentalHealthService._CourseClassify._ImageRegistrationUpload.fileUpload(file).then(function (data) {
                    if(data.Ret == 0){
                        $scope.imgUrl= data.Data.Url;
                    }
                });
            }
        },

        /**
         * 获取价格类型
         */
        getAllPriceType:function () {
            applicationServiceSet.mentalHealthService._CourseClassify._GetAllPriceType.send([sessionStorage.getItem('copPage_token')]).then(function (data) {
                if (data.Ret == 0) {
                    $scope.price.typeList = data.Data;
                    $.each($scope.price.typeList,function (e,item) {
                        item.inputSate = false;
                        item.PriceTypeID = item.ID;
                        item.PriceTypeName = item.Name;
                        item.Price = undefined;
                    });
                    if($stateParams.id && $stateParams.id!=0){
                        addCourse.getCourseDetail();
                    }
                }
            });
        },
        /**
         * 获取单个服务包详情
         */
        getCourseDetail:function(){
            applicationServiceSet.mentalHealthService._MentalOpen._GetPsyChargeDetails.send([sessionStorage.getItem('copPage_token'),$scope.id]).then(function (data) {
                if (data.Ret == 0) {
                    if(data.Data.Type == 0){
                        $scope.courseType.choiceType = {
                            ID:0,
                            Name:"学校服务包"
                        };
                    }else if(data.Data.Type == 1){
                        $scope.courseType.choiceType = {
                            ID:1,
                            Name:"个人购买"
                        };
                    }
                    if(data.Data.IsBanner){
                        $scope.featured.choiceType = {
                            field:true,
                            Name:"是"
                        };
                    }else {
                        $scope.featured.choiceType = {
                            field:false,
                            Name:"否"
                        };
                    }
                    $scope.Name = data.Data.Name;
                    $scope.imgUrl = data.Data.Pic;
                    $scope.intro = data.Data.Description;
                    if(data.Data.IsPrice){
                        $scope.price.choiceType = true;
                        $.each($scope.price.typeList,function (e,item) {
                            $.each(data.Data.Prices,function (e,elet) {
                                if(item.PriceTypeID == elet.PriceTypeID){
                                    item.Price = elet.Price;
                                    item.inputSate = true;
                                }
                            });
                        });
                    } else {
                        $scope.price.choiceType = false;
                    }
                    $scope.context.receiveUeditText(data.Data.Detail);
                }
            });
        },
        /**
         * 验证数据完整性
         */
        confirm:function () {
            var text = $scope.context.returnUeditText();
            var priceType = Number($scope.price.choiceType);
            var tip = true,tip2=undefined;
            if(!$scope.Name){
                toastr.error('请填写服务包名称！');
                return;
            }
            if(!$scope.imgUrl || $scope.imgUrl == ''){
                toastr.error('请上传图片！');
                return;
            }
            if(priceType !==0 && priceType !==1){
                toastr.error('请选择价格！');
                return;
            }
            if(priceType == 1){
                $.each($scope.price.typeList,function (e,item) {
                    if(item.inputSate==true){
                        tip = false;
                    }
                })
            }
            if(priceType == 0){
                tip = false;
            }
            if(tip){
                toastr.error('至少输入一个价格！');
                return;
            }
            if(priceType == 1){
                $.each($scope.price.typeList,function (e,item) {
                    if(item.inputSate==true){
                        if(!item.Price||item.Price ==''){
                            tip2 = '请填写正确的价格！';
                            return;
                        }else if(parseFloat(item.Price)<=0){
                            tip2 = '请填写大于0的价格！';
                            return;
                        }
                    }
                })
            }
            if(tip2){
                toastr.error(tip2);
                return;
            }
            if(!$scope.intro || $scope.intro == ''){
                toastr.error('请填写简介！');
                return;
            }
            if(!text || text == ''){
                toastr.error('请填写详细介绍！');
                return;
            }
            if(!$scope.courseType.choiceType){
                toastr.error('请选择类型!');
                return;
            }
            addCourse.add();
        },
        /**
         *保存
         */
        add:function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            if(month.toString().length === 1){
                month = "0"+month;
            }
            var time = year+'-'+month+'-'+day+' '+ hour+':'+minute+':'+second;
            var UDateTime;
            var CDateTime;
            if($stateParams.id != 0){
                UDateTime = time;
                CDateTime = undefined;
            }else{
                UDateTime = undefined;
                CDateTime = time;
            }
            var text = $scope.context.returnUeditText();
            var priceData = [];
            $.each($scope.price.typeList,function (e,item) {
                if(item.inputSate == true){
                    priceData.push(item);
                }
            });
            //免费的时候清空收费的数组
            if(!$scope.price.choiceType){
                priceData = [];
            }
            applicationServiceSet.mentalHealthService._MentalOpen._AddOrUpdatePsyCharge.send([$scope.id,$scope.Name,$scope.imgUrl,$scope.intro,
                text, $scope.price.choiceType,priceData,undefined,$scope.courseType.choiceType.ID,0,CDateTime,UDateTime,$scope.featured.choiceType.field],[sessionStorage.getItem('copPage_token')]).then(function (data) {
                if (data.Ret == 0) {
                    if($scope.id==0){
                        toastr.success('新增成功！');
                    }else {
                        toastr.success('修改成功！');
                    }
                    $location.path('access/app/internal/servicePackageManagement/mentalServicePackage');
                }
            });
        }

    };
    addCourse.init();
}]);
