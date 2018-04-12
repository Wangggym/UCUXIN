/**
 * Created by lxf on 2017/6/5.
 */
/*
 * 考勤打卡
 * */
app.factory("attendanceService",[function () {
    var service = {};
    var basicDataControlService = function () {
        var service = {
            /*--------------------------基础数据管理-----------------------------------------*/
            // 获取当前用户学校列表
            getSchoolList: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Auth/GetCurUserSchool",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        orgid: params[1]
                    };
                }
            },
            //获取所有刷卡场景------------------------
            GetClockTypeList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/ClockTime/GetClockTypeList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                    };
                }
            },
            //获取所有刷卡时段------------------------
            GetClockTimeList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/ClockTime/GetClockTimeList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid:params[1]
                    };
                }
            },
            //修改刷卡场景数据
            UpClockType: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/ClockTime/UpClockType?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        ID:params[0],
                        Name:params[1],
                        IsAttendance:params[2],
                        StuInMsg:params[3],
                        StuOutMsg:params[4],
                        TeaInMsg:params[5],
                        TeaOutMsg:params[6],
                    }
                }
            },
            //获取所有供应商设备
            GetSupplierEqList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/Eq/GetSupplierEqList?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {

                    }
                }
            },
            //获取设备的参数列表
            GetSupplierEqParamList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/Eq/GetSupplierEqParamList?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        supplierEqID:params[0]
                    }
                }
            },
            //发起app升级
            UpgradeApp: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/Eq/UpgradeApp?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestPost:function (params) {
                    return {
                    }
                },
                requestParams:function (params) {
                    return {
                        EqIDs:params[0],
                        AppUrl:params[1]
                    }
                }
            },
            //获取学校的设备列表
            GetEqList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/Eq/GetEqList?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        gid:params[0]
                    }
                }
            },
            //删除设备
            DeleteEq: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/Eq/DeleteEq?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestPost:function (params) {
                    return {
                        eqID:params[0]
                    }
                },
                requestParams:function (params) {
                    return {

                    }
                }
            },
            //获取学校的刷卡区域简单列表(用于查询条件\下拉选项的数据源)
            GetClockAreaSimpleList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/ClockArea/GetClockAreaSimpleList?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        gid:params[0],
                        clockTypeID:params[1]
                    }
                }
            },
            //获取刷卡区域详情
            GetClockArea: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/ClockArea/GetClockArea?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        clockAreaID:params[0],
                    }
                }
            },
            //获取学校的刷卡区域详细列表(用于查询条件\下拉选项的数据源)---------------
            GetClockAreaList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/ClockArea/GetClockAreaList?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        gid:params[0],
                    }
                }
            },
            //公共接口-获取学校级届和级届下的班级------------------------
            GetClassGrades: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/BaseSet/GetClassGrades?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        gid:params[0],
                    }
                }
            },
            //添加或更新刷卡区域---------------------------
            AddOrUpClockArea: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/ClockArea/AddOrUpClockArea?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestPost:function (params) {
                    return {
                    }
                },
                requestParams:function (params) {
                    return {
                        ID:params[0],
                        GID:params[1],
                        Name:params[2],
                        ClockTypeID:params[3],
                        ClockObjType:params[4],
                        ObjList:params[5],
                        IsSendData:params[6],
                        Gender:params[7],
                        MType:params[8],
                    }
                }
            },
            //删除刷卡区域-----------------------
            DeleteClockArea: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/ClockArea/DeleteClockArea?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestPost:function (params) {
                    return {
                        clockAreaID:params[0]
                    }
                },
                requestParams:function (params) {
                    return {

                    }
                }
            },
            //新增或修改设备相关
            AddOrUpEq: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/Eq/AddOrUpEq?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestPost:function (params) {
                    return {
                    }
                },
                requestParams:function (params) {
                    return {
                        ID:params[0],
                        GID:params[1],
                        ENO:params[2],
                        ClockAreaID:params[3],
                        SupplierEqID:params[4],
                        InOutModel:params[5],
                        InOutType:params[6],
                        Desc:params[7],
                        EqReaders:params[8],
                        EqParams:params[9],
                        ClockTypeID:params[10]
                    }
                }
            },
            //获取设备详情
            GetEq: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/Eq/GetEq?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        eqID:params[0]
                    }
                }
            },
            //获取合作伙伴卡号号段列表
            GetOrgCardList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/OrgCard/GetOrgCardList?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                    }
                }
            },
            //获取合作伙伴列表
            GetOrgList: {
                method: "get",
                requestUrl: urlConfig + "COP/v3/Org/GetOrgList?token=" +APPMODEL.Storage.getItem('copPage_token') +"&type=8",
                requestParams: function (params) {
                    return {
                    }
                }
            },
            //查询卡号详情
            GetCardDetailInfo: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/CardInfo/GetCardDetailInfo?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        cardno:params[0]
                    }
                }
            },
            //添加合作伙伴卡号号段
            AddOrgCard: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/OrgCard/AddOrgCard?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        OrgID:params[0],
                        CardNoHeader:params[1]
                    };
                }
            },
            /*--------------------------发卡管理-----------------------------------------*/
            /*根据gid获取学生发卡列表*/
            GetStuCardList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/CardInfo/GetStuCardList?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        gid:params[0],
                        classid:params[1],
                        name:params[2],
                        onlyNoCard:params[3],
                    }
                }
            },
            //导入学生卡号关系
            ImportStuCardList: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/ImportStuCardList?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return params;
                },
                requestPost: function (params) {
                    return {
                        orgid:params[0]
                    }
                },
            },
            //导入学生家庭住址
            ImportStuInfoList: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/ImportStuInfoList?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return params;
                },
            },
            //根据学生umid获取学生绑卡详情
            GetStuCardByUMID: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/CardInfo/GetStuCardByUMID?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        umid:params[0],
                    }
                }
            },
            //保存学生信息
            SaveStuInfo: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/SaveStuInfo?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        UMID:params[0],
                        StuType:params[1],
                        Address:params[2]
                    }
                }
            },


            //保存图片
            AddStuImage: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/AddStuImage?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        UMID:params[0],
                        Pic:params[1],
                        MType:params[2]
                    }
                }
            },
            //删除图片
            DeleteStuImage: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/DeleteStuImage?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                    }
                },
                requestPost:function (params) {
                    return {
                        id:params[0]
                    }
                }
            },
            //获取Oss阿里云标识
            GetOSSAccessIdentity: {
                method: "get",
                requestUrl: urlConfig + "public/v3/OpenAppSkin/GetOSSAccessToken?token="+APPMODEL.Storage.getItem('applicationToken'),
                requestParams: function (params) {
                    return params;
                }
            },
            //根据Oss后台获取的标识以及扩展名
            GetSkinPackOSSFileInfo: {
                method: "get",
                requestUrl: urlConfig + "public/v3/OpenAppSkin/GetSkinPackOSSFileInfo?token="+APPMODEL.Storage.getItem('applicationToken'),
                requestParams: function (params) {
                    return {
                        devType:params[0],
                        skinPackNo:params[1],
                        attachType:params[2]

                    };
                }
            },
            //根据Oss后台获取的标识以及扩展名
            GetSubAppOSSFileInfo: {
                method: "get",
                requestUrl: urlConfig + "public/v3/OpenAppSubApp/GetSubAppOSSFileInfo?token="+APPMODEL.Storage.getItem('applicationToken'),
                requestParams: function (params) {
                    return {
                        iconsetID:params[0],
                        subAppNo:params[1],
                        attachType:params[2]

                    };
                }
            },
            //图片文件上传
            ImageUserRegistrationUpload: {
                method: "post",
                requestUrl: urlConfig + 'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"ocs/StuImg","AttachType":1,"ExtName":".jpg","ResizeMode":1,"SImgResizeMode":2,"CreateThumb":true,"LImgMaxWidth":100,"LImgMaxHeight":100,"SImgMaxHeight":50,"SImgMaxWidth":50}&token=' + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return params;
                }
            },
            //图片文件上传
            ImageRegistrationUpload: {
                method: "post",
                requestUrl: urlConfig + 'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"ocs/StuImg","AttachType":1,"ExtName":".jpg","ResizeMode":1,"SImgResizeMode":2,"CreateThumb":true,"LImgMaxWidth":100,"LImgMaxHeight":100,"SImgMaxHeight":50,"SImgMaxWidth":50}&token=' + APPMODEL.Storage.getItem('applicationToken'),
                requestParams: function (params) {
                    return params;
                }
            },
            //绑定卡号
            BindCard: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/BindCard?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        UMID:params[0],
                        CardNo:params[1]
                    }
                },
            },
            //解除绑定
            UnBindCardNo: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/UnBindCard?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                    }
                },
                requestPost: function (params) {
                    return {
                        cardInfoID:params[0],

                    }
                }
            },
            //注销卡号
            DeleteCardInfo: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/CardInfo/DeleteCardInfo?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        id:params[0],
                    }
                }
            },
            //教师绑卡列表
            GetTeaCardList: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/CardInfo/GetTeaCardList?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        gid:params[0],
                        name:params[1],
                        onlyNoCard:params[2]
                    }
                }
            },
            //导入卡号数据
            ImportCard: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/ImportCard?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return params;
                },
                requestPost:function (params) {
                    return {
                        orgid:params[0],
                        icRule:params[1]
                    }
                }
            },
            //导入卡号数据
            ImportTeaCardList: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/ImportTeaCardList?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return params;
                },
                requestPost:function (params) {
                    return params;
                }
            },
            //根据老师umid获取老师绑卡详情
            GetTeaCardByUMID: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/CardInfo/GetTeaCardByUMID?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        umid:params[0],
                    }
                }
            },
            //获取审核列表分页
            GetOrgCardApplyPage: {
                method: "get",
                requestUrl: urlConfig + "OCS/v3/OrgCard/GetOrgCardApplyPage?token=" +APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        pageSize:params[0],
                        pageIndex:params[1],
                        orgid:params[2],
                        gid:params[3],

                    }
                }
            },
            //添加卡号数量(内部运营使用)
            AddOrgCardApply: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/OrgCard/AddOrgCardApply?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        OrgID:params[0],
                        GID:params[1],
                        Cnt:params[2],
                        Desc:params[3],
                    }
                }
            },
            //添加卡号数量(合作伙伴使用)
            OrgCardApply: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/OrgCard/OrgCardApply?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        OrgID:params[0],
                        GID:params[1],
                        Cnt:params[2],
                        Desc:params[3],
                    }
                }
            },
            //审核卡号数量申请
            CheckOrgCardApply: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/OrgCard/CheckOrgCardApply?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                    }
                },
                requestPost:function (params) {
                    return {
                        applyID:params[0],
                        st:params[1]
                    }
                }
            },
            //删除卡号数量申请
            DeleteOrgCardApply: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/DeleteCard?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {

                    }
                },
                requestPost:function (params) {
                    return {
                        orgid:params[0],
                        sCard:params[1],
                        eCard:params[2],
                    }
                }
            },
            //注销卡号
            CancelCard: {
                method: "post",
                requestUrl: urlConfig + "OCS/v3/CardInfo/CancelCard?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {

                    }
                },
                requestPost:function (params) {
                    return {
                        cardInfoID:params[0],
                    }
                }
            },
            //查询考勤数据
            GetClockRosterPage:{
                method: "get",
                requestUrl: urlConfig + "OCS/v3/SafeAttend/GetClockRosterPage?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        pSize:params[0],
                        pIndex:params[1],
                        gid:params[2],
                        sDate:params[3],
                        eDate:params[4],
                        clockTimeID:params[5],
                        classid:params[6],
                        name:params[7]
                    }
                },
            },
            //查询流水数据
            GetClockRecordPage:{
                method: "get",
                requestUrl: urlConfig + "OCS/v3/SafeAttend/GetClockRecordPage?token=" + APPMODEL.Storage.getItem('copPage_token'),
                requestParams: function (params) {
                    return {
                        pSize:params[0],
                        pIndex:params[1],
                        gid:params[2],
                        sDate:params[3],
                        eDate:params[4],
                        clockTimeID:params[5],
                        classid:params[6],
                        name:params[7],
                        cardNum:params[8]
                    }
                },
            },
            /*----------------------------------------------------------------------------*/
        };
        return service;
    };
    service.basicDataControlService = basicDataControlService();
    return service;
}]);
