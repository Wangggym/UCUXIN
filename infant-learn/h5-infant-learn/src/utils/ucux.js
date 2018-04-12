/**
 * Created by xj on 2017/10/23.
 * ucux
 */
export default class Ucux{
  static getQRCode(callback){
    this.qrCallback = callback;
    window.location.href ='ucux://getqrcode?callback=onGetQRCode';
  }
  static signInGetQRCodeMethod(){
    window.onGetQRCode = dataStr=> {
      if(this.qrCallback){
        this.qrCallback(dataStr);
        this.qrCallback = null;
      }
    }
  }
}
