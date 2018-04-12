/**
 * Created by Yu Tian Xiong on 2017/12/18.
 */
import React, { Component } from 'react';
import {Menu} from 'antd';
import InfoTab from './infoTab';

class Infomation extends Component {
    state = {
        type:'item_0',
    };
    handleClick = (e) => {
        this.setState({
            type: e.key,
        });
    };
    render(){
        return(
            <div>
                <Menu
                    mode="horizontal"
                    selectedKeys={[this.state.type]}
                    onClick={this.handleClick}
                >
                    <Menu.Item key="item_0">全部</Menu.Item>
                    <Menu.Item key="11">文章</Menu.Item>
                    <Menu.Item key="12">话题</Menu.Item>
                    <Menu.Item key="13">图集</Menu.Item>
                    <Menu.Item key="14">宣传</Menu.Item>
                </Menu>
                <div style={{marginTop:10}}>
                    <InfoTab type={this.state.type}/>
                </div>
            </div>
        )
    }
}

export default Infomation;