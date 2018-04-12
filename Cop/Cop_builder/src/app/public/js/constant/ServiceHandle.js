/**
 * Created by Wang QiHan on 2016/11/24.
 */

var ServiceHandle = function() {
  this.page = {

  }
};

// ServiceHandle.prototype.service = function(appServiceSet, type, model, method, arr, list, fn) {
ServiceHandle.prototype.service = function(obj, config) {

  var apiService = {
    api: 'applicationServiceSet',
    type: 0,
    module: 'userManagementInstitution'
  },
    conf = {
      method: null,
      arr: [],
      list: [],
      callback:callback
    };

  apiService = angular.extend(api,obj);
  conf = angular.extend(config, config);

  var serviceType = ['internalServiceApi'];

  if(Object.prototype.toString.call(conf.list) === '[object Function]'){
    conf.callback = conf.list;
    conf.list = undefined;
  }

  apiService.api[serviceType[apiService.type]][api.module][conf.method].send(conf.arr, conf.list).then(conf.callback);
};

ServiceHandle.prototype.getSchool = function (method, arr, fn) {
  this.service({},method, arr, fn);
}

angular.service('ServiceHandle', ServiceHandle);