import * as React from "react";
import {Carousel, Toast, Modal, WhiteSpace} from 'antd-mobile'
import styles from './page.less'
import router from "umi/router";
import {VideoPlayer} from '../../components'
import ModalComp from './ModalComp'
import TestModalComp from './TestModalComp'
import api, {Config} from '../../api'
import md5 from 'blueimp-md5'

const alert = Modal.alert

const DataTypeArr = { 1: '班级', 2: '全国'};
// const videoJsOptions = {
//     autoplay: false,
//     controls: true,
//     sources: [{
//         src: 'http://video.ucuxin.com/uxdev/1/uxclass-demo.mp4',
//         type: 'video/mp4'
//     }]
// }

export default class Introduce extends React.Component {
    state = {
        data: {
            BoughtList: [],
            LearnList: [],
            DataType: 1,

        },
        showMore: false,
        outLink: false
    }
 

    componentDidMount() {
        if (sessionStorage.getItem('UCUX_OCS_AccessToken') && !sessionStorage.getItem('user')) {
            // sessionStorage.setItem('goBack', '1');
            return router.push('/');
        }
        api.GetIntroduce().then(res => {
            if (res.Ret === 0) {
                let data = res.Data;
                this.setState({
                    data: res.Data
                })
                //判断是否外链访问
                if (window.navigator.userAgent.indexOf('UCUX') > -1) {
                    this.setState({outLink: window.navigator.userAgent.indexOf('UCUX') > -1})

                }
            }
        })
        api.GetTrialDays().then(res => {
            if (res.Ret === 0) {
                this.setState({trialDays: res.Data})
            }
        })
    }

    handlePlay = (player) => {
        console.log('onPlay', player)
    }

    //
    handleReadyForService = () => {
        if (sessionStorage.getItem('UCUX_OCS_AccessToken')) return router.push('')
    }

    //生成开通服务按钮
    readyForService = (style = 'small') => {
        if (sessionStorage.getItem('UCUX_OCS_AccessToken')) {
            const address = Config.servicePackage(sessionStorage.getItem('UCUX_OCS_AccessToken'))
            return <a onClick={() => {
                window.location.href = address
            }} style={{width: style === 'big' ? '80%' : '40%' }}>开通服务</a>
        }
        return <ModalComp onSubmit={this.handleSubmit}  style={{width: style === 'big' ? '80%' : '40%' }}>开通服务</ModalComp>
    }

    //提交
    handleSubmit = ({uxcode, pwd}) => {
        const {appid, appSecret} = Config.getH5TokenParams();
        const md5pwd = md5(pwd);
        const ts = Math.round(new Date().getTime()/1000);
        const md5ts = md5(appSecret + ts);
        api.GetH5Token({uxcode, md5pwd, appid, ts, md5ts}).then(res => {
            if (res.Ret === 0) {
                sessionStorage.setItem('UCUX_OCS_AccessToken', res.Data.Token)
                const address = Config.servicePackage(res.Data.Token);                
                Toast.info('登陆成功', 1, () => {
                    window.location.href = address
                })
            } else{
                Toast.fail(res.Msg)
            }
        })
    }

    //试看
    handleTry = () => {
        const {trialDays = 0} = this.state
        if (trialDays <= 0) return router.push('/courseList')
        const alertInstance = alert('', <div className={styles.try}>
            <img src={require('../../public/assets/b1041c7893395fe4a9d06edf90407dba@2x.png')} alt=""/>
            <p>恭喜你获得了{trialDays}天的全科试看服务
                你可以畅听全部科目的微课</p>
        </div>, [
            {text: '去体验', onPress: () => router.push('/courseList')},
        ]);
    }

    //footer
    getFooterComp = () => {
        const {outLink, data: {FuncST = 0}, trialDays = 0} = this.state
        if (!outLink) {
            return this.readyForService('big')
        } else {
            if (FuncST === 0) {
                return <div style={{width: '100%', display: 'flex'}}>
                    <span onClick={() => router.push('/courseList')}>先去了解</span>
                    {this.readyForService()}
                </div>
            } else if (FuncST === 1) {
                return <div style={{width: '100%', display: 'flex'}}>
                    {trialDays <= 0 ? <span onClick={() => router.push('/courseList')}>去试看</span> :
                        <TestModalComp trialDays={trialDays} ><span>去试看</span></TestModalComp>}
                    {this.readyForService()}
                </div>
            } else if (FuncST === 2) {
                return <a onClick={() => router.push('/courseList')} style={{width: '80%' }}>去学习</a>
            }
        }
       
    }

    render() {
        const {showMore, data: {BoughtCnt, BoughtList, LearnList, Pic, PicLink, DataType}} = this.state
        console.log(DataType);
        const newBoughtList = [...BoughtList, ...BoughtList, ...BoughtList,...BoughtList,...BoughtList];
        return (
            <div>
                <video
                    poster={Pic}
                    className={styles.video}
                    src={PicLink}
                    controls="controls"
                    width="100%"
                >
                    您的浏览器不支持 video 标签。
                </video>
                {/* <VideoPlayer { ...videoJsOptions } /> */}

                <div className={styles.introduce}>
                    <div className={styles.imgbg}>
                        <div style={{position: 'relative'}}>
                            <img src={require('../../public/assets/123123.jpg')} alt=""/>
                            <img className={styles.btn} onClick={() => this.setState({showMore: !showMore})}
                                 src={showMore ? require("../../public/assets/packup.png") : require("../../public/assets/more.png")}
                                 alt=""/>
                        </div>
                        {
                            !showMore ? null :
                                <div>
                                    <img src={require('../../public/assets/js2.png')} alt=""/>
                                    <img src={require('../../public/assets/js3.png')} alt=""/>
                                    <img src={require('../../public/assets/js4.png')} alt=""/>
                                    <img src={require('../../public/assets/js5.png')} alt=""/>
                                </div>
                        }
                    </div>
                    <div style={{backgroundColor: '#fff', borderBottom: '1px solid #e5e5e5'}}>
                        <p style={{
                            color: '#888',
                            padding: '30px',
                            borderBottom: '1px solid #e5e5e5'
                        }}>{DataTypeArr[DataType]}已开通服务{BoughtCnt}人</p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            height: '180px',
                            width: '100%',
                            overflow: 'scroll'
                        }}>
                            {BoughtList.map((type, i) => (
                                <div style={{margin: "5px 20px", width:"20%", textAlign: 'center'}}>
                                <img src={type.UPic} key={i}
                                     style={{width: '88px', borderRadius: '50%', margin: '20px 25px'}}
                                     alt=""/>
                                     <p style={{ whiteSpace:"nowrap", fontSize:27, textAlign:'center', width:"100%",overflow:'hidden', textOverflow: 'ellipsis'}}>{type.UName}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{backgroundColor: '#fff', marginBottom: '120px'}}>
                        <p style={{
                            color: '#888',
                            padding: '30px',
                            borderBottom: '1px solid #e5e5e5',
                            marginBottom: 20
                        }}>看了的同学这样评价：</p>
                        {
                            LearnList.map((type, i) => 
                            <div
                                style={{display: 'flex', borderBottom: '1px solid #e5e5e5',  margin: '20px 20px 10px 30px'}}>
                                <div  style={{width: '20%'}}>
                                    <img src={type.UPic} key={i}
                                        style={{ width: "80%", borderRadius: 8}}
                                        alt=""/>
                                </div>
                                <div style={{display: 'flex', width:"78%", flexDirection: 'column', justifyContent: 'space-around', marginTop: 5}}>
                                    <div style={{fontSize:26,fontFamily:'PingFangSC-Regular',color:"rgba(51,51,51,1)",marginBottom:20}}>{type.UName}</div>
                                    <div style={{fontSize:34,fontFamily:'PingFangSC-Regular',color:"rgba(51,51,51,1)",marginBottom:20}}>
                                        观看了《{type.SubjectName}{type.CoursePrdName}》
                                        </div>
                                    <div style={{fontSize:26,fontFamily:'PingFangSC-Regular',color:"rgba(51,51,51,1)",marginBottom:20, lineHeight: 1.5}}>
                                        发表评论：{type.EvaluateDesc}
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>
                </div>
                <WhiteSpace size="sm" />
                <div className={styles.bottom}>
                    {this.getFooterComp()}
                </div>
            </div>
        )
    }
};
