/**
 * Created by YuTianXiong on 2017/12/28.
 * breadcrumb
 */
export default {
    // - 仪表盘 ----------------------------------------
    '/reports': {name: '仪表盘', component: true},



    // - 资讯管理 ----------------------------------------
    '/news':{name: '资讯管理', component: true},
    '/news/add':{name: '新增资讯', component: true},
    '/news/editarticle':{name: '编辑文章', component: true},
    '/news/editaltas':{name: '编辑图集', component: true},
    '/news/edittopic':{name: '编辑话题', component: true},
    '/news/editpropaganda':{name: '编辑宣传', component: true},




    // - 内容库 ----------------------------------------
    '/contents':{name: '内容库', component: false},
    '/contents/article':{name: '文章', component: true},
    '/contents/scolumn':{name: '专栏', component: true},
    '/contents/scolumn/smallscolumn':{name: '小集', component: true},
    '/contents/scolumn/smallscolumn/edit':{name: '编辑小集', component: true},
    '/contents/scolumn/editscolumn':{name: '编辑专栏', component: true},
    '/contents/ebook':{name: '电子书', component: true},
    '/contents/ebook/editebook':{name: '编辑电子书', component: true},
    '/contents/fbook':{name: '商品', component: true},



    // - 订单管理 ----------------------------------------
    '/order':{name: '订单管理', component: false},
    '/order/scolumn-order':{name: '专栏', component: true},
    '/order/ebook-order':{name: '电子书', component: true},
    '/order/single-order':{name: '机构单类', component: true},
    '/order/group-order':{name: '机构整体', component: true},


    // - 机构管理 ----------------------------------------
    '/org':{name: '成员管理', component: true},
    '/org/editMember':{name: '编辑成员', component: true},


    // - 系统设置 ----------------------------------------
    '/setting':{name: '系统设置', component: true},
}
