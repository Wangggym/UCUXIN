/**
 *  Create by xj on 2018/1/15.
 *  fileName: 专家阵容
 */
import React,{Component} from 'react';
import {message} from "antd";
import ThumbUpload from "./../../publicComponents/thumbload/ThumbUpload"
import Api from '../../../api';

class MembersPoto extends Component{
    constructor(props){
        super(props);
        this.state={
            MembersPoto:""
        }
    }
    componentDidMount(){
        this.setState({
            MembersPoto:this.props.MembersPoto
        })
    }
    //确定
    sure=()=>{
        Api.systemSetting.SetGSpaceMembersPhoto({photoUrl:this.state.MembersPoto}).then(res=>{
            if(res.Ret===0){
                message.success("保存成功！")
                
            }else {
                message.error(res.Msg)
            }
        })
    };
    delete=()=>{
        Api.systemSetting.SetGSpaceMembersPhoto({photoUrl:""}).then(res=>{
            if(res.Ret===0){
                message.success("删除成功！")
                this.setState({
		            MembersPoto:""
		        })
            }else {
                message.error(res.Msg)
            }
        })
    };
    render(){
        const {MembersPoto}=this.state;
        return(
            <div className="expert">
                <ThumbUpload upload={(url)=>this.setState({MembersPoto:url})} cover={MembersPoto} cropRate="4:1" size={true}/>
                <p style={{marginTop:"10px",color:"#aaa"}}>点击图片进行添加/更改</p>
                <a style={{fontSize:"20px",marginTop:"20px"}} onClick={()=>this.sure()}>确定</a>
                <a style={{fontSize:"20px",marginTop:"20px"}} onClick={()=>this.delete()}>清除</a>
            </div>
        )
    }
}
export default MembersPoto;