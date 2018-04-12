/**
 *  Create by yu tian xiong on 2018/1/8.
 *  fileName: content 内容库
 */
import InfoFetch from './fetch';

export default {
  //------内容库专栏------
  //获取内容库专栏列表
  getScolumnList: data => InfoFetch('POST', 'ZX/v3/ScolumnGW/GetList', data),
  //关闭专栏
  handleCloseScolumn: data => InfoFetch('POST', 'ZX/v3/ScolumnGW/Close', data),
  //开启专栏
  handleStartScolumn: data => InfoFetch('POST', 'ZX/v3/ScolumnGW/Republish', data),
  //删除专栏
  handleDeleteScolumn: data => InfoFetch('POST', 'ZX/v3/ScolumnGW/Delete', data),
  //立即发布专栏
  nowPublishScolumn: data => InfoFetch('POST', 'ZX/v3/ScolumnGW/PublishNow', data),
  //保存专栏
  saveScolumn: data => InfoFetch('POST', 'ZX/v3/ScolumnGW/Save', data),
  //发布专栏
  publishScolumn: data => InfoFetch('POST', 'ZX/v3/ScolumnGW/Publish', data),
  //获取专栏详情
  getScolumnDetail:data => InfoFetch('GET', 'ZX/v3/ScolumnGW/Get', data),
  //获取教育阶段
  getPhaseList: data=> InfoFetch('GET', 'base/v3/Web/GetPhaseList', data),
  //获取省市区
  getRegionList: data=> InfoFetch('GET', 'base/v3/Web/GetRegionList', data),

  //------专栏小集------
  //获取专栏小集列表
  getSmallColum: data => InfoFetch('POST', 'ZX/v3/ScolumnItemGW/GetList', data),
  //立即发布专栏小集
  nowPublishSmall: data => InfoFetch('POST', 'ZX/v3/ScolumnItemGW/PublishNow', data),
  //获取小集主讲人
  getSpeaker:data=> InfoFetch('GET', 'ZX/v3/ZXMemberGW/GetContentProviders', data),
  //保存专栏小集
  saveSmallColum:data=> InfoFetch('POST', 'ZX/v3/ScolumnItemGW/Save', data),
  //发布专栏小集
  publsihSmallColum:data=> InfoFetch('POST', 'ZX/v3/ScolumnItemGW/Publish', data),
  //获取专栏小集详情
  getSmallDetail:data=> InfoFetch('GET', 'ZX/v3/ScolumnItemGW/Get', data),
  //关闭专栏小集
  handleCloseSmall:data=> InfoFetch('POST', 'ZX/v3/ScolumnItemGW/Close', data),
  //开启专栏小集
  handleStartSmall:data=> InfoFetch('POST', 'ZX/v3/ScolumnItemGW/Republish', data),
  //保存价格策略
  savePriceStrategy:data=> InfoFetch('POST', 'ZX/v3/PriceStragetyGW/Save', data),
  //获取价格策略
  getPriceStrategy:data=> InfoFetch('GET', 'ZX/v3/PriceStragetyGW/GetList', data),
  //关闭价格策略
  closePriceStrategy:data=> InfoFetch('POST', 'ZX/v3/PriceStragetyGW/Close', data),

  //------电子书------
  //获取电子书列表
  getBookList: data=>InfoFetch('POST', 'ZX/v3/EBookGW/GetList', data),
  //保存电子书
  saveEbook:data=>InfoFetch('POST', 'ZX/v3/EBookGW/Save', data),
  //发布电子书
  publishEbook:data=>InfoFetch('POST', 'ZX/v3/EBookGW/Publish', data),
  //获取电子书详情
  getEbookDetail:data=>InfoFetch('GET', 'ZX/v3/EBookGW/Get', data),
  //上架电子书
  shelvesBook:data=>InfoFetch('POST', 'ZX/v3/EBookGW/Publish', data),
  //下架电子书
  offShelvesBook:data=>InfoFetch('POST', 'ZX/v3/EBookGW/Close', data),
  //删除电子书
  deleteBook:data=>InfoFetch('POST', 'ZX/v3/EBookGW/Delete', data),

  //------电子书------
  //获取实物商品列表
  getGoodsList:data=>InfoFetch('POST', 'ZX/v3/GoodsGW/GetList', data),

}