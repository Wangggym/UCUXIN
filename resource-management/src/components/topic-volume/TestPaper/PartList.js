/**
 * create by xj 2017/8/19
 * */
import React, {Component} from 'react';
import QuestionsList from './QuestionsList';

class PartList extends Component{
  static defalutProps={

  }
  constructor(props){
    super(props)
    this.state={
      data:this.props.data
    }
  }
componentDidMount(){
  //console.log(this.state.data)
}

  render(){
  const{data} = this.state
    return(
      <div className="part-list">
       <div className="part-list-title">{parseInt(data.Seq)+1}、{data.Name}</div>
       <div className="part-list-title">{data.Remark}</div>
        <div className="part-list-content">
          {
            data.Questions.length&&data.Questions.map((itme,index)=>{
              return(
                <QuestionsList data={itme} key={index} index={index}/>
              )
            })
          }
        </div>
      </div>
    )
  }
}
export default PartList;
