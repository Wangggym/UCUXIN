import React from 'react'
import style from './page.less'
import api, { Config } from '../../api'
import { GetMore, HeadBarComp, getSearchObjFunc, isTeacherPortFunc } from '../../components'
import { Toast } from 'antd-mobile';
import ModalComp from './ModalComp'
import router from 'umi/router';
import moment from 'moment'

export default class LearnCourse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ViewModelList: [],
            canPlay: true,
            headBarVisible: false,
            IsCanEvaluate: false,
            errorMessage: '',
        }
        this.coursePeriodID = null
    }

    componentDidMount() {
        if (!this.coursePeriodID) {
            const { query: { coursePeriodID = '0' } } = this.props.location
            this.coursePeriodID = coursePeriodID
        }
        this.GetCoursePeriodDetail()
        this.GetEvaluateList()
        this.IsCanEvaluate()
    }

    //课程详情
    GetCoursePeriodDetail() {
        api.GetCoursePeriodDetail({ coursePeriodID: this.coursePeriodID }).then(res => {
            if (res.Ret === 0) {
                this.setState({ ...res.Data, headBarVisible: true })
            }
        })
    }

    //判断是否能评价
    IsCanEvaluate = () => {
        api.IsCanEvaluate({ coursePeriodID: this.coursePeriodID }).then(res => {
            if (res) {
                Toast.hide()
                this.setState({ IsCanEvaluate: res.Data, errorMessage: res.Msg })
            }
        })
    }

    //分页获取评价列表
    GetEvaluateList(CursorID) {
        let newCursorID = CursorID || '0'
        const { query: { coursePeriodID = '0' } } = this.props.location
        api.GetEvaluateList({ coursePeriodID, CursorID: newCursorID }).then(res => {
            if (res.Ret === 0) {
                const ViewModelList = newCursorID == '0' ? [...res.Data.ViewModelList] : [...this.state.ViewModelList, ...res.Data.ViewModelList]
                this.setState({ ...res.Data, ViewModelList })
            }
        })
    }

    //加载更多
    handleClickGetMore = (CursorID) => {
        this.GetEvaluateList(CursorID)
    }

    //收藏
    handleClickCollect = (isFav) => {
        const { query: { coursePeriodID = '0' } } = this.props.location
        api.SetFavarite({ body: { coursePeriodID, isFav } }).then(res => {
            if (res.Ret === 0) {
                this.setState({ IsFav: isFav }, () => {
                    Toast.info(`${isFav ? '已成功' : '取消'}收藏`, 1)
                })
            }
        })
    }

    //点击评价
    handleSure = (EvaluateItemIDs) => {
        const { query: { coursePeriodID = '0' } } = this.props.location
        api.Evaluate({ body: { coursePeriodID, EvaluateItemIDs } }).then(res => {
            if (res.Ret === 0) {
                Toast.info('评论成功', 1)
                this.GetCoursePeriodDetail()
                this.GetEvaluateList()
                this.IsCanEvaluate()
            } else {
                res && Toast.info(res.Msg, 1)
            }
        })
    }

    //分享
    share = () => {
        let { CoursePackagePic, CoursePackageName, Desc } = this.state;
        let obj = {
            Desc: isTeacherPortFunc() ? Config.learnCourse_share_text : Config.teachLearnCourse_share_text,
            Title: CoursePackageName,
            ThumbImg: CoursePackagePic,
            Url: Config.getCourseList(),
            Type: 7,
        };
        window.location.href = 'ucux://forward?contentjscall=share';
        window.share = () => {
            this.Share(obj)
            return JSON.stringify(obj);
        };
    }


    handleClickShare = () => {
        let { CoursePackagePic, CoursePackageName, Desc } = this.state;
        let obj = {
            Desc: Config.teachRecommend_share_text,
            Title: CoursePackageName,
            ThumbImg: CoursePackagePic,
            Url: Config.getCourseList(),
            Type: 7,
        };
        window.location.href = 'ucux://forward?channel=1&contentjscall=share';
        window.share = () => {
            this.Share(obj)
            return JSON.stringify(obj);
        };
    }

    //share
    Share = (obj) => {
        api.Share({ body: { coursePeriodID: this.coursePeriodID, ContentType: '1', Content: JSON.stringify(obj) } }).then(res => {
            if (res.Ret !== 0) Toast.info(res.Msg, 1)
        })
    }

    //开始播放
    handleStart = () => {
        api.Start({ coursePeriodID: this.coursePeriodID }).then(res => {
            if (res.Ret === 0) {
                this.setState({ ...res.Data }, () => this.play())
            } else if (res.ErrCode === 101) {
                this.setState({ canPlay: false })
            } else {
                Toast.info(res.Msg)
            }
        })
    }

    //调取ux播放器
    play() {
        const { PlayResID: sid, PlayRecodeID } = this.state
        /* 为native app做暂停需要记录的信息 start*/
        let businessParams = [];
        for (let i = 0; i < 5; i++) {
            businessParams.push({ "Time": Math.floor(Math.random() * 4000), "Pause": true, "Msg": "" });
        }
        let buz = JSON.stringify(businessParams);
        let params = encodeURI(buz);
        console.log(JSON.stringify({ CoursePeriodID: this.coursePeriodID, PlayRecodeID: PlayRecodeID }))
        const extraparams = encodeURI(`?CoursePeriodID=${this.coursePeriodID}&PlayRecodeID=${PlayRecodeID}`)
        /* 为native app做暂停需要记录的信息 end*/
        // window.location.href = `ucux://player/videoplay?sid=${sid}&unforward=1&businessparams=${params}&title=&url=&extraParams=${extraparams}&callback=playBack`
        window.location.href = `ucux://player/videoplay?sid=${sid}&extraparams=${extraparams}&callback=playBack`
        console.log('extraparams', extraparams)
        window.playBack = (dataStr) => {
            const data = JSON.parse(dataStr)
            const { ExtraParams, Duration: LearnSeconds, Position, MaxPosition } = data
            const { CoursePeriodID } = getSearchObjFunc(null, ExtraParams)
            this.coursePeriodID = CoursePeriodID
            Toast.loading('加载中')
            api.Complete({ body: { CoursePeriodID, LearnSeconds, Position, MaxPosition } }).then(res => {
                if (res.Ret === 0) {
                    this.IsCanEvaluate()
                }
            })

        };
    }

    //关闭headBar
    handleClose = () => {
        this.setState({ headBarVisible: false })
    }

    //锚点跳转
    scrollToAnchor = (anchorName) => {
        this.setState({ anchorName })
        if (anchorName) {
            // 找到锚点
            let anchorElement = document.getElementById(anchorName);
            // 如果对应id的锚点存在，就跳转到锚点
            if (anchorElement) {
                anchorElement.scrollIntoView();
            }
        }
    }

    render() {
        const {
            ViewModelList = [],
            HasNext = false,
            CursorID = '0',
            IsFav,
            EvaluateCnt = 0,
            Pic, Desc, Name, canPlay, CoursePackagePic, headBarVisible, RuleRemind = '',
            IsCanEvaluate,
            CoursePackageDesc,
            errorMessage,
            anchorName = 'courseInfo',
        } = this.state
        return <div>
            {headBarVisible && (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).MTypeID !== 11) &&
                <HeadBarComp
                    onlyValue={RuleRemind}
                    onClose={this.handleClose}
                />}
            <div className={style.top}>
                <img src={CoursePackagePic} alt="" />
                {/* <div className={style.goBack} onClick={() => router.goBack()}></div> */}
                {canPlay ? <div className={style.play}>
                    <div onClick={this.handleStart}></div>
                </div> : <div className={style.btn}>
                        <div onClick={() => {
                            window.location.href = Config.servicePackage(sessionStorage.getItem('UCUX_OCS_AccessToken'))
                        }}>
                            开通服务
                    </div>
                    </div>}
            </div>
            <div className={style.content_wrap}>
                <div className={style.tab}>
                    <div onClick={() => this.scrollToAnchor('courseInfo')}
                        className={anchorName == 'courseInfo' ? style.active : null}>课程介绍
                    </div>
                    <div onClick={() => this.scrollToAnchor('comment')}
                        className={anchorName == 'comment' ? style.active : null}>大家评（{EvaluateCnt}）
                    </div>
                </div>
                <div className={style.blank} />
                <div className={style.video_info} id={'courseInfo'}>
                    <h3>{Name}</h3>
                    {Desc && <div className={style.item}>
                        <h5>本课学习要点</h5>
                        <div>
                            {Desc}
                        </div>
                    </div>}
                    {CoursePackageDesc && <div className={style.item}>
                        <h5>课程简介</h5>
                        <div>
                            {CoursePackageDesc}
                        </div>
                    </div>}
                </div>
                <div className={style.blank} />
                <div className={style.talk} id={'comment'}>
                    <h5>大家评</h5>
                    {ViewModelList && ViewModelList.length ? ViewModelList.map(({ UName, CoursePackagePic, UPic, Content, CDate }, index) =>
                        <div className={style.item} key={index}>
                            <div className={style.content}>
                                <div className={style.left}>
                                    <span>
                                        <img src={UPic} alt="" />
                                    </span>
                                    <div>
                                        <div>{UName}</div>
                                        <span>{Content}</span>
                                    </div>
                                </div>
                                <div className={style.right}>
                                    {moment(CDate).format("MM-DD HH:mm")}
                                </div>
                            </div>
                        </div>
                    ) : <div className={style.noComment}>
                            暂无评论
                    </div>}
                    {HasNext && <GetMore onClick={() => this.handleClickGetMore(CursorID)} />}
                </div>
            </div>
            <div className={style.footer}>
                <div>
                    <div className={style.stydyicon}>
                        <a href="javascript:void(0);" onClick={() => this.handleClickCollect(!IsFav)}>
                            <div className={IsFav ? style.collect : null} />
                        </a>
                        <a href="javascript:void(0);" onClick={this.share}>
                            <span className={style.share} />
                        </a>
                    </div>
                    <div>
                        {IsCanEvaluate && <ModalComp onSure={this.handleSure}> <span className={style.comments}>评一评</span></ModalComp>}
                        {!IsCanEvaluate && <div onClick={() => Toast.info(errorMessage, 1)}><span className={style.comments}>评一评</span></div>}
                        {!isTeacherPortFunc() && <span onClick={this.handleClickShare} className={style.recommended}>推荐学习</span>}
                    </div>
                </div>
            </div>
        </div>
    }
}