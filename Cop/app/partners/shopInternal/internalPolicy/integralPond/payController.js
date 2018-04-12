
/**
 * Created by lqw on 2017/8/16
 */

app.controller('payController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {



    /**
     * c积分策略列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    var listOfintegralPond = {


        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作
            this.setting.tip();//tip

        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                parterID:0,
                pSize: 20,
                pIndex: 1,
                sid:undefined,
                sName:undefined,
                schoolList:[],
                schoolID:undefined,
                point:0,
            };
            var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));
            $scope.model.parterID=orgModel.OrgType;



        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {

                GetParterPoolDetails: function () {

                    applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoolDetails.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.pSize, $scope.model.pIndex]).then(function (data) {

                        if (data.Ret == 0) {

                            listOfintegralPond.setting.dataChange(data.Data);//类型转换
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },

                GetParterPoint:function () {
                    applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoint.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID ]).then(function (data) {

                        if (data.Ret == 0) {
                            $scope.model.point=  data.Data.Point;
                        }
                        else {
                            // toastr.error(data.Msg)
                        }
                    });
                },



                /**
                 * paging function
                 */
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
                            applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoolDetails.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.pSize,page.pIndex]).then(function (data) {
                                if (data.Ret == 0) {

                                    listOfintegralPond.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoolDetails.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.pSize,  pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfintegralPond.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.shopInternalServiceApi.shopService.GetParterPoolDetails.send([APPMODEL.Storage.getItem('copPage_token'), $scope.model.parterID,$scope.model.pSize,  pageNext]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfintegralPond.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        }
                    };
                }

            }

        })(),
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {

                listOfintegralPond.serviceApi.GetParterPoolDetails();

            };

            listOfintegralPond.serviceApi.GetParterPoint();
            //支付
            $scope.pay=function () {

                window.open('internal/shopInternal/internalPolicy/integralPond/pay.html');
                // $modal.open({
                //     templateUrl: 'newAddPay.html',
                //     controller: 'newPayContentCtrl',
                //     keyboard: false,
                //     backdrop: false,
                //     resolve: {
                //         items: function () {
                //             return [{}];
                //         },
                //         service: function () {
                //             return listOfintegralPond.serviceApi;
                //         }
                //     }
                // });
            }


            $scope.toshop = function () {

                window.open('http://shoptest.ucuxin.com/sell/login?token='+APPMODEL.Storage.getItem('copPage_token'));
            }

            $scope.search();//查询
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 数据类型转换
                 * @param data
                 */
                dataChange: function (data) {
                    for (var i in data.ViewModelList) {
                        data.ViewModelList[i].CDate=listOfintegralPond.setting.dateFormart( data.ViewModelList[i].CDate ,'');

                    }
                    $scope.model.itemList = data.ViewModelList;
                    $scope.pageIndex.pages = data.Pages;//paging pages
                    $scope.pageIndex.pageindexList(data);//paging
                },

                /**
                 * tip
                 */
                tip: function () {
                    toastr.toastrConfig.positionClass = 'toast-top-center';
                    toastr.toastrConfig.timeOut = 2000;
                },
                /**
                 * dateFormart
                 */
                dateFormart:function(date, format){
                    date = date.substring(0,10);
                    return date;
                    if (typeof (date)=="undefined") {
                        return "";
                    }
                    if (!(date instanceof  Date)) {
                        return "";
                    }

                    var $this = date;
                    var o = {
                        "M+": $this.getMonth() + 1, //month
                        "d+": $this.getDate(), //day
                        "h+": $this.getHours(), //hour
                        "m+": $this.getMinutes(), //minute
                        "s+": $this.getSeconds(), //second
                        "q+": Math.floor(($this.getMonth() + 3) / 3), //quarter
                        "S": $this.getMilliseconds() //millisecond
                    }
                    if (/(y+)/.test(format)) {
                        format = format.replace(RegExp.$1, ($this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    }

                    for (var k in o) {
                        if (new RegExp("(" + k + ")").test(format)) {
                            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                        }
                    }
                    return format;
                }
            };
        })()
    };
    listOfintegralPond.init();//函数入口

}]);



app.controller('newPayContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'toastr','applicationServiceSet', function ($scope, $modalInstance, items, service,toastr, applicationServiceSet) {
    $scope.newModel = {
        AppId:207,
        PayProductId:undefined,
        UserId:undefined,
        Subject:undefined,
        Body:undefined,
        Amount:undefined,
        Description:undefined,
        TimeExpire:undefined,
        TimeStamp:undefined,
        Sign:undefined,
        Extra:undefined,


        ID:undefined,
        AppID:undefined,
        ParterID:undefined,
        BillNo:undefined,
        ProdID:'125490073032014565',
        ST:undefined,
        Amount:undefined,
        Point:undefined,
        PayDate:undefined,
        UID:undefined,
        Desc:undefined,
        SignCode:undefined,

    };


    var orgModel= JSON.parse(APPMODEL.Storage.getItem('copPage_orgid'));


    $scope.newModel.AppID=207;
    $scope.newModel.ParterID=orgModel.OrgType;
    $scope.newModel.ST=0;




    var newModelServiceApi = {
        CreatePayOrder: function (type) {

            var parmars={

            };
            parmars.Channel=type;
            parmars.TimeStamp = Date.parse(new Date()) / 1000;
            parmars.TimeExpire = 60;
            parmars.Currency = 'cny';

            applicationServiceSet.shopInternalServiceApi.shopService.CreatePayOrder.send([
                $scope.newModel.ID,
                $scope.newModel.AppID,
                $scope.newModel.ParterID,
                $scope.newModel.BillNo,
                $scope.newModel.ProdID,
                $scope.newModel.ST,
                $scope.newModel.Amount,
                $scope.newModel.Amount*100,
                $scope.newModel.PayDate,
                $scope.newModel.UID,
                $scope.newModel.Desc,
                $scope.newModel.SignCode,

            ],[APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {

                if (data.Ret == 0) {
                    parmars.OrderNo = data.Data.BillNo;
                    parmars.AppId = 207;
                    parmars.PayProductId = data.Data.ProdID;
                    parmars.Amount = data.Data.Amount;
                    parmars.Subject = '服务费';
                    parmars.UserId = data.Data.UID;
                    parmars.Body = "福豆科技";
                    parmars.Description = data.Data.Desc;
                    parmars.Extra = "无额外参数";
                    $scope.getSign( parmars);
                    // Pay_Party_Payment.changePayType(parmars)

                }
                else {
                    // toastr.error(data.Msg)
                }
            });
        },
    };

    $scope.setMoney=function () {
        $scope.newModel.Point=$scope.newModel.Amount*100;
    }


    $scope.init=function () {



    }


    $scope.getSign=function(pay) {
        var time = Math.round(new Date().getTime() / 1000);
        $.ajax({
            url: homeRoot + uxApi.paySign,
            type: 'post',
            data: pay,
            datatype: 'json',
            success: function (restult) {

                if (restult.Ret == 0) {
                    $('#waitePage').css('display', 'none');
                    pay.Sign = restult.Data;
                    requstPay(pay);
                } else {
                    $('#waitePage').css('display', 'none');
                    alert(restult.Msg);
                }
            }
        })
    }

    $scope.init();
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * save
     */
    $scope.payMoney = function (rel) {

        var ua = navigator.userAgent.toLowerCase();//浏览器内核
        var type = '';
        var time = Math.round(new Date().getTime() / 1000);
        time = String(time);

        if(rel=='1'){
            type = '1';
            newModelServiceApi.CreatePayOrder(type);
        }else if(rel=='7'){
            type = '7';
            newModelServiceApi.CreatePayOrder(type);
        }else if(rel=='11'){
            if (ua.indexOf('micromessenger') != -1) {
                type = '11';
                newModelServiceApi.CreatePayOrder(type);
            } else {
                alert('请在微信中打开！');
            }
        }

    };
    setTimeout(function () {
        $(".modal-content").draggable({containment: "#app", scroll: false});
    }, 100);

}]);