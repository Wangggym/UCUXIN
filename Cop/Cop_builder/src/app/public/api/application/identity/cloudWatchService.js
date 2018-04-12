/**
 * Created by QiHan Wang on 2017/5/16.
 * 云监控模块 API 集合
 * 包括内部运营与合作伙伴，根据不同身份类弄验证
 */

app.factory('cloudWatchService', [function () {
  return {
    cloudWatchApi: {
      // 根据学校gid获取学校云监控参数
      GetGrpSetting: {
        method: "get",
        requestUrl: urlConfig + "nvr/v3/OpenCop/GetGrpSetting",
        requestParams: function (params) {
          return {
            token: params[0],
            gID: params[1],
            EName: params[2]
          };
        }
      },
      //保存学校云监控参数
      SaveGrpSetting: {
        method: "post",
        requestUrl: urlConfig + "nvr/v3/OpenCop/SaveGrpSetting",
        requestParams: function (params) {
          return {
            TryMinutes: params[0]
          };
        },
        requestPost: function (params) {
          return {
            token: params[0],
            gID: params[1]
          }
        }
      },
      // 运营平台获取学校设备列表
      getCopCameraList: {
        method: 'get',
        requestUrl: urlConfig + 'nvr/v3/OpenCop/GetCopCameraList',
        requestParams: function (params) {
          return {
            token: params[0],
            gID: params[1],
            keyword: params[2]
          };
        }
      },
      // 导入设备及规则
      importCopCameras: {
        method: 'post',
        requestUrl: urlConfig + 'nvr/v3/OpenCop/ImportCopCameras',
        requestParams: function (params) {
          return params;
        },
        requestPost: function (params) {
          return {
            token: params[0],
            gID: params[1]
          };
        }
      },
      // 批量删除设备及规则
      deleteCopCameras : {
        method: 'post',
        requestUrl: urlConfig + 'nvr/v3/OpenCop/DeleteCopCameras',
        requestParams: function (params) {
          return params
        },
        requestPost: function (params) {
          return {
            token: params[0]
          };
        }
      },
      // 运营平台获取学校单个设备
      getCopCamera : {
        method: 'get',
        requestUrl: urlConfig + 'nvr/v3/OpenCop/GetCopCamera',
        requestParams: function (params) {
          return {
            token: params[0],
            id: params[1]
          };
        }
      },
      // 运营平台保存学校单个设备
      saveCopCamera: {
        method: 'post',
        requestUrl: urlConfig + 'nvr/v3/OpenCop/SaveCopCamera',
        requestParams: function (params) {
          return params;
        },
        requestPost: function (params) {
          return {
            token: params[0],
            gID: params[1]
          };
        }
      },

      // 批量设置定时推流
      batchSetCopCameraPubTime: {
        method: 'post',
        requestUrl: urlConfig + 'nvr/v3/OpenCop/BatchSetCopCameraPubTime',
        requestParams: function (params) {
          return params;
        },
        requestPost: function (params) {
          return {
            token: params[0]
          };
        }
      }
    }
  }
}]);
