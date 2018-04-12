/**
 * Created by Yu Tian Xiong on 2017/2/8.
 * file:图集关联内容组件
 */
import React,{Component} from 'react';
import {Button,Modal,Card} from 'antd';
import InsertColum from './insertComponent/InsertColum';
import InsertGoods from './insertComponent/InsertGoods';
import InsertBook from './insertComponent/InsertEbook';
import './associated.less';


class Associated extends Component{
  state = {
    visible:false,//专栏modal
    goodVisible:false,//实物商品modal
    bookVisible:false,//电子书modal
    data:null,
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.value && nextProps.value !== this.props.value){
      this.setState({data: nextProps.value})}
  }

  //插入专栏
  insertColumn = () => this.setState({visible:true});
  cancelInsertColumn = () =>this.setState({visible:false});
  getColumValue = (value,data) => {
    this.setState({visible:value,data:data});
    data && this.props.onChange(data);
  };

  //插入实物商品
  insertGoods = () => this.setState({goodVisible:true});
  cancelInsertGoods = () => this.setState({goodVisible:false});
  getGoodsValue = (value,data) => {
    this.setState({goodVisible:value,data:data});
    data && this.props.onChange(data);
  };

  //插入电子书
  insertBook = () => this.setState({bookVisible:true});
  cancelInsertBook = () => this.setState({bookVisible:false});
  getBookValue = (value,data) => {
    this.setState({bookVisible:value,data:data});
    data && this.props.onChange(data);
  };

  //清除
  handleClean = () => this.setState({data:undefined},()=>this.props.onChange(this.state.data));

  //枚举  类型 显示不同标题
  handleType = (type) => {
   let content = '';
   switch (type) {
     case 21:
       content = '关联专栏';
       break;
     case 23:
       content = '关联电子书';
       break;
     case 25:
       content = '关联实物商品';
   }
   return content;
  };

  //处理名称过长
  handleTitle = (title) => {
    let Title = title.substr(0);
    if (Title.length > 16) {Title = `${Title.substr(0, 8)}...`}
    return Title;
  };

  render(){
    const {data} = this.state;
    return(
      <div className="contactBox">
        <Button onClick={this.insertColumn} className="box-btn"><i></i>专栏</Button>
        <Button className="btn-two" onClick={this.insertGoods}><i></i>商品</Button>
        <Button className="btn-three" onClick={this.insertBook}><i></i>电子书</Button>
        <Button className="operation-btn" onClick={this.handleClean}>清除</Button>
        {/*插入专栏*/}
        <Modal
          visible={this.state.visible}
          wrapClassName="vertical-center-modal"
          title="请选择要插入的专栏"
          onCancel={this.cancelInsertColumn}
          maskClosable={false}
          width={600}
          footer={null}
        >
          <InsertColum getValue={this.getColumValue} value="该图片会出现在图集的最后,点击会打开关联的内容" />
        </Modal>

        {/*插入实物商品*/}
        <Modal
          visible={this.state.goodVisible}
          wrapClassName="vertical-center-modal"
          title="请选择要插入的实物商品"
          onCancel={this.cancelInsertGoods}
          maskClosable={false}
          width={600}
          footer={null}
        >
          <InsertGoods getValue={this.getGoodsValue} value="该图片会出现在图集的最后,点击会打开关联的内容"/>
        </Modal>

        {/*插入电子书*/}
        <Modal
          visible={this.state.bookVisible}
          wrapClassName="vertical-center-modal"
          title="请选择要插入的电子书"
          onCancel={this.cancelInsertBook}
          maskClosable={false}
          width={600}
          footer={null}
        >
          <InsertBook getValue={this.getBookValue} value="该图片会出现在图集的最后,点击会打开关联的内容" />
        </Modal>

        {/*展示关联内容*/}
        {data &&
        <div className="showBox">
          <Card title={this.handleType(data.ContentType)} extra={<a href="#">{this.handleTitle(data.Title)}</a>} style={{ width: 300 }}>
            <p><img src={data.Img} alt=""/></p>
          </Card>
        </div>
        }
      </div>
    )
  }

}

export default Associated;