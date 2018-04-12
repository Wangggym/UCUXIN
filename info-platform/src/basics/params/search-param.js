/**
 * Created by QiHan Wang on 2017/5/27.
 */
// SearchParams 查询段转为object
export function searchParams(search) {
    let obj = {};
    const params = (search.split('?')[1]).split('&');
    for (let i = 0; i < params.length; i++) {
      let param = params[i].split('=');
      obj[param[0]] = decodeURIComponent(param[1]);
    }
    return obj;
  }
  
  // 根据名称获取查询字段值
  export function searchParamName(attr, search) {
    let match = new RegExp(`[?&]${attr}=([^&]*)`).exec(search || window.location.href);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  }
  