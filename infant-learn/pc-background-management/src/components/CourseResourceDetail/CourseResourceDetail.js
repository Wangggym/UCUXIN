/**
 * Created by YiMin Wang on 2017/10/11.
 *
 */
import React, {Component} from 'react';
import moment from 'moment';
import './CourseResourceDetail.scss'
import api from '../../api'
import oss from '../../utils/oss';
import {Plyr} from '../index.js'
import {withRouter} from 'react-router-dom'
// -- Ant Design
import {
  Popconfirm,
  Tooltip,
  Icon,
  message,
  Modal,
} from 'antd';


const fileType = [
  {
    suffix: ['webm', 'mp4', 'ogg', 'avi', 'rmvb', 'rm', 'asf', 'mov', 'mpeg', 'mpe', 'wmv', 'mkv'],
    icon: 'video'
  },
  {
    suffix: ['pdf'],
    icon: 'pdf'
  },
  {
    suffix: ['doc', 'docx'],
    icon: 'doc'
  },
  {
    suffix: ['xls', 'xlsx'],
    icon: 'xls'
  },
  {
    suffix: ['ppt', 'pptx'],
    icon: 'ppt'
  },
  {
    suffix: ['jpg', 'jpeg', 'gif', 'bmp', 'png'],
    icon: 'pic'
  },
  {
    suffix: ['mp3', 'ogg', 'wav', 'ape', 'cda', 'au', 'midi', 'mac', 'aac', 'aif'],
    icon: 'music'
  },
  {
    suffix: ['rar', 'zip', '7-zip', 'ace', 'arj', 'bz2', 'cab', 'gzip', 'iso', 'jar', 'lzh', 'tar', 'uue', 'xz', 'z'],
    icon: 'rar'
  }
];

class CourseResourceDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoPreviewUrl: '',
      videoPreviewVisible: false,
    }
  }

  // 资源基本信息，不同资源显示不同信息
  renderResourceInfo = () => {
    const {data} = this.props;
    switch (data.ResourceType) {
      case 1:
        return <div className="course-list-desc">
          <span>{(data.Size / 1024 / 1024).toFixed(2)}M</span>{/*<span>类型：{data.SuffixName}</span>*/}</div>;
      case 2:
        return (
          <div className="course-list-desc">
            {/*
              data.Size && <span>大小：{(data.Size / 1024/1024).toFixed(2)}M</span>
            */}
            {
              data.Duration && <span>{this.formatTimeLong(data.Duration)}</span>
            }
          </div>
        );
      case 3:
        return (
          <div className="course-list-desc">
            {/*
              data.SDate && <span>{data.SDate.split(' ')[0]}</span>
            */}
            {
              (data.SDate && data.EDate) &&
              <span>{`${moment(data.SDate).format('HH:mm')}~${moment(data.EDate).format('HH:mm')}`}</span>
            }
          </div>
        );
      case 4:
        return (
          <div className="course-list-desc">
            {
              data.Count && <span>共{data.Count}道试题</span>
            }
          </div>
        );
      case 6:
        return (
          <div className="course-list-desc">
            {
              data.SDate && <span>{data.SDate.split(' ')[0]}</span>
            }
            {/*
              (data.SDate && data.EDate) &&
              <span>时间：{`${moment(data.SDate).format('HH:mm')}~${moment(data.EDate).format('HH:mm')}`}</span>
            */}
            {/*
              data.Addr &&
              <Tooltip title={data.Addr}>地址：详细</Tooltip>
            */}
          </div>
        )
    }
  };

  // 格式化视频时间
  formatTimeLong = (text) => {
    let h = Number.parseInt(text / 3600).toString();
    if (h < 10) h = h.padStart(2, '0');
    let m = Number.parseInt((text % 3600) / 60).toString().padStart(2, '0');
    let s = ((text % 3600) % 60).toString().padStart(2, '0');
    return [h, m, s].join(':');
  };

  // 资源类型
  renderResourceTypeIcon = (type, suffix) => {

    switch (type) {
      case 1:
        //return <span><Icon type="paper-clip" style={{marginRight: 5}}/>文件</span>;
        //return <span><i style={{backgroundImage:'url("http://lapp.test.ucuxin.com/test/svg/1.svg")', width: 14, height:14, display:'inline-block',verticalAlign:'text-bottom',marginRight:8}} />文件</span>;

        for (let i = 0; i < fileType.length; i++) {
          if (fileType[i].suffix.includes(suffix)) {
            return <Tooltip title="文件" placement="left"><i
              className={`rs-icon-course rs-icon-${fileType[i].icon}`}/></Tooltip>;
          }
        }
        return <Tooltip title="文件" placement="left"><i className="rs-icon-course rs-icon-file"/></Tooltip>;
      case 2:
        //return <span className="rs-type"><Icon type="video-camera" style={{marginRight: 5}}/>视频</span>;
        return <Tooltip title="视频" placement="left"><i className="rs-icon-course rs-icon-video"/></Tooltip>;
      case 3:
        //return <span className="rs-type"><Icon type="laptop" style={{marginRight: 5}}/>直播</span>;
        return <Tooltip title="直播" placement="left"><i className="rs-icon-course rs-icon-camera"/></Tooltip>;
      case 4:
        //return <Tooltip title="试卷"><Icon type="file-text" style={{fontSize: 28}}/></Tooltip>;
        return <Tooltip title="试卷" placement="left"><i className="rs-icon-course rs-icon-file-text"/></Tooltip>;

      case 6:
        //return <span className="rs-type"><Icon type="schedule" style={{marginRight: 5}}/>面授</span>;
        return <Tooltip title="面授" placement="left"><i className="rs-icon-course rs-icon-teach"/></Tooltip>;
      default:
        //return <span className="rs-type"><Icon type="file" style={{marginRight: 5}}/>其它</span>;
        return <Tooltip title="其它" placement="left"><i className="rs-icon-course rs-icon-file"/></Tooltip>;
    }
  };

  //预览
  handlePreview = (data) => {
    if (data.ResourceType === 2) {
      api.Base.getVideoRes({resourceID: data.ResourceID}).then(res => {
        if (res.Ret === 0) {
          this.setState({videoPreviewUrl: res.Data.PlayUrl, videoPreviewVisible: true});
        } else {
          message.error(res.Msg);
        }
      });
    } else {
      this.props.history.push({pathname: '/test-paper/paper-detail', search: `?TestPaperID=${data.ResourceID}`});
    }
  }

  //下载
  handleDownload = (data) => {
    if (data.ResourceType === 2) {
      api.Base.getVideoRes({resourceID: data.ResourceID}).then(res => {
        if (res.Ret === 0) {
          window.location.href = res.Data.DownUrl;
        } else {
          message.error(res.Msg);
        }
      });
    } else {
      api.Base.getFileUrlByResourceID({resourceID: data.YLSResourceID}).then(res => {
        if (res.Ret === 0) {
          if (!res.Data) return message.info('没有该资源')
          res.Data && oss.ali.download(res.Data, data.ResourceName);
        } else {
          message.error(res.Msg);
        }
      });
    }
  }

  render() {
    const {data} = this.props;
    return (
      <div className="CourseResourceDetail">
        <div className="pic">{this.renderResourceTypeIcon(data.ResourceType, data.SuffixName)}</div>
        <div className="name overflow-hidden">{data.ResourceName}</div>
        <div className="size">
          {this.renderResourceInfo()}
        </div>
        <div className="type">
          {data.ResourceType === 2 &&
          <a href="javascript:void(0)" onClick={() => this.handlePreview(data)}>预览</a>}
          {/*{(data.ResourceType === 2 || data.ResourceType === 4) &&*/}
          {/*<a href="javascript:void(0)" onClick={() => this.handlePreview(data)}>预览</a>}*/}
          {!(data.ResourceType === 3 || data.ResourceType === 6 || data.ResourceType === 4) &&
          <a href="javascript:void(0)" onClick={() => this.handleDownload(data)}
             style={{marginLeft: '5px'}}>下载</a>}
        </div>
        <Modal
          visible={this.state.videoPreviewVisible}
          onCancel={() => this.setState({videoPreviewVisible: false})}
          footer={null}
        >
          <Plyr
            url={this.state.videoPreviewUrl}
            isClose={this.state.videoPreviewVisible}
          />
        </Modal>
      </div>
    )
  }
}

export default withRouter(CourseResourceDetail)
