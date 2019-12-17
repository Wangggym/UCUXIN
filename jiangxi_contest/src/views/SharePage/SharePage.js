import React from 'react'
import './SharePage.less'
import ban_share from '../../assets/images/ban_share.png'
import knowledge_share from '../../assets/images/knowledge_share.png'
import title_pic from '../../assets/images/title_pic.png'

const SharePage = () =>
    <div className="SharePage">
        <div className="banner">
            <img src={ban_share}/>
        </div>
        <div className="knowledge">
            <img src={knowledge_share}/>
        </div>
        <div className="title_pic">
            <img src={title_pic}/>
        </div>
        <h3>“新华杯”江西青少年禁毒知识竞赛</h3>
        <p>竞赛时间：<span className="blue">2017年11月1日</span>起至<span className="blue">2017年12月10日</span></p>
        <p>参与方式：江西省青少年毒品预防教育数字化平台</p>
        <div className="blank"></div>
        <div className="button button_app"
             onClick={() => window.location.href = 'http://www.jxjd627.com/platformAdminApp/InvitationPage/#/downLoad'}>
            <span className="icon"></span>一键下载APP参与（推荐）
        </div>
        <div className="button button_pc">
            <span className="icon"></span>电脑登陆www.jxjd627.com参与
        </div>
        <div className="unit">
            <div className="title">
                <div className="title_title">主办单位</div>
                <div className="title_item">江西省禁毒委员会办公室</div>
                <div className="title_item">江西省教育厅</div>
                <div className="title_item">共青团江西省委员会</div>
            </div>
            <div className="title">
                <div className="title_title">协办单位</div>
                <div className="title_item">江西新华发行集团有限公司</div>
            </div>
        </div>
    </div>
export default SharePage