import $ from 'jquery';
import {Toast} from 'antd-mobile';
import './pay.scss'
var configPayUrl = {
    url: "http://api.test.ucuxin.com/",//测试
    // url: "http://api.ucuxin.com/",//正式
    payHrefUrl: 'http://pay.ucuxin.com/paytest/thirdPartyPayment',//测试--文件的引入
    // payHrefUrl: 'http://pay.ucuxin.com/pay/thirdPartyPayment',//正式--文件的引入
    RedirectUri: 'http://pay.ucuxin.com/paytest/thirdPartyPayment/getWeChat.html',//测试--微信支付完成的前置接口
    // RedirectUri: 'http://pay.ucuxin.com/pay/thirdPartyPayment/getWeChat.html',//正式--微信支付完成的前置接口
    aliPayWeChatUrl: 'http://pay.ucuxin.com/paytest/thirdPartyPayment/aliPayWeChat.html'//测试--在微信内用支付宝支付
    // aliPayWeChatUrl: 'http://pay.ucuxin.com/pay/thirdPartyPayment/aliPayWeChat.html'//正式--在微信内用支付宝支付
};

var Pay_Party_Payment = {
  //记录请求延迟次数
    payIndex: 0,
  //用户基本信息
  userInformation: {},
    //入口
    init: function () {

        this.systemJudge() ? this.getUserInformation() : '';
        this.sendService();//遍历公共服务，赋予ajax请求
    },
    //弹出支付方式
    changePayType: function (params) {
        if (!params) {
            Toast.fail('无支付参数');
            return;
        }
        var payContent = this.judgeAppVersion() ? $('<div id="p_one_frame" style="display:block;" class="p_one_open"><div id="p_one_mask" class="p_one_mask"></div>' +
            '<div class="p_one_window"><div class="p_one_html"><div class="p_one_body"><div class="p_one_channel">' +
            '<div id="aliPay" class="p_one_btn weui-cell_access"><span class="channel-icon ali"></span><div class="p_one_icon_alipay">支付宝</div></div>' +
            '<div id="unionPay" class="p_one_btn weui-cell_access"><div class="p_one_icon_unionpay">银联支付</div></div>' +
            '</div></div></div></div></div>') : $('<div id="p_one_frame" style="display:block;" class="p_one_open"><div id="p_one_mask" class="p_one_mask"></div>' +
            '<div class="p_one_window"><div class="p_one_html"><div class="p_one_body"><div class="p_one_channel">' +
            '<div id="weiXinApp" class="p_one_btn weui-cell_access"><div><div class="p_one_icon_alipay"><img src="http://pay.ucuxin.com/pay/img/weixin.png"><span>微信支付</span></div></div></div>' +
            '<div id="aliPay" class="p_one_btn weui-cell_access"><span class="channel-icon ali"></span><div class="p_one_icon_alipay" style="padding-left: 0"><span style="padding-left: 0.33rem">&nbsp;&nbsp;支付宝&nbsp;&nbsp;</span></div></div>' +
            '<div id="unionPay" class="p_one_btn weui-cell_access"><div class="p_one_icon_unionpay" style="padding-left: 0"><span style="padding-left: 0.33rem">银联支付</span></div></div>' +
            '</div></div></div></div></div>');
        $('#p_one_frame').addClass('p_one_open').css({'display': 'block'});
        $('body').append(payContent);
        setTimeout(function () {
            $('.p_one_html').addClass('in');
        }, 10);
        $('#p_one_mask').off('click').on('click', function () {
            $('.p_one_html').removeClass('in');
            setTimeout(function () {
                $('#p_one_frame').remove();
            }, 300);
        });
        params.Channel = '';
        params.Currency = 'cny';
        Pay_Party_Payment.service.params = params;
        if (this.systemJudge()) {
            Pay_Party_Payment.service.params.UserId = Pay_Party_Payment.userInformation.UserId;
            Pay_Party_Payment.service.params.UserToken = Pay_Party_Payment.userInformation.UserToken;
        }
        this.service.getSign(params);//获得签名值
    },
    // 页面固定支付方式
    directPay:function (params) {
      params.Currency = 'cny';
      Pay_Party_Payment.service.params = params;
      // if (this.systemJudge()) {
      //   Pay_Party_Payment.service.params.UserId = Pay_Party_Payment.userInformation.UserId;
      //   Pay_Party_Payment.service.params.UserToken = Pay_Party_Payment.userInformation.UserToken;
      //   Pay_Party_Payment.service.params.CloudID = Pay_Party_Payment.userInformation.CloudID;
      // }
      (params.Channel === 10) ? Pay_Party_Payment.service.getWxOauth(10):Pay_Party_Payment.service.beforeGenerate(params.Channel);
    },
    //选择支付方式
    selectPayType: function () {
        //微信支付
        $('#weiXinApp').off('click').on('click', function () {
            Pay_Party_Payment.systemJudge() ? Pay_Party_Payment.service.beforeGenerate(10) : Pay_Party_Payment.service.getWxOauth(11);
        });
        //支付宝支付
        $('#aliPay').off('click').on('click', function () {
            Pay_Party_Payment.service.beforeGenerate(1);//验证签名
        });
        //银联支付
        $('#unionPay').off('click').on('click', function () {
            if (parseFloat(Pay_Party_Payment.service.params.Amount) < 0.1) {
                Toast.fail('银联支付必须大于或等于0.1元');
                return;
            }
            Pay_Party_Payment.service.beforeGenerate(7);//验证签名
        });
    },
    //系统判断
    systemJudge: function () {
        return window.navigator.userAgent.indexOf('UCUX_WebBrowser') != -1;
    },
    //操作系统判断
    navigator: function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if (isAndroid) {
            return 1;
        }
        if (isiOS) {
            return 2;
        }
    },
    //版本判断
    judgeAppVersion: function () {
        if (!Pay_Party_Payment.userInformation.CurAppVer) {
            return false;
        }
        var number = Pay_Party_Payment.userInformation.CurAppVer.split('.');
        var version = parseInt(number[0] + number[1] + number[2]);
        // android
        if (this.navigator() == 1 && version < 30612261) {
            return true;
        }
        // ios
        else if (this.navigator() == 2 && version < 30612081) {
            return true;
        }
        return false;
    },
    //如果是用优课优信打开支付功能，则获取用户信息
    getUserInformation: function () {
        window.location.href = "ucux://getappinfo?callback=ongetappinfo";
        window.ongetappinfo = function (dataStr) {
            var data = eval('(' + dataStr + ')');
            Pay_Party_Payment.userInformation = {
                UserId: data.UserID,
                UserToken: data.AccessToken,
                CurAppVer: data.CurAppVer,
                CloudID:data.AppCloudID,
            };
        }
    },
    //判断是否是在微信内部的浏览器
    isWeChat: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == 'micromessenger';
    },
    //服务
    service: (function () {
        return {
            chargeID: '',//支付ID
            params: {},
            //获得签名值
            getSign: function (params) {
                if (params.Sign) {
                    Pay_Party_Payment.service.params.Sign = params.Sign;
                    Pay_Party_Payment.selectPayType();//选择支付方式
                } else {
                    Toast.fail('没有签名值');
                }
            },
            //验证签名
            beforeGenerate: function (type) {
                this.params.Channel = type;
                Pay_Party_Payment.publicObjService.BeforeGenerate.send(this.params, undefined, function (data) {
                    console.info(data);
                    if (data.Ret == 0) {
                        Pay_Party_Payment.service.chargeID = data.Data;
                        if (type != 10) {
                            if (Pay_Party_Payment.isWeChat() && type == 1) {
                                window.location.href = configPayUrl.aliPayWeChatUrl + '?chargeID=' + Pay_Party_Payment.service.chargeID;
                                return;
                            }
                            Pay_Party_Payment.service.unionAliPay();//支付宝和银联支付
                        } else {
                            Pay_Party_Payment.systemJudge() ? window.window.location.href = 'ucux://pay?uxpayid=' + data.Data : '';
                        }
                    }
                });
            },
            //支付宝和银联支付
            unionAliPay: function () {
                Pay_Party_Payment.publicObjService.UnionAliPay.send([Pay_Party_Payment.service.chargeID], undefined, function (data) {
                    if (data.Ret == 0) {
                        if (Pay_Party_Payment.service.params.Channel == 7) {
                            $('body').append(data.Data);
                            document.getElementById("pay_form").submit();
                        } else {
                            $('body').append(data.Data);
                        }
                    }
                });
            },
            //微信支付第一步：获得调用微信认证的url和参数 根据返回的model，调用model中的url获取code，然后调用Generate接口（记得把code赋值）
            getWxOauth: function (type) {
                this.params.RedirectUri = configPayUrl.RedirectUri;
                this.params.Channel = type;
                Pay_Party_Payment.publicObjService.GetWxOauth.send(this.params, undefined, function (data) {
                    if (data.Ret == 0) {
                        window.location.href = data.Data;
                    }
                });
            }
        };
    })(),
    //服务接口定义
    publicObjService: (function () {
        return {
            //验证签名
            BeforeGenerate: {
                method: "post",
                requestUrl: configPayUrl.url + "Pay/v3/Pay/BeforeGenerate",
                requestParams: function (params) {
                    return params;
                },
                requestPost: function (params) {
                    return {
                        UserToken: params[0]
                    };
                }
            },
            //支付宝和银联支付
            UnionAliPay: {
                method: "get",
                requestUrl: configPayUrl.url + "Pay/v3/Pay/Generate",
                requestParams: function (params) {
                    return {
                        chargeID: params[0]
                    };
                }
            },
            //微信支付第一步：获得调用微信认证的url和参数 根据返回的model，调用model中的url获取code，然后调用Generate接口（记得把code赋值）
            GetWxOauth: {
                method: "post",
                requestUrl: configPayUrl.url + "Pay/v3/Pay/GetWxOauth",
                requestParams: function (params) {
                    return params;
                }
            }
        }
    })(),
    //遍历公共服务，赋予ajax请求
    sendService: function () {
        for (var i in Pay_Party_Payment.publicObjService) {
            Pay_Party_Payment.publicObjService[i].send = Pay_Party_Payment.send;
        }
    },
    judgeWait: false,
    //服务请求
    send: function (params, list, callBack) {
        var serviceApiObj = this;
        var httpRequest = {
            url: serviceApiObj.requestUrl,
            type: serviceApiObj.method,
            dataType: "json",
            async: !serviceApiObj.async,
            data: params ? serviceApiObj.requestParams(params) : undefined,
            success: function (data) {
                Pay_Party_Payment.judgeWait = true;
                Toast.hide();
                if (data.Ret != 0) {
                    Toast.fail(data.Msg);
                    return;
                }
                callBack(data);
            },
            error: function (err) {
                Pay_Party_Payment.judgeWait = true;
                Toast.hide();
                Toast.fail('服务错误');
            }
        };
        if (serviceApiObj.requestPost && list && list != "") {
            var requestPost = serviceApiObj.requestPost(list);
            if (httpRequest.url.indexOf('?') == -1) {
                for (var i in requestPost) {
                    if (httpRequest.url.indexOf('?') != -1) {
                        httpRequest.url += '&' + i + '=' + requestPost[i];
                    } else {
                        httpRequest.url += '?' + i + '=' + requestPost[i];
                    }
                }
            } else {
                for (var s in requestPost) {
                    httpRequest.url += '&' + s + '=' + requestPost[s];
                }
            }
        }
        try {
            Toast.loading("",999);
            $.ajax(httpRequest);
        } catch (e) {
            Toast.hide();
            console.log(e);
        }
    }
};
export default Pay_Party_Payment;
