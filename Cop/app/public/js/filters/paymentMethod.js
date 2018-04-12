/**
 * Created by WangQiHan on 2016/8/30.
 * Payment Method Format
 */
app.filter('paymentMethodFilter', function () {
    return function (val, key) {
        var paymentMethod = [
            { name: '未支付', ident: 'Unpay', enumValue: -2 },
            { name: '赠送', ident: 'Give', enumValue: -1},
            { name: '支付宝手机支付', ident: 'Alipay', enumValue: 0},
            { name: '支付宝手机网页支付', ident: 'AlipayWap', enumValue: 1 },
            { name: '支付宝扫码支付', ident: 'AlipayQr', enumValue: 2 },
            { name: '支付宝 PC 网页支付', ident: 'AlipayPcDirect', enumValue: 3 },
            { name: '百度钱包移动快捷支付', ident: 'Bfb', enumValue: 4 },
            { name: '百度钱包手机网页支付', ident: 'BfbWap', enumValue: 5},
            { name: '银联全渠道支付', ident: 'Upacp', enumValue: 6},
            { name: '银联全渠道手机网页支付', ident: 'UpacpWap', enumValue: 7 },
            { name: '银联 PC 网页支付', ident: 'UpacpPc', enumValue: 8},
            { name: '银联企业网银支付', ident: 'CpB2b', enumValue: 9},
            { name: '微信支付', ident: 'Wx', enumValue: 10 },
            { name: '微信公众账号支付', ident: 'WxPub', enumValue: 11},
            { name: '微信公众账号扫码支付', ident: 'WxPubQr', enumValue: 12},
            { name: '易宝手机网页支付', ident: 'YeepayWap', enumValue: 13 },
            { name: '京东手机网页支付', ident: 'JdpayWap', enumValue: 14},
            { name: '应用内快捷支付（银联）', ident: 'CnpU', enumValue: 15},
            { name: '应用内快捷支付（外卡）', ident: 'CnpF', enumValue: 16 },
            { name: 'Apple Pay', ident: 'ApplepayUpacp', enumValue: 17}
        ];

        for (var i = 0; i < paymentMethod.length; i++) {
            if (paymentMethod[i].enumValue == val) {
                return  paymentMethod[i][key];
            }
        }
    }
});