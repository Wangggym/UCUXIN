import React from 'react'
import {CourseItem, BottomStudy as Footer, getSuffix} from '../../../components'
import './train-course.scss'
import {Link, withRouter} from 'react-router-dom';
import {trainPlan, CourseDetail} from '../../../api'
import './Courseware.scss'
import oss from '../../../utils/oss';
import {Toast} from 'antd-mobile'

class Courseware extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ViewModelList: {CourseResourceDetails: [], Count: 0}
    }
  }

  componentDidMount() {
    this.getAlbumCourseInstro()
  }

  // 获取专辑详情
  getAlbumCourseInstro(courseID = this.props.match.params.courseID) {
    trainPlan.getAlbumCourseInstro({courseID}).then(res => {
      if (!res) return;
      if (res.Ret === 0) {
        this.setState({ViewModelList: res.Data})
      }
    })
  }

  //判断是否已购买
  handleGetWareClick = (item) => {
    console.log(item);
    const {IsBuy} = this.state.ViewModelList;
    if (!IsBuy) return Toast.info('需要先购买才能下载资源', 1);
    if(item.ResourceType===1){
      this.getFileUrlByResourceID(item.YLSResourceID, item.ResourceName);
    }else {
      this.getVideoPlay(item.YLSResourceID)
    }
  };
   //获取视频播放地址
  getVideoPlay=(YLSResourceID)=>{
    CourseDetail.GetVideoIDByResourceID({resourceID: YLSResourceID}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          sid: res.Data
        },()=>this.play(this.state.sid))
      }
    })
  };

  //调取ux播放器
  play(sid){
    /* 为native app做暂停需要记录的信息 start*/
    let businessParams=[];
    for(let i=0; i<5; i++) {
      businessParams.push({ "Time": Math.floor(Math.random()*4000), "Pause": true, "Msg": "" });
    }
    let buz = JSON.stringify(businessParams);
    let params = encodeURI(buz);
    /* 为native app做暂停需要记录的信息 end*/
    window.location.href =`ucux://player/videoplay?sid=${sid}&unforward=1&businessparams=${params}&title=&url=&extraparams=&callback=playBack`
  }

  //获取文件url地址
  getFileUrlByResourceID(resourceID, ResourceName) {
    trainPlan.getFileUrlByResourceID({resourceID}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        if (!res.Data) return Toast.fail('暂无该资源', 0.8);
        res.Data && this.fileDownLoad(res.Data, ResourceName)
      }
    })
  }

  //文件下载
  fileDownLoad(fileAddr, ResourceName) {
    oss.ali.download(fileAddr, ResourceName);
  }

  //收藏切换
  handleFavorClick = () => {
    trainPlan.favorCourse({rid: this.state.ViewModelList.ID}).then(res => {
      if (!res) return
      if (res.Ret === 0) {
        this.getAlbumCourseInstro()
      }
    })
  }

  //分享
  share() {
    let {ViewModelList} = this.state;
    let obj = {
      Desc: ViewModelList.Name,
      Title: ViewModelList.Name,
      ThumbImg: ViewModelList.CoverImg,
      Url: window.location.href,
      Type: 7,
    };
    window.location.href = 'ucux://forward?contentjscall=share';
    window.share = () => {
      return JSON.stringify(obj);
    };
  }


  handleClick = (boolean, TotalFee) => {
    boolean && this.createOrder(TotalFee)
  }


  createOrder(TotalFee) {
    let {ViewModelList} = this.state;
    let obj = {
      body: {
        RID: ViewModelList.ID,
        OrderType: 2,
      }
    };
    CourseDetail.CreatOrderInfo(obj).then((res => {
      if (res.Ret === 0) {
        if (!TotalFee) {
          this.getAlbumCourseInstro()
        } else {
          this.props.history.push('/pay-course/' + res.Data + '/' + encodeURIComponent(window.location.href));
        }
      }
    }));
  }

  // 格式化视频时间
  formatTimeLong = (text) => {
    let h = Number.parseInt(text / 3600).toString();
    if (h < 10) h = h.padStart(2, '0');
    let m = Number.parseInt((text % 3600) / 60).toString().padStart(2, '0');
    let s = ((text % 3600) % 60).toString().padStart(2, '0');
    return [h, m, s].join(':');
  };


  //显示文件大小
  showFileSize(size) {
    if (size < 1024) {
      return size + ' KB'
    }
    return (size / 1024).toFixed(1) + ' MB'
  }

  render() {
    const {ViewModelList} = this.state;
    const {CourseResourceDetails, Count} = ViewModelList;
    return (
      <div className='train-course'>
        <div className='header'>
          <CourseItem {...ViewModelList} />
        </div>
        <div className='main'>
          <div className="Courseware-title">包含的{Count}个课件</div>
          {CourseResourceDetails.length ? CourseResourceDetails.map((item, index) =>
            <div className='Courseware activeClass'
                 onClick={() => this.handleGetWareClick(item)} key={index}>
              <div className={`icon ${getSuffix(item.SuffixName)}`}/>
              <div className="content">
                <span className="name overflow-hidden">{item.ResourceName}</span>
                {item.Duration ? <span className="size">{this.formatTimeLong(item.Duration)}</span> :
                  <span className="size">{this.showFileSize(item.Size)}</span>}
              </div>
            </div>) : null}
        </div>
        <Footer {...ViewModelList} onTranspondClick={() => this.share()} onFavorClick={this.handleFavorClick}
                onClick={this.handleClick}/>
      </div>
    )
  }
}

//限定控件传入的属性类型
Courseware.propTypes = {}

//设置默认属性
Courseware.defaultProps = {}


export default withRouter(Courseware)
