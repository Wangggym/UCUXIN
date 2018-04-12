/**
 * Created by Yu Tian Xiong on 2017/12/28.
 * file:热门标签
 */
import React,{Component} from 'react';
import {Tag,Tooltip,Button,Icon,Input,Row, Col} from 'antd';
import Api from '../../../api';
const CheckableTag = Tag.CheckableTag;

export default class HotTag extends Component{
    state = {
        tags:[],
        inputVisible:'',
        inputValue:'',
        tagBox:false,
        tagList:[],
    };
    componentDidMount(){
        this.getTags();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.tags!==this.props.tags){
            this.setState({tags:nextProps.tags});
        }
    }
    //获取热门标签
    getTags = ()=>{
        Api.Info.getTags({tagType:1}).then(res=>{
            if(res.Ret===0){
                this.setState({hotTag:res.Data})
            }
        })
    };
    handleClose = (removedTag) => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags });
    };

    showInput = () => {
        this.setState({ inputVisible: true,tagBox:true}, () => this.input.focus());
    };

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        const state = this.state;
        const inputValue = state.inputValue;
        let tags = state.tags;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            state.tagList.push(inputValue);
            this.props.tag(state.tagList);
            tags = [...tags, inputValue];
        }
        if(tags.length>5)tags.splice(0,1);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
            // tagBox:false
        });
    };

    saveInputRef = input => this.input = input;

    handleTag =(tag, checked)=> {
        const { tags,tagList} = this.state;
        const nextSelectedTags = checked ?
            [...tags, tag] :
            tags.filter(t => t !== tag);
        tagList.push(tag);
        this.props.tag(tagList);
        if(nextSelectedTags.length>5) {nextSelectedTags.splice(0,1);}
        this.setState({ tags: nextSelectedTags });
    };
    render(){
        let {tags,inputVisible,inputValue,tagBox} = this.state;
        return (
            <div>
                <div style={{border:'1px solid #d9d9d9',borderRadius:'4px'}} onClick={()=>{this.setState({tagBox:true})}}>
                    {tags && tags.map((tag, index) => {
                        const isLongTag = tag.length > 20;
                        const tagElem = (
                            <Tag key={tag} closable={true} afterClose={() => this.handleClose(tag)}>
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </Tag>
                        );
                        return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                    })}
                    {inputVisible && (
                        <Input
                            ref={this.saveInputRef}
                            type="text"
                            size="small"
                            style={{ width: 78 }}
                            value={inputValue}
                            onChange={this.handleInputChange}
                            onBlur={this.handleInputConfirm}
                            onPressEnter={this.handleInputConfirm}
                        />
                    )}
                    {!inputVisible && <Button size="small" type="dashed" onClick={this.showInput} style={{color:'#bfbfbf'}}>添加标签</Button>}
                </div>
                {tagBox && <div style={{border:'1px solid #eee'}}>
                    <div><Icon type="close" onClick={()=>this.setState({tagBox:false})} style={{cursor:'pointer',position:'absolute',right:0,margin:6}}></Icon></div>
                    <div>最多可以添加5个标签</div>
                    <Row>
                        <Col>
                            {Array.isArray(this.state.hotTag) && this.state.hotTag.map(tag => (
                                <CheckableTag
                                    key={tag.Name}
                                    checked={tags.indexOf(tag.Name) > -1}
                                    onChange={checked => this.handleTag(tag.Name, checked)}
                                >
                                    {tag.Name}
                                </CheckableTag>
                            ))}
                        </Col>
                    </Row>
                </div>}
            </div>
        )
    }
}