/**
 * Created by Yu Tian Xiong on 2017/12/28.
 * file:图集新增图片
 */
import React,{Component} from 'react';
import {Card,Icon,Button} from 'antd';
import ListItem from './ListItem';
import uid from '../../../basics/uid';

export default class AddImg extends Component {

    state = {
        data:this.props.value || []
    };
    componentWillReceiveProps(nextProps){
        if(nextProps.pictures && nextProps.pictures !== this.props.pictures){
            this.setState(
                {data: nextProps.pictures,SNO:nextProps.pictures.length});
        }
    }
    handleAdd = () => {
        this.state.SNO++;
        const data = [...this.state.data,
            {
                SNO: this.state.SNO ? this.state.SNO : +uid(),
                Img: '',
                Desc: ''
            },
        ];
        this.setState({data});
    };
    handleRemove = (value) => {
        const {data} = this.state;
        const index = data.findIndex(item => item.SNO === value.SNO);
        const nextData = [
            ...data.slice(0, index),
            ...data.slice(index + 1),
        ];
        // const next = data.filter(item => item.key !== value.key);
        this.setState({data: nextData},()=> this.props.getImgChange(this.state.data));
    };

    handleChange = (value)=> {
        const {data} = this.state;
        const index = data.findIndex(item => item.SNO === value.SNO);
        this.setState({data: [
            ...data.slice(0, index),
            value,
            ...data.slice(index +1)
        ]},()=>{this.props.getImgChange(this.state.data)});
    };
    render(){
        const {data} = this.state;
        return(
            <div id="editor">
                <Card >
                    {Array.isArray(data) && data.length ?
                    <div className="box">
                        {
                            data.map((item, i) =>
                                <ListItem
                                    key={item.SNO}
                                    data={item}
                                    index={i}
                                    onConfirm={this.handleConfirm}
                                    onRemove={this.handleRemove}
                                    onChange={this.handleChange}
                                />
                            )
                        }

                    </div>
                    : <div className="catalog-no-data">没有图集内容哦~</div>}
                </Card>
                <Button type="primary" onClick={this.handleAdd} style={{ width: '60%' ,marginLeft:'20%',marginTop:10}}>
                    <Icon type="plus" /> 新增图片
                </Button>
            </div>
        )
    }
}

