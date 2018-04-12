/**
 * Created by fanweihua on 2016/11/21.
 * listOfThemeskinsController
 * list of organizations
 */
app.controller('listOfThemeskinsController', ['$scope', '$http', '$state', '$stateParams', '$timeout', '$location', '$rootScope', '$window', 'toastr', '$modal', 'applicationServiceSet', function ($scope, $http, $state, $stateParams, $timeout, $location, $rootScope, $window, toastr, $modal, applicationServiceSet) {
    /**
     * 组织机构列表
     * @type {{init: init, variable: variable, serviceApi, operation: operation, setting}}
     */
    // --- 表格全选功能 开始 --------------------------------------------------
    $scope.selectedList = [];
    $scope.checkedAll = false;
    $scope.checkAll = function () {
        $scope.selectedList = [];
        angular.forEach($scope.model.itemList, function (item) {
            if ($scope.checkedAll) {
                item.checked = true;
                $scope.selectedList.push(item.ID);
            } else {
                item.checked = false;
            }
        });
    };
    $scope.checkedSingle = function (checked, id) {
        if (checked) {
            $scope.selectedList.push(id);
            if ($scope.selectedList.length === $scope.model.itemList.length) {
                $scope.checkedAll = true;
            }
        } else {
            $scope.checkedAll = false;
            $scope.selectedList.splice($scope.selectedList.indexOf(id), 1);
        }
    };
    // --- 表格全选功能 结束 --------------------------------------------------
    var listOfThemeskins = {
        /**
         * 入口
         */
        init: function () {
            this.variable();//变量声明
            this.serviceApi.pageIndex();//分页服务
            this.operation();//操作
            this.setting.tip();
        },
        /**
         * 变量声明
         */
        variable: function () {
            $scope.model = {
                keyWord: undefined,
                pSize: 20,
                imgUrl: undefined,
                pIndex: 1,
                IconsetList: [],
                ColorList: [],
                FontList: []
            };
        },
        /**
         * 服务集合
         */
        serviceApi: (function () {
            return {
                /**
                 * 获取组织分页数据
                 */
                GetSkinPackPageList: function () {
                    applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinPackPageList.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, $scope.model.pIndex]).then(function (data) {
                        if (data.Ret == 0) {
                            listOfThemeskins.setting.dataChange(data.Data);//类型转换
                        }
                    });
                },
                /**
                 * 获取图标集、色系、字体数据**/
                GetSkinDataSourseUnion: function () {
                    applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinDataSourseUnion.send([APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
                        if (data.Ret == 0) {
                            listOfThemeskins.setting.DataSourseUnion(data.Data);
                        }
                    });
                },
                /**
                 * 根据组织ID获取组织信息
                 * @param item
                 * @param func
                 */
                GetSkinPack: function (item, func) {
                    applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinPack.send([APPMODEL.Storage.getItem('applicationToken'), item.ID]).then(function (data) {
                        if (data.Ret == 0) {
                            func(data.Data);
                        }
                    });
                },
                /**
                 * 添加或更新组织信息
                 * @param item
                 * @param model
                 * @param func
                 */
                AddSkinPack: function (item, model, func) {

                    if(  $scope.saveJust(item)) {
                        applicationServiceSet.themeSkinServiceApi.themeSkins.AddSkinPack.send(
                            [item.ID, item.No, item.IconSetID, item.ColorID, item.FontID, item.Name, item.Desc, item.PreviewImg, item.AndroidUrl, item.IosUrl, item.Explain],
                            [APPMODEL.Storage.getItem('applicationToken')]).then(function (data) {
                            if (data.Ret == 0) {
                                toastr.success("保存成功");
                                if (model.isEdit) {
                                    model.Name = item.Name;
                                    model.Desc = item.Desc;
                                    model.PreviewImg = item.PreviewImg;
                                    model.AndroidUrl = item.AndroidUrl;
                                    model.IosUrl = item.IosUrl;
                                } else {
                                    var arr = {
                                        "Name": item.Name,
                                        "Desc": item.Desc,
                                        "PreviewImg": item.PreviewImg,
                                        "AndroidUrl": item.AndroidUrl,
                                        "IosUrl": item.IosUrl
                                    };
                                    $scope.model.itemList.unshift(arr);
                                    $scope.search();
                                }
                                func();
                            }
                        });
                    }
                },
                /**
                 * 推送
                 */
                SubmitPushForSkinPack: function (devType, skinPackIDs) {
                    applicationServiceSet.themeSkinServiceApi.themeSkins.SubmitPushForSkinPack.send(
                        [devType, skinPackIDs],
                        [APPMODEL.Storage.getItem('applicationToken'), devType]
                    ).then(function (data) {
                        if (data.Ret == 0) {
                            toastr.success("推送成功");
                        } else {
                            toastr.success(data.InfoMsg);
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
                            applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinPackPageList.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, page.pIndex, 223]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfThemeskins.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * nextPage
                         * @param pageNext
                         */
                        nextPage: function (pageNext) {
                            applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinPackPageList.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, pageNext, 223]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfThemeskins.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        },
                        /**
                         * previousPage
                         * @param pageNext
                         */
                        previousPage: function (pageNext) {
                            applicationServiceSet.themeSkinServiceApi.themeSkins.GetSkinPackPageList.send([APPMODEL.Storage.getItem('applicationToken'), $scope.model.keyWord, $scope.model.type, $scope.model.pSize, pageNext, 223]).then(function (data) {
                                if (data.Ret == 0) {
                                    listOfThemeskins.setting.dataChange(data.Data);//类型转换
                                }
                            });
                        }
                    };
                }
            };
        })(),
        /**
         * 操作
         */
        operation: function () {
            /**
             * 查询
             */
            $scope.search = function () {
                listOfThemeskins.serviceApi.GetSkinPackPageList();//服务集合
                listOfThemeskins.serviceApi.GetSkinDataSourseUnion(); //获取枚举
            };

            //图标选择
            $scope.fileChange = function (file) {
                if (file) {
                    listOfThemeskins.serviceApi.imageUpload(file);//图标上传
                }
            };
            /**
             * 编辑
             * @param item
             */
            $scope.edit = function (item) {
                if (item) {
                    listOfThemeskins.serviceApi.GetSkinPack(item, function (data) {
                        $modal.open({
                            templateUrl: 'newAddSkinContent.html',
                            controller: 'newAddMyModalContentCtrl',
                            keyboard: false,
                            backdrop: false,
                            resolve: {
                                items: function () {
                                    return [data, item, $scope.model];
                                },
                                service: function () {
                                    return listOfThemeskins.serviceApi;
                                }
                            }
                        });
                    });//根据组织ID获取组织信息
                }
            };
            /**
             * 添加组织
             */
            $scope.add = function () {
                var item = {ID: 0};
                listOfThemeskins.serviceApi.GetSkinPack(item, function (data) {
                    $modal.open({
                        templateUrl: 'newAddSkinContent.html',
                        controller: 'newAddMyModalContentCtrl',
                        keyboard: false,
                        backdrop: false,
                        resolve: {
                            items: function () {
                                $scope.model.No = data.No;
                                return [$scope.model];
                            },
                            service: function () {
                                return listOfThemeskins.serviceApi;
                            }
                        }
                    });
                });
            };
            /**
             * Android推送*
             * */
            $scope.SubmitPackSkin = function (t) {
                var devType = t; // 3  android,2 ios
                var skinPackIDs = {};
                var len = 0;
                for (var i = 0; i < $scope.model.itemList.length; i++) {
                    var ni = $scope.model.itemList[i];
                    if (ni.checked) {
                        skinPackIDs["skinPackIDs[" + i + "]"] = ni.ID;
                        len++;
                    }
                }
                if (len > 0) {
                    listOfThemeskins.serviceApi.SubmitPushForSkinPack(devType, skinPackIDs);
                } else {
                    toastr.error('请选择推送记录');
                }
            };
            $scope.search();//查询

            $scope.saveJust=function (model) {
                 // if( !($scope.model.IconSetID && $scope.model.ColorID &&$scope.model.FontID && $scope.model.AndroidUrl && $scope.model.IosUrl && $scope.model.PreviewImg )){
                 //      toastr.error('请将数据填写完整后再保存!')
                 //         return false;
                 // }
                // return true;

                if(! model.IconSetID){
                    toastr.error('请选择图标集!');
                    return false;
                }
                if(! model.ColorID){
                    toastr.error('请选择颜色!');
                    return false;
                }
                if(! model.FontID){
                    toastr.error('请选择字体!');
                    return false;
                }
                if(! model.AndroidUrl){
                    toastr.error('请选择android主题包!');
                    return false;
                }
                if(! model.IosUrl){
                    toastr.error('请选择Ios主题包!');
                    return false;
                }
                if(! model.PreviewImg){
                    toastr.error('请选择预览图!');
                    return false;
                }
                return true;
            }
        },
        /**
         * 设置
         */
        setting: (function () {
            return {
                /**
                 * 类型转换
                 * @param data
                 */
                dataChange: function (data) {
                    for (var i in data.ViewModelList) {
                        for (var s in $scope.model.typeList) {
                            if ($scope.model.typeList[s].id == data.ViewModelList[i].OrgType) {
                                data.ViewModelList[i].typeName = $scope.model.typeList[s].name;
                                break;
                            }
                        }
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
                DataSourseUnion: function (data) {
                    for (var i = 0; i < data.ColorList.length; i++) {
                        data.ColorList[i].name = data.ColorList[i].Name;
                        data.ColorList[i].id = data.ColorList[i].ID.toString();
                    }
                    for (var i = 0; i < data.FontList.length; i++) {
                        data.FontList[i].name = data.FontList[i].Name;
                        data.FontList[i].id = data.FontList[i].ID.toString();
                    }
                    for (var i = 0; i < data.IconsetList.length; i++) {
                        data.IconsetList[i].name = data.IconsetList[i].Name;
                        data.IconsetList[i].id = data.IconsetList[i].ID.toString();
                    }
                    $scope.model.ColorList = data.ColorList;
                    $scope.model.FontList = data.FontList;
                    $scope.model.IconsetList = data.IconsetList;
                }
            };
        })()
    };
    listOfThemeskins.init();//函数入口
}]);
/**
 * newAddMyModalContentCtrl
 */
app.controller('newAddMyModalContentCtrl', ['$scope', '$modalInstance', 'items', 'service', 'toastr', 'applicationServiceSet', function ($scope, $modalInstance, items, service,toastr, applicationServiceSet) {
    $scope.newModel = {
        ID: 0,
        No: undefined,
        IconSetID: undefined,
        ColorID: undefined,
        FontID: undefined,
        Name: undefined,
        Desc: undefined,
        PreviewImg: undefined,
        AndroidUrl: undefined,
        IosUrl: undefined,
        AndroidVers: undefined,
        IosVers: undefined,
        IconSet: undefined,
        ColorName: undefined,
        FontName: undefined,
        AndroidPrenct:0,
        IosPrenct:0
    };
    //图标选择
    $scope.fileChange = function (file) {
        if (file) {
            newModelServiceApi.imageUpload(file);//图标上传
        }
    };
    //上传文件 - androidUrl
    $scope.uploadAndroidOssfileChange = function (file) {
      $scope.newModel.AndroidUrl = '';
        if (file) {
            $('#andPerBox').show();
            newModelServiceApi.uploadToOss(file, 3, function (androidUrl,devType) {
                $scope.newModel.AndroidUrl = androidUrl;
              $('#andPerBox').hide();
              $('#AndroidPrenct').css({width:'0'});
                $('#andperValue,#AndroidPrenct').html( '0%');
                $('#AndroidUrl').val(androidUrl);

                newModelServiceApi.CallBackForSkinPackUpload(devType, androidUrl);
            },function (p) {

                $scope.newModel.AndroidPrenct=p+'%';
                $('#AndroidPrenct').css({width:p+'%'});
                $('#andperValue,#AndroidPrenct').html(p+'%');
              $('#AndroidPrenct').parent().attr('data-percent',p);

            });//图标上传
        }
    };
    //上传文件 - IosUrl
    $scope.uploadIosOssfileChange = function (file) {
      $scope.newModel.IosUrl = '';
        if (file) {
            $('#iosPerBox').show();
            newModelServiceApi.uploadToOss(file, 2, function (IosUrl,devType) {
                $scope.newModel.IosUrl = IosUrl;
                 $('#iosPerBox').hide();
                $('#IosPrenct').css({width:'0'});
                $('#iosperValue,#IosPrenct').html(0);
                $('#IosUrl').val(IosUrl);

                newModelServiceApi.CallBackForSkinPackUpload(devType, IosUrl);

            },function (p) {
                $('#iosPerBox').show();

              $scope.newModel.AndroidPrenct=p+'%';
              $('#IosPrenct').css({width:p+'%'});
              $('#iosperValue,#IosPrenct').html(p+'%');


            });//图标上传
        }
    };
    //下拉选择项的值改变事件
    $scope.changeitem = function (name, type, item) {
        if (type == 1) $scope.newModel.IconSet = name;
        else if (type == 2) $scope.newModel.ColorName = name;
        else if (type == 3) $scope.newModel.FontName = name;
        else if (type == 4) {
            $scope.newModel.Explain = name;

            if ($scope.newModel.Explain&&$scope.newModel.Explain.length > 20) {

                $scope.newModel.Explain = $scope.newModel.Explain.substr(0, 20);
            }
        }

        $scope.newModel.Name = '';
        if ($scope.newModel.IconSet && $scope.newModel.IconSet != 'undefined') $scope.newModel.Name = $scope.newModel.IconSet;
        if ($scope.newModel.ColorName) $scope.newModel.Name += '_' + $scope.newModel.ColorName;
        if ($scope.newModel.FontName) $scope.newModel.Name += '_' + $scope.newModel.FontName;
        //if ($scope.newModel.Desc) $scope.newModel.Name += '_' + $scope.newModel.Desc;
      if ($scope.newModel.Explain) $scope.newModel.Name += '_' + $scope.newModel.Explain;
    };

    var newModelServiceApi = {

        //上传成功后的回调
        CallBackForSkinPackUpload:function ( devType,url) {
            applicationServiceSet.themeSkinServiceApi.themeSkins.CallBackForSkinPackUpload.send([$scope.newModel.ID,devType,url],[APPMODEL.Storage.getItem('applicationToken'),$scope.newModel.ID,devType,url]).then(function (data) {
                if (data.Ret == 0) {
                    toastr.success('主题包上传成功');
                }
            });
        },

        //图标上传
        imageUpload: function (file) {

          if(file.size>=3145728){

            toastr.error('预览图大小不能超过3M');
            return false;
          }
            applicationServiceSet.parAppServiceApi.corporateRegistrationIcon.ImageRegistrationUpload.fileUpload(file).then(function (data) {
                if (data.Ret == 0) {
                    $scope.newModel.PreviewImg = data.Data.Url;
                    $scope.newModel.lpimage =data.Data.Url;
                    newModelServiceApi.getOssToken();
                }
            });
        },
        getOssToken: function () {
            applicationServiceSet.attendanceService.basicDataControlService.GetOSSAccessIdentity.send([]).then(function (data) {
                if (data.Ret == 0) {
                    var creds = data.Data;
                    var obj = {};
                }
            });
        },
        uploadToOss: function (file, devType, call,prenctCall) {
            var region = 'oss-cn-shenzhen'; //区域
            var obj = {};
            var type = '';
            var ps = file.name.split('.');
            if (ps.length > 1) type = ps[ps.length - 1];
            obj.name = file.name;
            obj.type = type;
            applicationServiceSet.attendanceService.basicDataControlService.GetSkinPackOSSFileInfo.send([devType, $scope.newModel.No, obj.type]).then(function (data) {
                if (data.Ret == 0) {
                    var creds = data.Data.TokenModel;
                    var name = data.Data.FullFileName;

                    //阿里云提供功能的上传类
                    var client = new OSS.Wrapper({
                        region: region,
                        accessKeyId: creds.AccessKeyId,
                        accessKeySecret: creds.AccessKeySecret,
                        stsToken: creds.SecurityToken,
                        bucket: creds.BucketName
                    });
                  var oliUrl = creds.RootUrl + '/' + data.Data.FullFileName;

                    //上传文件 to aliyun   ES6写法
                    OSS.co(function*() {

                        var result = client.multipartUpload(name, file, {
                            progress: function*(p) {
                                //设置进度条
                                var per = parseInt(p * 100);
                                if(prenctCall)prenctCall(per);
                                if(per==100) if (call) call(oliUrl,devType);
                            }
                        });


                    });
                }
            });
        }
    };
    /**
     * cancel
     */
    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
    /**
     * save
     */
    $scope.save = function () {
        if (items[1]) {
            items[1].isEdit = true;

            service.AddSkinPack($scope.newModel, items[1], function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        } else {
            items[0].isEdit = false;

            service.AddSkinPack($scope.newModel, items[0], function () {
                $modalInstance.dismiss('cancel');
            });//添加或更新组织信息
        }
    };
    setTimeout(function () {
        $(".modal-content").draggable({containment: "#app", scroll: false});
    }, 100);
    if (items[1]) {

       // var _spicName=items[0].Name.split('_').length==4?items[0].Name.split('_')[3]:'';
        $scope.newModel.Desc = items[0].Desc;
        $scope.newModel.IconsetList = items[2].IconsetList;
        $scope.newModel.ColorList = items[2].ColorList;
        $scope.newModel.FontList = items[2].FontList;
        $scope.newModel.ID = items[0].ID?items[0].ID:0;
        $scope.newModel.No = items[0].No;
        $scope.newModel.IconSetID = items[0].IconSetID;
        $scope.newModel.ColorID = items[0].ColorID;
        $scope.newModel.FontID = items[0].FontID;
        $scope.newModel.Name = items[0].Name;
        $scope.newModel.PreviewImg = items[0].PreviewImg;
        $scope.newModel.AndroidUrl = items[0].AndroidUrl;
        $scope.newModel.IosUrl = items[0].IosUrl;
        $scope.newModel.AndroidVers = items[0].AndroidVers;
        $scope.newModel.IosVers = items[0].IosVers;
        // $scope.newModel.IconSet = items[0].Name.split('_')[0];
        // $scope.newModel.ColorName = items[0].Name.split('_')[1];
        // $scope.newModel.FontName =items[0].Name.split('_')[2];
       //$scope.newModel.Explain=_spicName;
       $scope.newModel.IconSet = items[0].IconSet;
       $scope.newModel.ColorName = items[0].ColorName;
       $scope.newModel.FontName = items[0].FontName;
      $scope.newModel.Explain=items[0].Explain;
        $scope.newModel.disabled = true;
        $scope.newModel.onlyreadInput = true;
    } else {
        $scope.newModel.IconsetList = items[0].IconsetList;
        $scope.newModel.ColorList = items[0].ColorList;
        $scope.newModel.FontList = items[0].FontList;
        $scope.newModel.No = items[0].No;
        $scope.newModel.onlyreadInput = true;
    }
}]);


