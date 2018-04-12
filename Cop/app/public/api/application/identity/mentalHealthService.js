/**
 * Created by fanweihua on 2017/7/12.
 * 心理健康
 */
app.factory('mentalHealthService', [function () {
    return {
        //量表管理
        _InventoryManagement: {
            // 批量删除量表授权
            _DeleteScaleAccreditList: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/DeleteScaleAccreditList",
                requestPost: function (params) {
                    return {
                        token: params[0],
                    }
                },
                requestParams: function (params) {
                    return {
                        ScaleAccreditIDs:params[0]
                    };
                }
            },
            // 批量新增量表授权
            _AddScaleAccreditList: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/AddScaleAccreditList",
                requestPost: function (params) {
                    return {
                        token: params[0],
                    }
                },
                requestParams: function (params) {
                    return params;
                }
            },

            // 获取合作伙伴量表授权分页列表
            _GetScaleAccreditPageForOrg:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetScaleAccreditPageForOrg",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        partnerOrgID: params[3],
                        scaleID: params[4],
                    };
                }
            },
            // 获取学校量表授权分页列表
            _GetScaleAccreditPageForSchool:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetScaleAccreditPageForSchool",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        schoolID: params[3],
                        scaleID: params[4],
                    };
                }
            },
            //获取学校已授权的量表下拉列表
            _GetPublishScaleModelList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetPublishScaleModelList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        isShowSellName:params[1],
                        schoolID: params[2]
                    };
                }
            },
            //设置量表发布状态
            _SetScalePublishStatus: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/SetScalePublishStatus",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        scaleID:params[1],
                        isPublished:params[2]
                    };
                }
            },
            //新增或修改量表因子并添加规则和解释以及心理属性标签
            _AddOrUpdateFactorWithRuleAndDescription: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/AddOrUpdateFactorWithRuleAndDescription",
                requestParams: function (params) {
                    return params;
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //获取单条量表因子信息
            _GetFactorWithRuleAndDescription: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetFactorWithRuleAndDescription",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        factorID: params[1]
                    };
                }
            },
            //获取全部的心理机构，查询条件使用
            _GetAllPsyOrgList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Expert/GetAllPsyOrgList",
                requestParams: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //获取量表分页列表
            _GetScalePage: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetScalePage",
                requestParams: function (params) {
                    return params;
                }
            },
            //新增或修改量表基础数据
            _AddOrUpdateScale: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/AddOrUpdateScale",
                requestParams: function (params) {
                    return params;
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //查询单条量表信息
            _GetScale: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetScale",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        scaleID: params[1]
                    };
                }
            },
            //删除量表
            _DeleteScale: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/DeleteScale",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        scaleID: params[1]
                    };
                }
            },
            //获取量表用户属性库列表
            _GetScalePropertyList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetScalePropertyList",
                requestParams: function (params) {
                    return {
                        token: params
                    };
                }
            },
            //获取量表已选用户属性列表
            _GetScaleUserPropList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetScaleUserPropList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        scaleID: params[1]
                    };
                }
            },
            //清除后批量新增量表已选用户属性
            _AddScaleUserPropFirstClear: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/AddScaleUserPropFirstClear",
                requestPost: function (params) {
                    return {
                        token: params
                    };
                },
                requestParams: function (params) {
                    return {
                        ScaleID: params[0],
                        Props: params[1]
                    };
                }
            },
            //获取包含题目选项的题目列表
            _GetQuestionListWithOptions: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetQuestionListWithOptions",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        scaleID: params[1]
                    };
                }
            },
            //删除题目及选项
            _DeleteQuestion: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/DeleteQuestion",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        questionID: params[1]
                    };
                }
            },
            //获取单条量表题目信息
            _GetQuestionWithOptions: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetQuestionWithOptions",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        questionID: params[1]
                    };
                }
            },
            //新增或修改量表题目并添加选项
            _AddOrUpdateQuestionWithOptions: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/AddOrUpdateQuestionWithOptions",
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                },
                requestParams: function (params) {
                    return params;
                }
            },
            //获取因子列表
            _GetFactorList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetFactorList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        scaleID: params[1]
                    };
                }
            },
            //删除因子及规则、解释、心理属性标签
            _DeleteFactor: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Scale/DeleteFactor",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        factorID: params[1]
                    };
                }
            }
        },
        //课程分类
        _CourseClassify: {
            //图片文件上传
            _ImageRegistrationUpload: {
                method: "post",
                requestUrl: urlConfig + 'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"ProjIcon","AttachType":1,"ExtName":".jpg","ResizeMode":1,"SImgResizeMode":2,"CreateThumb":true,"Width":100,"Height":100,"SHeight":50,"SWidth":50}&token=' + APPMODEL.Storage.getItem('applicationToken'),
                requestParams: function (params) {
                    return params;
                }
            },
            //获取所有课程分类
            _GetAllClassify: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Course/GetAllClassify",
                requestParams: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            // 获取所有课程分页
            _GetCoursePage:{
              method: "get",
              requestUrl: urlConfig + "Psy/v3/Course/GetCoursePage",
              requestParams: function (params) {
                return {
                  token: params[0],
                  pSize: params[1],
                  pIndex: params[2],
                  name: params[3],
                  classifyID: params[4],
                  expertID: params[5]
                };
              }
            },
            // 发布课程
            _PublishCourse:{
              method: "post",
              requestUrl: urlConfig + "Psy/v3/Course/PublishCourse",
              requestPost: function (params) {
                return {
                  token: params[0],
                  courseID: params[1]
                };
              }
            },
            // 删除课程
            _DeleteCourse:{
              method: "post",
              requestUrl: urlConfig + "Psy/v3/Course/DeleteCourse",
              requestPost: function (params) {
                return {
                  token: params[0],
                  courseID: params[1]
                };
              }
            },
            // 获取七牛视频上传的Token
            _GetVideoToken:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Course/GetVideoToken",
                requestParams: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //添加或者修改课程
            _AddOrUpClassify: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Course/AddOrUpClassify",
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        Name: params[1],
                        Pic: params[2]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            // 获取相关机构
            _GetAllPsyOrgList:{
              method: "get",
              requestUrl: urlConfig + "Psy/v3/Expert/GetAllPsyOrgList",
              requestParams: function (params) {
                return {
                  token: params[0]
                };
              }
            },
            // 获取所有讲师
            _GetExpertList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Expert/GetExpertList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        psyOrgID: params[1],
                        name: params[2]
                    };
                }
            },
            // 获取收费类型
            _GetAllPriceType:{
              method: "get",
              requestUrl: urlConfig + "Psy/v3/Course/GetAllPriceType",
              requestParams: function (params) {
                return {
                  token: params[0]
                };
              }
            },
          // 获取所有课程列表
          _GetCourseList:{
            method: "get",
            requestUrl: urlConfig + "Psy/v3/Course/GetCourseList",
            requestParams: function (params) {
              return {
                token: params[0],
                name:params[1]
              };
            }
          },
          // 添加或修改课程
          _AddOrUpCourse:{
            method: "post",
            requestUrl: urlConfig + "Psy/v3/Course/AddOrUpCourse",
            requestParams: function (params) {
              return {
                ID: params[0],
                Name: params[1],
                CourseType: params[2],
                CourseTypeName: params[3],
                Pic: params[4],
                Desc: params[5],
                Cont: params[6],
                PsyOrgID: params[7],
                PsyOrgName: params[8],
                ExpertID: params[9],
                ExpertName: params[10],
                SourceID: params[11],
                IsPrice: params[12],
                Classifys: params[13],
                PsyAttrs: params[14],
                Phase: params[15],
                Prices: params[16],
                SubCourse: params[17],
                VideoType:params[18],
                FileKey:params[19],
                Path:params[20]
              };
            },
            requestPost: function (params) {
              return {
                token: params[0]
              };
            }
          },
          // 获取单个课程详情
          _GetCourse: {
            method: "get",
            requestUrl: urlConfig + "Psy/v3/Course/GetCourse",
            requestParams: function (params) {
              return {
                token: params[0],
                courseID: params[1]
              };
            }
          },
            // 添加或修改Banner
          _AddOrUpBanner:{
              method: "post",
              requestUrl: urlConfig + "Psy/v3/Banner/AddOrUpBanner",
              requestParams: function (params) {
                  return {
                      ID: params[0],
                      Pic: params[1],
                      Url: params[2],
                      SDate: params[3],
                      EDate: params[4]
                  };
              },
              requestPost: function (params) {
                  return {
                      token: params[0]
                  };
              }
          },
            // 获取banner分页,PC管理
          _GetBannerPage:{
              method: "get",
              requestUrl: urlConfig + "Psy/v3/Banner/GetBannerPage",
              requestParams: function (params) {
                  return {
                      token: params[0],
                      pSize: params[1],
                      pIndex:params[2]
                  };
              }
          }
        },
        // 心理测试任务
        _psyTestTask:{

            //获取学校已授权的量表下拉列表
            _GetAccreditedScaleItemModelListBySchool:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Scale/GetAccreditedScaleItemModelListBySchool",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        schoolID:params[1]
                    };
                }
            },
            // 新增测试任务
            _AddOrUpdateScaleTestTask:{
                method: "post",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/AddOrUpdateScaleTestTask",
                requestParams: function (params) {
                    return {
                        ScaleTestTask: params[0],
                        TaskSendRangList:params[1]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            // 获取学校下面的教职工列表
            _GetGroupStaffs:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Base/GetGroupStaffs",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid:params[1]
                    };
                }
            },
            // 是否展示简单报告
            _SetTestedRecordShowSimpleReuslt:{
                method: "post",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/SetTestedRecordShowSimpleReuslt",
                requestParams: function (params) {
                    return {

                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0],
                        testRecordID:params[1],
                        isShow:params[2]
                    };
                }
            },
            //  获取学校测试任务分页列表
            _GetScaleTestTaskPage:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/GetScaleTestTaskPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageIndex:params[1],
                        pageSize:params[2],
                        schoolID:params[3],
                        testTaskName:params[4],
                        status:params[5]
                    };
                }
            },
            // 设置学校测试任务发布状态
            _SetScaleTestTaskPublishStatus:{
                method: "post",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/SetScaleTestTaskPublishStatus",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        scaleTestTaskID: params[1],
                        status: params[2]
                    };
                }
            },
            //获取单条学校测试任务
            _GetScaleTestTask:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/GetScaleTestTask",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        scaleTestTaskID: params[1]
                    };
                }
            },
            // 判断学校任务是否能删除
            _JudgeScaleTestTaskCanDelete:{
                method: "post",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/JudgeScaleTestTaskCanDelete",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        scaleTestTaskID: params[1]
                    };
                }
            },
            //删除学校测试任务
            _DeleteScaleTestTask:{
                method: "post",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/DeleteScaleTestTask",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        scaleTestTaskID: params[1]
                    };
                }
            },
            // 获取学校测试任务未完成的用户信息分页列表
            _GetUnTestedUserInfoPage:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/GetUnTestedUserInfoPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageIndex: params[1],
                        pageSize: params[2],
                        scaleTestTaskID: params[3],
                        classID: params[4],
                        studentName: params[5]
                    };
                }
            },
            // 获取学校测试任务已完成的用户信息分页列表
            _GetTestedUserInfoPage:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/GetTestedUserInfoPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageIndex: params[1],
                        pageSize: params[2],
                        scaleTestTaskID: params[3],
                        classID: params[4],
                        studentName: params[5]
                    };
                }
            },
            // 获取学校测试任务完成情况统计报表
            _QueryScaleTestTaskFinishReport:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/QueryScaleTestTaskFinishReport",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        schoolID: params[1],
                        scaleTestTaskID: params[2]
                    };
                }
            },
            // 获取学校测试任务列表，查询条件使用
            _GetSchoolScaleTestTaskList:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/GetSchoolScaleTestTaskList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        schoolID: params[1]
                    };
                }
            },
            // 获取用户测试详细结果
            _GetTestRecordResult:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/ScaleTestTask/GetTestRecordResult",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        testRecordID: params[1]
                    };
                }
            }
        },
        //心理领域
        _PsychologicalDomain: {
            //获取所有心理领域
            _GetPsyAreaList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Base/GetPsyAreaList",
                requestParams: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            // 添加或修改心理领域
            _AddOrUpdateScale: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Base/AddOrUpPsyArea",
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        Name: params[1]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            }
        },
        // 心理属性
        _PsychologicalAttribute: {
            //获取所有心理属性
            _GetPsyAttrList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Base/GetPsyAttrList",
                requestParams: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            // 添加或修改心理属性
            _AddOrUpPsyAttr: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Base/AddOrUpPsyAttr",
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        Name: params[1],
                        PsyAreaID: params[2],
                        PsyAreaName: params[3]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            }
        },
        //专家团队
        _ExpertTeam: {
            //获取专家分页
            _GetExpertPage: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Expert/GetExpertPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pSize: params[1],
                        pIndex: params[2],
                        name: params[3],
                        psyOrgID: params[4]
                    };
                }
            },
            //获取机构分页
            _GetPsyOrgPage: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Expert/GetPsyOrgPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pSize: params[1],
                        pIndex: params[2],
                        name: params[3]
                    };
                }
            },
            //获取全部心理机构（查询使用）
            _GetAllPsyOrgList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Expert/GetAllPsyOrgList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                    };
                }
            },

            //获取单个心理机构详情
            _GetPsyOrg: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Expert/GetPsyOrg",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        psyOrgID: params[1]
                    };
                }
            },
            //获取专家详情
            _GetExpert: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Expert/GetExpert",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        expertID: params[1]
                    };
                }
            },
            //图片文件上传
            _ImageRegistrationUpload: {
                method: "post",
                requestUrl: urlConfig + 'base/v3/OpenApp/UploadAttachment?attachmentStr={"Path":"ocs/StuImg","AttachType":1,"ExtName":".jpg","ResizeMode":1,"SImgResizeMode":2,"CreateThumb":true,"LImgMaxWidth":100,"LImgMaxHeight":100,"SImgMaxHeight":50,"SImgMaxWidth":50}&token=' + APPMODEL.Storage.getItem('applicationToken'),
                requestParams: function (params) {
                    return params;
                }
            },
            //删除单个心理机构
            _DeletePsyOrg: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Expert/DeletePsyOrg",

                requestPost: function (params) {
                    return {
                        token: params[0],
                        psyOrgID: params[1]
                    }
                }
            },
            //获取省市
            _GetRegionList: {
                method: "get",
                requestUrl: urlConfig + "base/v3/Common/GetRegionList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        rid: params[1]
                    };
                }
            },
            //获取所有心理领域
            _GetPsyAreaList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Base/GetPsyAreaList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                    };
                }
            },
            //获取系统角色
            _GetExpertRoleList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/Expert/GetExpertRoleList",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        type: params[1]
                    };
                }
            },
            //新增或修改机构
            _AddOrUpPsyOrg: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Expert/AddOrUpPsyOrg",
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        Name: params[1],
                        Desc: params[2],
                        CRID: params[3],
                        CRName: params[4],
                        PRID: params[5],
                        PRName: params[6],
                        ST: params[7]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //新增或修改专家
            _AddOrUpExpert: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/Expert/AddOrUpExpert",
                requestParams: function (params) {
                    return params;
                    // {
                    //   ID: params[0],
                    //   PsyOrgID: params[1],
                    //   PsyOrgName: params[2],
                    //   PRID: params[3],
                    //   PRName: params[4],
                    //   CRID: params[5],
                    //   CRName: params[6],
                    //   Name: params[7],
                    //   Tel: params[8],
                    //   Pic: params[9],
                    //   Qualification: params[10],
                    //   PsyAreas: params[11],
                    //   Intro: params[12],
                    //   Therapy: params[13],
                    //   ConsultingStyle: params[14],
                    //   ConsultingHours: params[15],
                    //   ProfessionalGrowth: params[16],
                    //   TrainingExperience: params[17],
                    //   Publication: params[18],
                    //   Cont: params[19],
                    //   Seq: params[20],
                    //   ST: params[21],
                    //   Roles: params[22],
                    // };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            }
        },
        //心理功能开通
        _MentalOpen:{
            // 获取开通心理应用的学校
            _GetPsyGroupPage:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/PsyGroup/GetPsyGroupPage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pSize: params[1],
                        pIndex: params[2],
                        gid: params[3],

                    };
                }
            },
            // 修改学校心理应用信息
            _SavePsyGroup:{
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyGroup/SavePsyGroup",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        WebSiteUrl: params[1],
                    };
                },
                requestPost:function (params) {
                    return {
                        token:params[0]
                    }
                }
            },
            // 获取所有网站模板
            _GetCmsTemplate:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/PsyGroup/GetCmsTemplate",
                requestParams: function (params) {
                    return {
                        token: params[0],
                    };
                }
            },
            // 开通学校心理应用，接收到返回值之后，弹出 UpdateCacheUrl
            _OpenPsyGroup:{
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyGroup/OpenPsyGroup",
                requestParams: function (params) {
                    return {
                        GID: params[0],
                        GName: params[1],
                        WebSitedir: params[2],
                        WebSiteTemplate: params[3],
                        WebSiteUrl: params[4],
                    };
                },
                requestPost:function (params) {
                    return {
                        token:params[0]
                    }
                }
            },
            //获取学校心理管理员列表
            _GetSchoolPsyManagers:{
                method: "get",
                requestUrl: urlConfig + "Psy/v3/PsyGroup/GetSchoolPsyManagers",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1]
                    };
                }
            },
            //添加学校心理管理员
            _AddPsyManage: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyGroup/AddPsyManager",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        mid:params[1]
                    };
                }
            },
            //删除学校心理管理员
            _DeleteQuestion: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyGroup/DelPsyManager",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        mid: params[1]
                    };
                }
            },
            //获取服务包列表
            _GetPsyChargePage: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/PsyCharge/GetPsyChargePage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageSize: params[1],
                        pageIndex: params[2],
                        name: params[3],
                    };
                }
            },
            // 添加或修改心理服务包AddOrUpCourse
            _AddOrUpdatePsyCharge:{
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyCharge/AddOrUpdatePsyCharge",
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        Name: params[1],
                        Pic: params[2],
                        Description: params[3],
                        Detail: params[4],
                        IsPrice: params[5],
                        Prices: params[6],
                        Price: params[7],
                        Type: params[8],
                        ST: params[9],
                        CDateTime: params[10],
                        UDateTime: params[11],
                        IsBanner: params[12]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //删除心理服务包
            _DeletePsyCharge: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyCharge/DeletePsyCharge",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        psyChargeID: params[1]
                    };
                }
            },
            //设置心理服务包发布状态
            _SetPsyChargePublishStatue: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyCharge/SetPsyChargePublishStatue",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        psyChargeID: params[1],
                        status: params[2]
                    };
                }
            },
            // 获取单个服务包详情
            _GetPsyChargeDetails: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/PsyCharge/GetPsyCharge",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        psyChargeID: params[1]
                    };
                }
            },
            // 获取心理服务包指定服务类型服务项清单
            _GetPsyChargeAndItems: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/PsyCharge/GetPsyChargeAndItems",
                    requestParams: function (params) {
                    return {
                        token: params[0],
                        psyChargeID: params[1],
                        serviceType: params[2]
                    };
                }
            },
            //新增或修改心理服务包服务项
            _AddOrUpdatePsyChargeItems: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyCharge/AddOrUpdatePsyChargeItems",
                requestParams: function (params) {
                    return {
                        ID: params[0],
                        PsyChargeID: params[1],
                        Seq: params[2],
                        ServiceID: params[3],
                        ServiceType: params[4],
                        ServiceName: params[5],
                        ServicePic: params[6]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //删除心理服务包服务项
            _DeletePsyChargeItem: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyCharge/DeletePsyChargeItem",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        psyChargeItemID: params[1]
                    };
                }
            },

        },
        //学校心理服务包开通
        _SchoolPackageOpen: {
            //获取已发布的心理服务包下拉列表
            _GetPublishedPsyChargeItemList: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/PsyCharge/GetPublishedPsyChargeItemList",
                requestParams: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //获取学校心理服务包开通规则分页列表
            _GetPsyChargeRulePage: {
                method: "get",
                requestUrl: urlConfig + "Psy/v3/PsyChargeRule/GetPsyChargeRulePage",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        pageIndex: params[1],
                        pageSize: params[2],
                        gid: params[3]
                    };
                }
            },
            // 根据学校id+funcid获取优信收费服务包列表
            _GetChargeListByFuncID: {
                method: "get",
                requestUrl: urlConfig + "Charge/v3/Charge/GetChargeListByFuncID",
                requestParams: function (params) {
                    return {
                        token: params[0],
                        gid: params[1],
                        funcid: params[2]
                    };
                }
            },
            //添加学校心理服务包开通规则
            _AddPsyChargeRule: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyChargeRule/AddPsyChargeRule",
                requestParams: function (params) {
                    return {
                        // ID: params[0],
                        PsyChargeID: params[0],
                        PsyChargeName: params[1],
                        ChargeID: params[2],
                        ChargeName: params[3],
                        GID: params[4],
                        GName: params[5],
                        CDate: params[6]
                    };
                },
                requestPost: function (params) {
                    return {
                        token: params[0]
                    };
                }
            },
            //删除心理服务包开通规则
            _DeletePsyChargeRule: {
                method: "post",
                requestUrl: urlConfig + "Psy/v3/PsyChargeRule/DeletePsyChargeRule",
                requestPost: function (params) {
                    return {
                        token: params[0],
                        psyChargeRuleID: params[1]
                    };
                }
            },
        }

    };
}]);
