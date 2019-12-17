// 获取Token服务
export default class Token {
  // 发起Token获取
  static getAppInfo(callback) {
    this.func = callback;
    window.location.href = "ucux://getappinfo?callback=ongetappinfo";
  }

  // 注册window回调
  static registerWinGetApp() {
    window.ongetappinfo = dataStr => {
      let data = JSON.parse(dataStr);
        sessionStorage.setItem('UCUX_OCS_AccessToken', data.AccessToken);

      // 注册回调处理
      if (this.func) {
        this.func(data);
        this.func = undefined;
      }
    }
  }
}
