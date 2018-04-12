/**
 *  Create by YuTianxiong on 2018/1/15.
 *  fileName: 轮播图
 */
import React, {Component} from 'react';
import {Card,Button,Modal,message} from 'antd';
import BannerTable from './Table/bannerTable';
import Api from '../../../api';
import './banner.less';


class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      type:'1',
      dataSource:[],//轮播数据
    };
    this.getBannerList();
  }

  //获取轮播列表
  getBannerList = () =>{
    Api.systemSetting.getBannerList().then(res=>{
      this.setState({dataSource:res.Data});
    })
  };

  handleCancel = () =>{
    this.setState({visible:false})
  };

  cake = (value) =>{this.setState({type:value})};

  //删除对应的数据
  handleDel = (id) =>{
    Api.systemSetting.cleanBanner({id:id}).then(res=>{
      if(res.Ret===0){
        this.getBannerList();
        message.success('删除成功')
      }
    })
  };
  //确定关闭模态窗口
  getData = (value,data) => {
    this.setState({visible:value});
    data && this.setState({dataSource:data})
  };
  //添加轮播图  打开模态窗口
  addImg = () => {
    const {dataSource} = this.state;
    if(dataSource.length>=3){
      message.info('最多添加三张轮播图');
      return;
    }else {
      this.setState({visible:true});
    }
  };

  render() {
    const {dataSource} = this.state;
    return (
      <div>
        <Modal
          title="设置轮播图"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          wrapClassName="vertical-center-modal"
          width={600}
          maskClosable={false}
          footer={null}
        >
          <BannerTable getData={this.getData}/>
        </Modal>
        <Button onClick={this.addImg}>添加轮播图</Button>
        {dataSource && dataSource.map((item,i)=>
          <Card style={{marginBottom:10,marginTop:10}} key={i}>
            <div className="bannerBox">
                <div className="bannerItem">
                  <div className="item-left">
                    <img src={item.Thumb} alt=""/>
                  </div>
                  <div className="item-right">
                    <div className="content">关联内容:&nbsp;<span className="item-color">{item.ContentTypeName}&nbsp;&nbsp;{item.Title}</span></div>
                    {item.BeginDate && <div className="date">有效期:&nbsp;<span>{item.BeginDate}</span>至<span>{item.EndDate}</span></div>}
                    {!item.BeginDate && <div className="date">有效期:&nbsp;无限期</div>}
                    <Button className="clean" onClick={()=>this.handleDel(item.ID)}>清除</Button>
                  </div>
                </div>
              </div>
            </Card>)}
      </div>
    )
  }
}

export default Banner;