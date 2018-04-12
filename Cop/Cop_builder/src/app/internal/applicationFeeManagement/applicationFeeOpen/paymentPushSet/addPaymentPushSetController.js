/**
 * Created by fanweihua on 2016/9/8.
 * addPaymentPushSetController
 * add payment push set
 */
app.controller('addPaymentPushSetController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, applicationServiceSet) {
    /**
     * add payment push set (function)
     */
    var addPaymentPushSetController = (function () {
        /**
         * init
         */
        var init = function () {
            variable();//variable declaration
            serviceApi.getArticleId();//获取文章ID
            operation.basic();//basic operation
        };
        /**
         * variable declaration
         */
        var variable = function () {
            $scope.NochoiceSchool = false;
            $scope.model = {
                selectedGid: undefined,
                FixEntryDesc: undefined,
                FixEntryPic: 'http://img.prd.ucuxin.com/ux/201/hd/img/16/09/08/af2b091527ce4c85bada75ad70bd31f3l.png', //默认图标地址
                FixEntryUrl: undefined,
                FixEntryTitle: undefined,
                SubscriptUrl: undefined,
                MPAccountID: undefined,
                SubscriptTitle: undefined,
                SubscriptMsg: undefined,
                SubscriptPic: undefined,
                ImgUrl: undefined,
                imageUrl: undefined,
                imageName: undefined,
                MPAccountList: [],
                FixPreViewUrl: '',
                IsShowFixEntry: undefined,
                FixEntryUrlType: 1,
                state: true
            };
            $scope.mmodel = {
                FixEntryBgColor: "FFFFFF",
                FixEntryTitleColor: "FF0000",
                backGroundColorList: [
                    {
                        "id": 'FFFFFF',
                        "name": "白色"
                    }
                ],
                fixEntryTitleColorList: [
                    {
                        "id": "FF0000",
                        "name": "红色"
                    },
                    {
                        "id": "0C0C0C",
                        "name": "黑色"
                    }
                ]
            };
            $scope.modelIs = {
                IsShowFixEntryId: 1,
                IsShowFixEntryList: [
                    {
                        "id": true,
                        "name": "是",
                        "idT": 1
                    },
                    {
                        "id": false,
                        "name": "否",
                        "idT": 2
                    }
                ]
            };
            $scope.imgIsDisabledImage = false;
            $scope.isDisabledImage = true;
        };
        /**
         * service aggregate
         */
        var serviceApi = {
            setting: (function () {
                return {
                    dataHandle: function () {
                        var data = {
                            IsShowFixEntry: undefined,
                            IsShowFixEntryName: undefined
                        };
                        for (var i in $scope.modelIs.IsShowFixEntryList) {
                            if ($scope.modelIs.IsShowFixEntryId == $scope.modelIs.IsShowFixEntryList[i].idT) {
                                data.IsShowFixEntry = $scope.modelIs.IsShowFixEntryList[i].id;
                                data.IsShowFixEntryName = $scope.modelIs.IsShowFixEntryList[i].name;
                                break;
                            }
                        }
                        return data;
                    }
                }
            })(),
            /**
             * get school org pages list
             * @param selectedGid
             */
            getOrgSchoolPage: function (selectedGid) {
                if (selectedGid) {
                    $("ul[aria-labelledby='dLabel'] li").eq(0).hide();
                    applicationServiceSet.internalServiceApi.paymentTableSearch.getFuzzySchoolList.send([APPMODEL.Storage.getItem('applicationToken'), selectedGid]).then(function (data) {
                        if (data.Ret == 0) {
                            $scope.schoolList = data.Data;
                            $("ul[aria-labelledby='dLabel'] li").eq(0).show();
                        }
                    });
                }
            },
            /**
             * new add school configuration information
             */
            addGoupConfig: function () {
                var data = this.setting.dataHandle();
                applicationServiceSet.internalServiceApi.applicationFeeOpen.AddGoupConfig.send([$stateParams.id, $scope.model.selectedGid, $scope.model.FixEntryDesc, $scope.model.FixEntryPic, $scope.mmodel.FixEntryBgColor, $scope.model.FixEntryTitle, $scope.mmodel.FixEntryTitleColor, $scope.model.FixEntryUrl,$scope.model.FixPreViewUrl,data.IsShowFixEntry,$scope.model.FixEntryUrlType]).then(function (data) {
                    if (data.Ret == 0) {
                        toastr.success("新增缴费推送成功");
                        $location.path('/access/app/internal/applicationFeeOpen/paymentPushSet');
                    }
                });
            },
            /**
             * get config by gid
             */
            getConfigByGid: function () {
                applicationServiceSet.internalServiceApi.applicationFeeOpen.GetConfigByGid.send([APPMODEL.Storage.getItem('copPage_token'), $stateParams.gid]).then(function (data) {
                    if (data.Ret == 0) {
                        if(data.Data && data.Data != ''){
                            $scope.model = data.Data;
                            // if (data.Data.MPAccountName) {
                            //     serviceApi.getPageMPAccounts(data.Data.MPAccountName);//通过关键字获取订阅号
                            // }
                            if (data.Data.IsShowFixEntry) {
                                $scope.modelIs.IsShowFixEntryId = 1;
                            } else {
                                $scope.modelIs.IsShowFixEntryId = 2;
                            }
                            $scope.mmodel.FixEntryBgColor = data.Data.FixEntryBgColor;
                            $scope.mmodel.FixEntryTitleColor = data.Data.FixEntryTitleColor;
                            $scope.model.imageUrl = data.Data.SubscriptPic;
                            $scope.model.selectedGid = $stateParams.gid;
                            $scope.model.FixPreViewUrl = data.Data.FixPreViewUrl;
                            $scope.model.IsShowFixEntry = data.Data.IsShowFixEntry;
                            $scope.model.FixEntryUrlType = data.Data.FixEntryUrlType;
                            $stateParams.id = data.Data.ID;
                            if (!$stateParams.copy) {
                                serviceApi.getOrgSchoolPage(data.Data.GName);//get school org pages list
                            }
                            // 生成二维码
                            if(data.Data.FixPreViewUrl && data.Data.FixPreViewUrl != ''){
                                setTimeout(function () {
                                    document.getElementById("qrcode").innerHTML = '';
                                    var qrcode = new QRCode(document.getElementById("qrcode"), {
                                        width: 200,
                                        height: 200
                                    });
                                    qrcode.makeCode(data.Data.FixPreViewUrl);
                                }, 100);
                            }
                        }else {
                            document.getElementById("qrcode").innerHTML = '';
                            $scope.model.FixEntryDesc = undefined;
                            $scope.model.FixEntryTitle = undefined;
                        }
                    }
                });
            },
            /**
             * 获取文章ID
             */
           getArticleId: function () {
               applicationServiceSet.internalServiceApi.applicationFeeOpen.GetLongID.send([APPMODEL.Storage.getItem('copPage_token')]).then(function (data) {
                    if (data.Ret == 0) {
                        /**
                         * 判断是编辑还是新增
                         */
                        if(!$stateParams.id || $stateParams.id=='undefined'){
                            $stateParams.id = data.Data;
                        }else {
                            $scope.NochoiceSchool = true;
                        }
                    }
                });
            },
            /**
             * 查询文章内容
             */
            queryContentsArticle: function () {
                applicationServiceSet.internalServiceApi.applicationFeeOpen.QueryContentsArticle.send([APPMODEL.PHPConfig.app_id_cop, $stateParams.id]).then(function (data) {
                    if (data.Ret == 0) {
                        $scope.model.SubscriptTitle = data.Data.title;
                        $scope.model.SubscriptMsg = data.Data.description;
                        $scope.model.SubscriptPic = data.Data.thumb;
                        $scope.model.imageUrl = data.Data.thumb;
                        $scope.model.FixEntryUrl = data.Data.s_url;
                        $scope.model.FixPreViewUrl = data.Data.url;
                        // 生成二维码
                        if($scope.model.FixPreViewUrl && $scope.model.FixPreViewUrl != ''){
                            setTimeout(function () {
                                document.getElementById("qrcode").innerHTML = '';
                                var qrcode = new QRCode(document.getElementById("qrcode"), {
                                    width: 200,
                                    height: 200
                                });
                                qrcode.makeCode(data.Data.url);
                            }, 100);
                        }
                    }
                });
            },
            /**
             * image file upload
             * @param file
             */
            fileUpload: function (file) {
                applicationServiceSet.parAppServiceApi.applicationFeeOpen.imageFileUpload.fileUpload(file).then(function (data) {
                    if (data.Ret == 0) {
                        operation.imageUrl(data.Data);
                    }
                });
            }
        };
        var operation = {
            /**
             * basic operation
             */
            basic: function () {
                /**
                 * refresh service get school list
                 * @param selectedGid
                 */
                $scope.refreshAddresses = function (selectedGid) {
                    if (selectedGid) {
                        serviceApi.getOrgSchoolPage(selectedGid);//get school org pages list
                    }
                };
                /**
                 * delete gid
                 */
                $scope.deleteSelectedGid = function () {
                    $scope.model.selectedGid = undefined;
                };
                /**
                 * 选择订阅号
                 * @param sec
                 */
                $scope.refreshMPAccount = function (sec) {
                    if (sec) {
                        // serviceApi.getPageMPAccounts(sec);//通过关键字获取订阅号
                    }
                };
                // 选择学校
                $scope.choiceSchool = function (item) {
                    $stateParams.gid = item.GID;
                    serviceApi.getConfigByGid();
                };
                // 选择缴费链接类型
                $scope.choiceEnsure = function (type) {
                    if(type == 1){
                        serviceApi.queryContentsArticle();//查询文章内容
                    }else {
                        document.getElementById("qrcode").innerHTML = '';
                    }
                };
                /**
                 * upload file image
                 * @param file
                 */
                $scope.fileChange = function (file) {
                    if (file) {
                        serviceApi.fileUpload(file);
                        $scope.model.imageName = file.name;
                    }
                };
                /**
                 * 页面编辑
                 */
                $scope.editHtml = function () {
                    if(!$scope.model.selectedGid || $scope.model.selectedGid == ''){
                        toastr.error("请选择学校");
                        return;
                    }
                    var url = APPMODEL.PHPConfig.url + "index.php?m=content&c=content&a=add&app_id="+ APPMODEL.PHPConfig.app_id_cop+"&app_data_id=" +  $stateParams.id + "&token=" + APPMODEL.Storage.getItem('copPage_token');
                    var winObj = window.open(url, '页面编辑', 'width=1000,height=800,status=0,toolbar=0');
                    var loop = setInterval(function () {
                        if (winObj.closed) {
                            clearInterval(loop);
                            toastr.success("已关闭编辑页");
                            serviceApi.queryContentsArticle();//查询文章内容
                        }
                    }, 1000);
                };
                /**
                 * save
                 */
                $scope.save = function () {
                    // 判断必填选项
                    if(!$scope.model.selectedGid || $scope.model.selectedGid == ''){
                        toastr.error('请填写学校！');
                        return;
                    }
                    if(!$scope.model.FixEntryDesc || $scope.model.FixEntryDesc == ''){
                        toastr.error('请填写入口小字描述！');
                        return;
                    }
                    if(!$scope.model.FixEntryTitle || $scope.model.FixEntryTitle == ''){
                        toastr.error('请填写入口标题！');
                        return;
                    }
                    console.log($scope.mmodel.FixEntryBgColor);
                    if(!$scope.mmodel.FixEntryBgColor || $scope.mmodel.FixEntryBgColor == ''){
                        toastr.error('请填写入口背景色！');
                        return;
                    }
                    if(!$scope.mmodel.FixEntryTitleColor || $scope.mmodel.FixEntryTitleColor == ''){
                        toastr.error('请填写入口标题颜色！');
                        return;
                    }
                    if($scope.model.FixEntryUrlType == ''){
                        toastr.error('请选择入口链接类型！');
                        return;
                    }else if($scope.model.FixEntryUrlType == 1){
                        if(!$scope.model.FixPreViewUrl || $scope.model.FixPreViewUrl == ''){
                            toastr.error('请编辑完成缴费文章！');
                            return;
                        }
                    }
                    serviceApi.addGoupConfig();//new add school configuration information
                };
                if ($stateParams.gid) {
                    operation.editGid();//obtain configuration information based on GID
                }
                $scope.ueditText = new Object();
                $scope.saveImage = function () {
                    $scope.model.imageCall = $scope.ueditText.returnUeditText();
                    $scope.ueditText.receiveUeditText($scope.model.imageCall);
                };
            },
            /**
             * file return
             * @param file
             */
            imageUrl: function (file) {
                if (file.Url) {
                    $scope.model.imageUrl = file.Url;
                    $scope.isDisabledImage = false;
                    $scope.imgIsDisabledImage = true;
                    $scope.model.SubscriptPic = $scope.model.imageUrl;
                } else {
                    toastr.error("图片上传失败");
                    $scope.isDisabledImage = true;
                }
            },
            /**
             * tip
             */
            tip: function () {
                toastr.toastrConfig.positionClass = 'toast-top-center';
                toastr.toastrConfig.timeOut = 2000;
            },
            /**
             * obtain configuration information based on GID
             */
            editGid: function () {
                serviceApi.getConfigByGid();//get config by gid
                $scope.imgIsDisabledImage = true;
                $scope.isDisabledImage = false;
            }
        };
        /**
         * return init function
         */
        return {
            init: init
        };
    })();
    addPaymentPushSetController.init();//add payment push set function init
}]);