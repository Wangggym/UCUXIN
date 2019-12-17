import React from 'react';
import { Tabs, WhiteSpace,Toast } from 'antd-mobile';
// import './rankingList.less';
import Api from '../../api/index';

const tabs = [
    { title: '市(州)前十', sub: '2' },
    { title: '县(区)前十', sub: '3' },
    { title: '学校前十', sub: '4' },
];
const noDataImg = require('../../assets/images/noDataImg@2x.png');
export default class MyGrade extends React.Component{
    state = {
        cityData:undefined,
        myRank:undefined,
        showTab:'2'
    };
    componentDidMount(){
        this.getMyScore();
    }

    getMyScore = (tab = '2') => {
        this.setState({
            showTab:tab
        });
        Api.GetJoinDetailReport({groupLevel:tab}).then(data => {
            if(data.Ret==0){
                this.setState({
                    cityData:data.Data
                })
            }
        })
        Api.GetMyJoinRank({groupLevel:tab}).then(data => {
            if(data.Ret==0){
                this.setState({
                    myRank:data.Data
                })
            }
        })

    };
    render (){
        const {cityData,showTab,myRank} = this.state;
        return (
            <div className="rankingList">
                <div className="tab-head">
                    <div className={showTab == 2 ? 'active' : ''} onClick={() => { this.getMyScore(tabs[0].sub) }}>{tabs[0].title}</div>
                    <div  className={showTab == 3 ? 'active' : ''}   onClick={() => { this.getMyScore(tabs[1].sub) }}>{tabs[1].title}</div>
                    <div  className={showTab == 4 ? 'active' : ''}   onClick={() => { this.getMyScore(tabs[2].sub) }}>{tabs[2].title}</div>
                </div>
                 <div>
                        {
                            cityData === undefined ? '' : cityData.length === 0 ? <div style={{textAlign:'center',paddingTop:'80px'}}>
                                    <img src={noDataImg} className="no_data_img" alt=""/>
                                    {/*<p className="no_data_p">参加比赛后成绩才会显示在这里哦~</p>*/}
                                </div>
                                :
                                <div>

                                    {myRank == undefined || myRank.length === 0 ? '' : <div className="mid-wrap">
                                        {
                                            myRank.map((e,i) => {
                                                    if(showTab == 2 && i ==0 ){
                                                        return <div key={i} style={{margin:'8px 0'}}>
                                                            <span>{e.Name}</span>
                                                            排名：<small>{e.Rank }</small>
                                                        </div>
                                                    }else if(showTab == 2 && i ==0){
                                                        return <div key={i} style={{margin:'8px 0'}}>
                                                            <span>{e.Name}</span>
                                                            排名：<small>{e.Rank }</small>
                                                        </div>
                                                    }else{
                                                        return <div key={i} style={{margin:'8px 0'}}>
                                                            <span>{e.Name}</span>
                                                            排名：<small>{e.Rank }</small>
                                                        </div>
                                                    }
                                                }
                                            )
                                        }
                                    </div>}
                                    <div className="table-wrap">
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>名次</th>
                                                <th style={{width:'55%'}}>名称</th>
                                                <th>参与人数</th>
                                            </tr>

                                            </thead>

                                            <tbody>
                                            {
                                                cityData.length !== 0 ? cityData.map((e,i) => {
                                                    if(i == 0){
                                                        return <tr key={i}>
                                                            <td><span><img width='40px' src={require('../../assets/images/1.png')} alt=""/></span></td>
                                                            <td>{e.Name}</td>
                                                            <td>{e.JoinCount}</td>
                                                        </tr>
                                                    }else if(i== 1){
                                                        return   <tr key={i}>
                                                            <td><span><img src={require('../../assets/images/2.png')} alt=""/></span></td>
                                                            <td>{e.Name}</td>
                                                            <td>{e.JoinCount}</td>
                                                        </tr>
                                                    }else if(i==2){
                                                        return    <tr key={i}>
                                                            <td><span><img src={require('../../assets/images/3.png')} alt=""/></span></td>
                                                            <td>{e.Name}</td>
                                                            <td>{e.JoinCount}</td>
                                                        </tr>
                                                    }else{
                                                        return <tr key={i}>
                                                            <td><span>{i+1}</span></td>
                                                            <td>{e.Name}</td>
                                                            <td>{e.JoinCount}</td>
                                                        </tr>
                                                    }
                                                }) : null
                                            }

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                        }
            </div>
                <div style={{fontSize:'14px',color:'#999',textAlign:'center',margin:'10px 0'}}>排名数据将在每天6:00更新</div>

            </div>
        )
    }
}