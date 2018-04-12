/**
 * Created by Yu Tian Xiong on 2017/12/11.
 */
import { AsyncComponent } from '../components';

const Instrument = AsyncComponent(() => import('../views/instrument/Instrument'));
const Infomation = AsyncComponent(() => import('../views/infomation/Infomation'));
const Column = AsyncComponent(() => import('../views/order/Column'));
const Ebook = AsyncComponent(() => import('../views/order/Ebook'));
const Single = AsyncComponent(() => import('../views/order/Single'));
const Whole = AsyncComponent(() => import('../views/order/Whole'));
const Organization = AsyncComponent(() => import('../views/organization/Organization'));
const System = AsyncComponent(() => import('../views/members/System'));
const ContentColum = AsyncComponent(() => import('../views/content-repository/contentColum/ContentColum'));
const SmallColum = AsyncComponent(() => import('../views/content-repository/contentColum/smallColum/SmallColum'));
const ContentBook = AsyncComponent(() => import('../views/content-repository/contentBook/ContentBook'));
const ContentShop = AsyncComponent(() => import('../views/content-repository/contentShop/ContentShop'));
const Article = AsyncComponent(() => import('../views/content-repository/contentArticle/ContentArticle'));
const Addinfo = AsyncComponent(() => import('../views/infomation/Addinfo'));
const Editarticle = AsyncComponent(() => import('../views/ViewComponents/editArticle/Editarticle'));
const  EditAtlas = AsyncComponent(() => import('../views/ViewComponents/editAtlas/EditAtlas'));
const  EditTopic = AsyncComponent(() => import('../views/ViewComponents/editTopic/EditTopic'));
const  Editpropaganda = AsyncComponent(() => import('../views/ViewComponents/editPropaganda/Editpropaganda'));
const  EditScolumn = AsyncComponent(() => import('../views/ViewComponents/editScolumn/EditScolumn'));
const  EditSmallColum = AsyncComponent(() => import('../views/ViewComponents/editScolumn/editSmallColum/EditSmallColum'));
const EditEbook = AsyncComponent(() => import('../views/ViewComponents/editEbook/EditEbook'));
const EditMember = AsyncComponent(() => import('../views/ViewComponents/editMember/EditMember'));
export default [
    //仪表盘
    {
        path: '/reports',
        exact: true,
        component: Instrument
    },
    //--------资讯管理------------
    //资讯
    {
        path: '/news',
        exact: true,
        component: Infomation
    },
    //新增资讯
    {
        path: '/news/add',
        exact: true,
        component: Addinfo
    },
    //编辑资讯(文章 话题 图集 宣传)
    //编辑文章
    {
        path: '/news/editarticle/:id?',
        exact: true,
        component: Editarticle
    },
    //编辑图集
    {
        path: '/news/editaltas/:id?',
        exact: true,
        component: EditAtlas
    },
    //编辑话题
    {
        path: '/news/edittopic/:id?',
        exact: true,
        component: EditTopic
    },
     //编辑宣传
     {
        path: '/news/editpropaganda/:id?',
        exact: true,
        component: Editpropaganda
    },
    //----------内容库-------------
    /*专栏 电子书 实物商品 文章*/
    {
        path: '/contents/article',
        exact: true,
        component: Article,
    },
    {
        path: '/contents/scolumn',
        exact: true,
        component: ContentColum
    },
    {
        path: '/contents/ebook',
        exact: true,
        component: ContentBook
    },
    {
        path: '/contents/fbook',
        exact: true,
        component: ContentShop
    },
    //编辑内容库(专栏)
    {
        path: '/contents/scolumn/editscolumn/:id?',
        exact: true,
        component: EditScolumn
    },
    //专栏小集
    {
      path: '/contents/scolumn/smallscolumn',
      exact: true,
      component: SmallColum
    },
    //编辑专栏小集
    {
    path: '/contents/scolumn/smallscolumn/edit/:id?',
    exact: true,
    component: EditSmallColum
    },
    //编辑电子书
    {
    path: '/contents/ebook/editebook/:id?',
    exact: true,
    component: EditEbook
    },
    //----------订单管理------------
    /* 专栏 电子书 机构单类 机构整体*/
    {
        path: '/order/scolumn-order',
        exact: true,
        component: Column
    },
    {
        path: '/order/ebook-order',
        exact: true,
        component: Ebook
    },
    {
        path: '/order/single-order',
        exact: true,
        component: Single
    },
    {
        path: '/order/group-order',
        exact: true,
        component: Whole
    },
    //机构管理
    {
        path: '/org',
        exact: true,
        component: Organization
    },
    //新增成员
    {
        path: '/org/editMember',
        exact: true,
        component: EditMember
    },
    //编辑成员
    {
        path: '/org/editMember/:id?',
        exact: true,
        component: EditMember
    },
    //系统设置
    {
        path: '/setting',
        exact: true,
        component: System
    },
   
]

