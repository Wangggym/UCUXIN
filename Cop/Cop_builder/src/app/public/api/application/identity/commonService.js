/**
 * Created by QiHan Wang on 2017/5/16.
 * 公共服务模块
 * 用于各模块间公用 API 服务接口。例如：学校、班级、学生查询等
 */
app.factory('commonService', [function () {
  var service = {};
  // 带OpenApp的接口都是用的应用token
  // 学校、班级、学生类
  var schoolApi = function () {
    return {
      // 获取当前用户学校列表( 模糊查询 )
      getFuzzySchoolList: {
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
        requestParams: function (params) {
          return {
            token: params[0],
            keyWord: params[1]
          };
        }
      },
      //获取学校下的班级集合
      getSchClasses: {
        method: "get",
        //requestUrl: urlConfig + "sns/v3/OpenApp/GetSchClasses",
        requestUrl: urlConfig + 'Charge/v3/Charge/GetClassList',
        requestParams: function (params) {
          return {
            token: params[0],
            gid: params[1]
          };
        }
      },
      // 获取学校下的班级集合（新）
      GetSchClassesNew:{
          method: "get",
          requestUrl: urlConfig + 'sns/v3/OpenApp/GetSchClasses',
          requestParams: function (params) {
              return {
                  token: params[0],
                  gid: params[1]
              };
          }
      },
      // 获取机构下的教职员工群组集合
      GetStaffGroups: {
          method: "get",
          requestUrl: urlConfig + 'sns/v3/OpenApp/GetStaffGroups',
          requestParams: function (params) {
              return {
                  token: params[0],
                  gid: params[1]
              };
          }
      },
      //获取云集合
      GetCloudList:{
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCloudList",
        requestParams: function (params) {
          return {
            token: params[0]
          };
        }
      },
      //获取教育阶段
      GetPhaseList:{
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetPhaseList",
        requestParams: function (params) {
          return {
            token: params[0],
            gID: params[1]
          };
        }
      },
      // 获取学校 根据关键字
      GetCompanysByKeyWord:{
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetCompanysByKeyWord",
        requestParams: function (params) {
          return {
            token: params[0],
            keyWord: params[1],
            cloudID: params[2],
            ptnID: params[3],
          };
        }
      },
      //获取角色
      GetRoleTypeTree:{
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetRoleTypeTree",
        requestParams: function (params) {
          return {
            token: params[0],
          };
        }
      },
      //获取机构类型
      GetGroupTypeList:{
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetGroupTypeList",
        requestParams: function (params) {
          return {
            token: params[0],
            level:params[1],
            pGTypeID:params[2],
          };
        }
      },
      //获取学校下的年级集合
      GetSchGrades:{
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetSchGrades",
        requestParams: function (params) {
          return {
            token: params[0],
            gID: params[1],
          };
        }
      },
      //获取学校下的班级集合
      GetSchClassesByKey:{
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetSchClasses",
        requestParams: function (params) {
          return {
            token: params[0],
            gID: params[1],
            keyword:params[2],
            cnt:params[3],
          };
        }
      },

      //获取不全手机号码
      GetUserByTel:{
        method: "get",
        requestUrl: urlConfig + "base/v3/OpenApp/GetUserByTel",
        requestParams: function (params) {
          return {
            token: params[0],
            tel: params[1],
          };
        }
      },

      //获取年级段
      GetGradeTypeList:{
        method: "get",
        requestUrl: urlConfig + "sns/v3/OpenApp/GetGradeTypeList",
        requestParams: function (params) {
          return {
            token: params[0],
          };
        }
      },

    }
  };
  service.schoolApi = schoolApi();
  return service;
}]);
