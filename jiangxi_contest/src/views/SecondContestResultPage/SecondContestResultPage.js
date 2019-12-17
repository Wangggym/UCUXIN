import React from 'react'
import {NoContent} from '../../components'
import fusai from '../../assets/images/复赛_34.png'
import mindan from '../../assets/images/公布名单啦.png'
import touxiang from '../../assets/images/微信图片_20171114162919.jpg'

class SecondContestResultPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasResult: true,
        }
    }

    render() {
        const {hasResult} = this.state
        return (
            <div className="SecondContestResultPage">
                {!hasResult && <NoContent>
                    <div className="no_content">
                        <p>感谢您的关注和参与，线下决赛正在进行中</p>
                        <p>决赛（全国）名单将于<span>2018.01.01</span>公布<br/>请先关注网上知识竞赛哦</p>
                        <div className="button">返回</div>
                    </div>
                </NoContent>}
                {hasResult && <div className="bg">
                    <div className="title_pic">
                        <img src={fusai} alt=""/>
                    </div>
                    <div className="menu_pic">
                        <img src={mindan} alt=""/>
                    </div>
                    <div className="box">
                        <div className="wrap">
                            <div className="box_item">
                                <div className="content">
                                    <div>
                                        优秀组织奖
                                    </div>
                                    <span>
                                         10所学校
                                    </span>
                                </div>
                                <div className="pic"></div>
                            </div>
                        </div>
                        <div className="wrap">
                            <div className="box_item">
                                <div className="content">
                                    <div>
                                        优秀选手奖
                                    </div>
                                    <span>
                                        100名学生
                                    </span>
                                </div>
                                <div className="pic"></div>
                            </div>
                        </div>
                    </div>
                    <div className="match_title fixed_height">
                        省级决赛参赛名单（6名学生）
                    </div>
                    <div className="person_info fixed_height">
                        <div className="pic">
                            <img src={touxiang} alt=""/>
                        </div>
                        <div className="content">
                            <div>
                                <span>组别</span>
                                <div>小学组</div>
                            </div>
                            <div>
                                <span>姓名</span>
                                <div>张三</div>
                            </div>
                            <div>
                                <span>学校</span>
                                <div>建新小学</div>
                            </div>
                            <div>
                                <span>初赛成绩</span>
                                <div>100分（用时1分45秒33）</div>
                            </div>
                            <div>
                                <span>复赛成绩</span>
                                <div>100分（用时1分45秒33）</div>
                            </div>
                        </div>
                    </div>
                    <div className="person_info fixed_height">
                        <div className="pic"></div>
                        <div className="content">
                            <div>
                                <span>组别</span>
                                <span>小学组</span>
                            </div>
                            <div>
                                <span>姓名</span>
                                <span>张三</span>
                            </div>
                            <div>
                                <span>学校</span>
                                <span>建新小学</span>
                            </div>
                            <div>
                                <span>初赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                            <div>
                                <span>复赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                        </div>
                    </div>
                    <div className="person_info fixed_height">
                        <div className="pic"></div>
                        <div className="content">
                            <div>
                                <span>组别</span>
                                <span>小学组</span>
                            </div>
                            <div>
                                <span>姓名</span>
                                <span>张三</span>
                            </div>
                            <div>
                                <span>学校</span>
                                <span>建新小学</span>
                            </div>
                            <div>
                                <span>初赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                            <div>
                                <span>复赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                        </div>
                    </div>
                    <div className="person_info fixed_height">
                        <div className="pic"></div>
                        <div className="content">
                            <div>
                                <span>组别</span>
                                <span>小学组</span>
                            </div>
                            <div>
                                <span>姓名</span>
                                <span>张三</span>
                            </div>
                            <div>
                                <span>学校</span>
                                <span>建新小学</span>
                            </div>
                            <div>
                                <span>初赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                            <div>
                                <span>复赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                        </div>
                    </div>
                    <div className="person_info fixed_height">
                        <div className="pic"></div>
                        <div className="content">
                            <div>
                                <span>组别</span>
                                <span>小学组</span>
                            </div>
                            <div>
                                <span>姓名</span>
                                <span>张三</span>
                            </div>
                            <div>
                                <span>学校</span>
                                <span>建新小学</span>
                            </div>
                            <div>
                                <span>初赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                            <div>
                                <span>复赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                        </div>
                    </div>
                    <div className="person_info">
                        <div className="pic"></div>
                        <div className="content">
                            <div>
                                <span>组别</span>
                                <span>小学组</span>
                            </div>
                            <div>
                                <span>姓名</span>
                                <span>张三</span>
                            </div>
                            <div>
                                <span>学校</span>
                                <span>建新小学</span>
                            </div>
                            <div>
                                <span>初赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                            <div>
                                <span>复赛成绩</span>
                                <span>100分（用时1分45秒33）</span>
                            </div>
                        </div>
                    </div>
                    <div className="footer"></div>
                </div>}

            </div>
        )
    }
}

export default SecondContestResultPage