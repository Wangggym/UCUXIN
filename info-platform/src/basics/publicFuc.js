/**
 * Created by Yu Tian Xiong on 2017/1/24.
 * file:公共函数
 */

export default class PublicFuc {

  //枚举资讯   已发布 未发布 草稿  枚举 列表左上角图标
  static handleContentStatus(ContentStatus) {
    let content = '';
    switch (ContentStatus) {
      case 0:
        content = require('../assets/images/Draft.png');
        break;
      case 1:
        content = require('../assets/images/Aprroving.png');
        break;
      case 2:
        content = require('../assets/images/AprroveNo.png');
        break;
      case 3:
        content = require('../assets/images/EditPublish.png');
        break;
      case 5:
        content = require('../assets/images/TimerPublishing.png');
        break;
      case 8:
        content = require('../assets/images/complete.png');
        break;
      case 9:
        content = require('../assets/images/Closed.png');
        break;
      case 11:
        content = require('../assets/images/end.png');
        break;
    }
    return content;
  };

  //枚举内容库 专栏状态  已发布 未发布 草稿  枚举 列表左上角图标
  static handleContent(ContentStatus) {
    let content = '';
    switch (ContentStatus) {
      case 0:
        content = require('../assets/images/notRlease.png');
        break;
      case 1:
        content = require('../assets/images/Aprroving.png');
        break;
      case 2:
        content = require('../assets/images/AprroveNo.png');
        break;
      case 3:
        content = require('../assets/images/EditPublish.png');
        break;
      case 5:
        content = require('../assets/images/TimerPublishing.png');
        break;
      case 8:
        content = require('../assets/images/complete.png');
        break;
      case 9:
        content = require('../assets/images/Closed.png');
        break;
      case 11:
        content = require('../assets/images/end.png');
        break;
    }
    return content;
  };

  //枚举电子书左上角图标
  static handleBook(ContentStatus) {
    let content = '';
    switch (ContentStatus) {
      case 0:
        content = require('../assets/images/Noton.png');
        break;
      case 1:
        content = require('../assets/images/Aprroving.png');
        break;
      case 2:
        content = require('../assets/images/AprroveNo.png');
        break;
      case 3:
        content = require('../assets/images/EditPublish.png');
        break;
      case 5:
        content = require('../assets/images/TimerPublishing.png');
        break;
      case 8:
        content = require('../assets/images/HasBeenon.png');
        break;
      case 9:
        content = require('../assets/images/off.png');
        break;
      case 11:
        content = require('../assets/images/end.png');
        break;
    }
    return content;
  };

  //操作资讯内容类型
  static handleContentType = (ContentType) => {
    let content = '';
    switch (ContentType) {
      case 0:
        content = '无';
        break;
      case 11:
        content = '文章';
        break;
      case 12:
        content = '话题';
        break;
      case 13:
        content = '图集';
        break;
      case 14:
        content = '宣传';
        break;
      case 21:
        content = '专栏';
        break;
      case 22:
        content = '专栏小集';
        break;
      case 23:
        content = '电子书';
        break;
      case 25:
        content = '实物商品';
        break;
      case 24:
        content = '直播';
        break;
      case 99:
        content = '评论';
        break;
    }
    return content;
  };
  //截取前两百个字符
  static changeString = (str) => {
    let dd = str.replace(/<\/?.+?>/g, "");
    let dds = dd.replace(/&nbsp;/ig, "");//去掉html标签
    let strOne = dds.substr(0, 200);
    if (strOne.replace(/[^\x00-\xff]/g, "01").length > 200) {
      strOne = strOne + '......'
    }
    return strOne;
  };

  //插入专栏html模板
  static insertColumTemplate = (data) => {
    let ColumTemplate =
      `<div style="position:relative; padding:5px 10px;border:1px solid #ddd;" class="sb" ><div><p style="height:18px;overflow:hidden;position:relative;font-weight:900;text-indent:0px"><span>【专栏】</span><span>${data.Title}</span><a class="dotDelete" title="点击删除" style="position:absolute;top:0;right:0px;font-family:Arial Black;color:#999;z-index:999;width:20px;height:20px;background:#999;border-radius:100%;text-align:center;line-height:20px"><span class="goodOff" style="font-weight:900;cursor:pointer;color:#fff">X</span></a></p><p><a href='${data.Url}'><img src='${data.Img}' alt="" style="width:100%"/></a></p></div></div>`;
    return ColumTemplate;
  };
  //插入实物电子书html模板
  static insertEbookTemplate = (data) => {
    let EbookTemplate =
      `<div style="border:1px solid #ddd;padding:4px 10px;position:relative" ><div style="display:flex;"><div style="width:20%;"><img src='${data.Thumb}' alt="" style="width:100%;"/></div><div style="margin-left:5%;width:75%;position:relative"><a class="dotDelete" title="点击删除" style="position:absolute;top:4px;right:-5px;font-family:Arial Black;color:#999;z-index:999;width:20px;height:20px;background:#999;border-radius:100%;text-align:center;line-height:20px"><span class="goodOff" style="font-weight:900;cursor:pointer;color:#fff">X</span></a><div style="font-weight:900;text-indent:0px;height:38px;overflow:hidden">${handleTitle2(data.Title)}</div><div style="margin-top:20px;color:red;line-height:30px;height:30px;text-indent:0px;width:100%;display: flex;justify-content: space-between;"><span style="">￥${data.SalePrice}【电子书】</span><a href='${data.Url}' style="padding:0px 10px;text-align:center;text-decoration:none;background:red;color:#fff;border-radius:4px;">去购买</a></div></div></div></div>`;
    return EbookTemplate;
  };
  //插入实物商品html模板
   static insertGoodsTemplate = (data) => {
    let GoodsTemplate =
      `<div style="border:1px solid #ddd;padding:4px 10px;position:relative" ><div style="display:flex;"><div style="width:20%;"><img src='${data.Thumb}' alt="" style="width:100%;"/></div><div style="margin-left:5%;width:75%;position:relative"><a class="dotDelete" title="点击删除" style="position:absolute;top:4px;right:-5px;font-family:Arial Black;color:#999;z-index:999;width:20px;height:20px;background:#999;border-radius:100%;text-align:center;line-height:20px"><span class="goodOff" style="font-weight:900;cursor:pointer;color:#fff">X</span></a><div style="font-weight:900;text-indent:0px;height:38px;overflow:hidden">${handleTitle2(data.Title)}</div><div style="margin-top:20px;color:red;line-height:30px;height:30px;text-indent:0px;width:100%;display: flex;justify-content: space-between;"><span style="">￥${data.SalePrice}</span><a href='${data.Url}' style="padding:0px 10px;text-align:center;text-decoration:none;background:red;color:#fff;border-radius:4px;">去购买</a></div></div></div></div>`;
    return GoodsTemplate;
  };

  //插入视频模板
  static insertVideoTemplate = (data) => {
    let VideoTemplate =
      `<div style="width:100%;display:flex;position:relative"><video controls="controls" width="100%" height="240" src='${data.Url}' poster='${data.Thumb}' webkit-playsinline="true" playsinline="true">&nbsp</video></div>`;
    return VideoTemplate;
  };
  //插入音频模板
  static insertMusicTemplate = (data) => {
    let MusicTemplate = `<p><audio controls="controls" src='${data.Url}'>&nbsp</audio></p>`;
    return MusicTemplate;
  };

  //获取文件hashcode
  static hashCode = (file) =>{
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      let fileShay1 = hex_sha1(e.target.result);
      sessionStorage.setItem('hashCode',fileShay1);
    };
  };
  static hash = (file) =>{
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      let fileShay1 = hex_sha1(e.target.result);
      sessionStorage.setItem('hash',fileShay1);
    };
  };

  //切换按钮文字
  static changeText = (type) =>{
    let content = '';
    switch(type){
      case '11':
        content = '新增文章';
        break;
      case '12':
        content = '新增话题';
        break;
      case '13':
        content = '新增图集';
        break;
      case '14':
        content = '新增宣传';
        break;
      case '':
        content = '新增资讯';
        break;
      case 'item_0':
        content = '新增资讯';
        break;
    }
    return content;
  };

}
//枚举  类型 显示不同标题
function handleType(type) {
  let content = '';
  switch (type) {
    case 21:
      content = '关联专栏:';
      break;
    case 23:
      content = '关联电子书:';
      break;
    case 25:
      content = '关联实物商品:';
  }
  return content;
}

//处理名称过长
function handleTitle(title) {
  let Title = title.substr(0);
  if (Title.length > 16) {
    Title = `${Title.substr(0, 8)}...`
  }
  return Title;
}


function handleTitle2(title) {
  let Title = title.substr(0);
  if (Title.length > 30) {
    Title = `${Title.substr(0, 22)}...`
  }
  return Title;
}

var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode */
function hex_sha1(s) {

  return binb2hex(core_sha1(AlignSHA1(s)));

}

/*
 *
 * Perform a simple self-test to see if the VM is working
 *
 */
function sha1_vm_test() {

  return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";

}

/*
 *
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 *
 */
function core_sha1(blockArray) {

  var x = blockArray; // append padding
  var w = Array(80);

  var a = 1732584193;

  var b = -271733879;

  var c = -1732584194;

  var d = 271733878;

  var e = -1009589776;

  for (var i = 0; i < x.length; i += 16) // 每次处理512位 16*32
  {

    var olda = a;

    var oldb = b;

    var oldc = c;

    var oldd = d;

    var olde = e;

    for (var j = 0; j < 80; j++) // 对每个512位进行80步操作
    {

      if (j < 16)
        w[j] = x[i + j];

      else
        w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

      var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));

      e = d;

      d = c;

      c = rol(b, 30);

      b = a;

      a = t;

    }

    a = safe_add(a, olda);

    b = safe_add(b, oldb);

    c = safe_add(c, oldc);

    d = safe_add(d, oldd);

    e = safe_add(e, olde);

  }

  return new Array(a, b, c, d, e);

}

/*
 *
 * Perform the appropriate triplet combination function for the current
 * iteration
 *
 * 返回对应F函数的值
 *
 */
function sha1_ft(t, b, c, d) {

  if (t < 20)
    return (b & c) | ((~b) & d);

  if (t < 40)
    return b ^ c ^ d;

  if (t < 60)
    return (b & c) | (b & d) | (c & d);

  return b ^ c ^ d; // t<80
}

/*
 *
 * Determine the appropriate additive constant for the current iteration
 *
 * 返回对应的Kt值
 *
 */
function sha1_kt(t) {

  return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;

}

/*
 *
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 *
 * to work around bugs in some JS interpreters.
 *
 * 将32位数拆成高16位和低16位分别进行相加，从而实现 MOD 2^32 的加法
 *
 */
function safe_add(x, y) {

  var lsw = (x & 0xFFFF) + (y & 0xFFFF);

  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);

  return (msw << 16) | (lsw & 0xFFFF);

}

/*
 *
 * Bitwise rotate a 32-bit number to the left.
 *
 * 32位二进制数循环左移
 *
 */
function rol(num, cnt) {

  return (num << cnt) | (num >>> (32 - cnt));

}

/*
 *
 * The standard SHA1 needs the input string to fit into a block
 *
 * This function align the input string to meet the requirement
 *
 */
function AlignSHA1(str) {

  var nblk = ((str.length + 8) >> 6) + 1, blks = new Array(nblk * 16);

  for (var i = 0; i < nblk * 16; i++)
    blks[i] = 0;

  for (i = 0; i < str.length; i++)

    blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);

  blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);

  blks[nblk * 16 - 1] = str.length * 8;

  return blks;

}

/*
 *
 * Convert an array of big-endian words to a hex string.
 *
 */
function binb2hex(binarray) {

  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";

  var str = "";

  for (var i = 0; i < binarray.length * 4; i++) {

    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +

      hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);

  }

  return str;

}

/*
 *
 * calculate MessageDigest accord to source message that inputted
 *
 */
function calcDigest() {

  var digestM = hex_sha1(document.SHAForm.SourceMessage.value);

  document.SHAForm.MessageDigest.value = digestM;

}