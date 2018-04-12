/**
 * Created by fanweihua on 2016/9/22.
 * confirmPaymentController
 * confirm payment
 */
app.controller('confirmPaymentController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', '$modal', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet, $modal) {
    /**
     * confirm payment
     * @type {{init: init, variable: variable, serviceApi, operation}}
     */
    var confirmPayment = {
        init: function () {
            this.variable();//basic variable
            this.operation.basicOperation();//basic operation
            this.serviceApi.getPayType();
            this.serviceApi.getOrderByID();//get order by id
        },
        /**
         * basic variable
         */
        variable: function () {
            $scope.model = {
                payAppId:'111335691379016909',//支付应用ID
                payAccountId:'1364756753720010032',//支付应用下的账套ID
                payType:[],
                serviceProductName: undefined,//服务包名称
                Amount: undefined,//订单金额
                ProductList: undefined,//服务包列表
                productAmount: undefined,//服务包金额
                Students: undefined,//已选人数
                StudentList: [],//人数列表
                stName: undefined,
                timeStamp: parseInt(new Date().getTime() / 1000),
                userID: JSON.parse(APPMODEL.Storage.getItem('copPage_user')).UID,
                Sign: undefined,//签名
                Body: undefined,
                AppId: '111335691379016909',
                PayProductId: '94044610639017993',
                Subject: 'UX服务包购买',
                TimeExpire: '3600',
                Channel: undefined,
                Currency: 'cny',
                time: 0,
                payTime: {
                    'color': 'text-white'
                },
                payST: true,
                returnStyle: false
            };
        },
        /**
         * service aggregate
         */
        serviceApi: (function () {
            return {
                /**
                 * get order by id
                 */
                getOrderByID: function () {
                    if ($stateParams.id) {
                        applicationServiceSet.chargeServiceApi.chargeService.GetOrderByID.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.id]).then(function (data) {
                            if (data.Ret == 0) {
                                confirmPayment.operation.basicData(data.Data);//basic data
                                $scope.model.time = 3600 - parseInt(data.Data.LsftSecond);
                                confirmPayment.operation.timedCount();
                            }
                        });
                    }
                },
                /**
                 * 获取支付方式
                 */
                getPayType:function(){
                    applicationServiceSet.chargeServiceApi.chargeService.GetPayChannels.send([$scope.model.payAppId,$scope.model.payAccountId,0,4,0,'']).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.model.payType = data.Data;
                        }
                    });
                },
                /**
                 * payment request
                 */
                paymentRequest: function (payType) {
                    var payHtml = $window.open("about:blank");
                    applicationServiceSet.chargeServiceApi.chargeService.GetCreatePayModel.send([$stateParams.id,payType.PayChannelID,payType.Channel]).then(function (data) {
                        if (data.Ret == 0) {
                            var str = '';
                            for(var i in data.Data){
                                str = str+i+'='+data.Data[i]+'&';
                            }
                            payHtml.location.href = APPMODEL.payUrl+str, "_blank";
                        } else {
                            payHtml.close();
                        }
                    });
                }
            };
        })(),
        /**
         * operation aggregate
         */
        operation: (function () {
            return {
                /**
                 * basic operation
                 */
                basicOperation: function () {
                    $scope.wxPay = function () {
                        $modal.open({
                            templateUrl: 'myModalContent.html',
                            controller: 'myModalContentCtrl',
                            keyboard: false,
                            backdrop: false,
                            resolve: {
                                items: function () {
                                    return QRCode;
                                }
                            }
                        });
                    };
                    /**
                     * pay
                     * @param item
                     */
                    $scope.clickPay = function (item) {
                        var payType;
                        $scope.model.Channel = item;
                        if(item === 3){
                            payType = $scope.model.payType[0]
                        }else {
                            payType = $scope.model.payType[1]
                        }
                        confirmPayment.serviceApi.paymentRequest(payType);//payment request
                        $modal.open({
                            templateUrl: 'myModalContent.html',
                            controller: 'myModalContentCtrl',
                            keyboard: false,
                            backdrop: false,
                            resolve: {
                                items: function () {
                                    return [$scope];
                                }
                            }
                        });
                    };
                    $scope.returnLinePay = function () {
                        $scope.model.returnStyle = true;
                    };
                    // $scope.getSign();//get sign
                },
                /**
                 * basic data
                 * @param data
                 */
                basicData: function (data) {
                    $scope.model.serviceProductName = data.ChargeList[0].Name;
                    $scope.model.productAmount = data.ChargeList[0].Amount;
                    $scope.model.Students = data.StuList.length;
                    $scope.model.StudentList = data.StuList;
                    $scope.model.Amount = data.Amount;
                    $scope.model.stName = confirmPayment.basicDataList.st(data.ST);//st
                },
                /**
                 * time count
                 */
                timedCount: function () {
                    if ($scope.model.returnStyle) {
                        return;
                    }
                    document.getElementById('surplusPayTime').innerText = confirmPayment.operation.formatSeconds($scope.model.time);
                    $scope.model.time = $scope.model.time - 1;
                    if ($scope.model.time == 0) {
                        document.getElementById('surplusPayTime').innerHTML = '支付超时';
                        $location.url('access/app/partner/LineCharge/linePaymentConfirm');
                        return;
                    }
                    if ($scope.model.time < 20) {
                        $scope.model.payTime = {
                            'color': 'red'
                        };
                    }
                    setTimeout(function () {
                        confirmPayment.operation.timedCount();
                    }, 1000);
                },
                formatSeconds: function (value) {
                    var theTime = parseInt(value);// 秒
                    var theTime1 = 0;// 分
                    var theTime2 = 0;// 小时
                    if (theTime > 60) {
                        theTime1 = parseInt(theTime / 60);
                        theTime = parseInt(theTime % 60);
                        if (theTime1 > 60) {
                            theTime2 = parseInt(theTime1 / 60);
                            theTime1 = parseInt(theTime1 % 60);
                        }
                    }
                    var result = "" + parseInt(theTime) + "秒";
                    if (theTime1 > 0) {
                        result = "" + parseInt(theTime1) + "分" + result;
                    }
                    if (theTime2 > 0) {
                        result = "" + parseInt(theTime2) + "小时" + result;
                    }
                    return result;
                }
            };
        })(),
        /**
         * basic data list
         */
        basicDataList: (function () {
            return {
                /**
                 * st
                 * @param st
                 * @returns {undefined}
                 */
                st: function (st) {
                    if (st == 2) {
                        $scope.model.payST = false;
                    }
                    var stName = undefined;
                    if (!st) {
                        return stName;
                    }
                    var stList = [
                        {
                            'sy': 1,
                            'name': '未付款'
                        },
                        {
                            'sy': 2,
                            'name': '已付款'
                        },
                        {
                            'sy': 3,
                            'name': '已退款'
                        }
                    ];
                    for (var i in stList) {
                        if (st == stList[i].sy) {
                            stName = stList[i].name;
                            break;
                        }
                    }
                    return stName;
                }
            }
        })()
    };
    confirmPayment.init();//confirm payment function init
}]);
/**
 * modal
 */
app.controller('myModalContentCtrl', ['$scope', '$modalInstance', 'items','$stateParams', function ($scope, $modalInstance, items,$stateParams) {
    $scope.qrcode = items instanceof Array ? true : false;
    setTimeout(function () {
        var qrcode = new QRCode(document.getElementById("qrcode"), {
            width: 200,
            height: 200,
            text:APPMODEL.lappUrl +'charge/another_pay.html?orderId=' + $stateParams.id
        });
    },1000);
    /**
     * payOver
     */
    $scope.payOver = function () {
        if($scope.qrcode){
            $modalInstance.dismiss('cancel');

        }else{
            window.location.reload()
        }
    };
    /**
     * cancel
     */
    $scope.hProblem = function () {
        $modalInstance.dismiss('cancel');
    };
}]);