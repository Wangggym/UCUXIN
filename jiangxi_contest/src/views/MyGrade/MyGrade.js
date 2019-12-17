import React from 'react';
import { Tabs, WhiteSpace,Toast } from 'antd-mobile';
// import './myGrade.less';
import Api from '../../api/index';

const tabs = [
    { title: '初赛成绩', sub: '1' },
    { title: '复赛成绩', sub: '2' },
];
const noDataImg = require('../../assets/images/noDataImg@2x.png');
export default class MyGrade extends React.Component{
    state = {
      firstTest:undefined,
      secondTest:undefined,
      showTab:'1'
    };
    componentDidMount(){
        this.getMyScore();
    }

    getMyScore = (tab = '1') => {
        this.setState({
            showTab:tab
        });
        Toast.loading();
        Api.GetMyScore({umid:this.props.match.params.umid,testType:tab}).then(data => {
            Toast.hide();
            if(data.Ret==0){
                if(tab == 1){
                    this.setState({
                        firstTest:data.Data
                    })
                }else if(tab == 2){
                    this.setState({
                        secondTest:data.Data
                    })
                }

            }
        })

    };
    render (){
        const {firstTest,secondTest,showTab} = this.state;
        return (
            <div className="MyGrade">
                <div className="tab-head">
                    <div className={showTab == 1 ? 'active' : ''} onClick={() => { this.getMyScore(tabs[0].sub) }}>初赛成绩</div>
                    <div  className={showTab == 2 ? 'active' : ''}   onClick={() => { this.getMyScore(tabs[1].sub) }}>复赛成绩</div>
                </div>
                        {
                            showTab == 1 ? <div>
                                {
                                    firstTest === undefined ? '' : firstTest === null ? <div style={{textAlign:'center',paddingTop:'80px'}}>
                                            <img src={noDataImg} className="no_data_img" alt=""/>
                                            <p className="no_data_p">参加比赛后成绩才会显示在这里哦~</p>
                                        </div>
                                        :    <div>

                                            <div className="mid-wrap">
                                                <h1>{firstTest.BestScore}分</h1>
                                                {
                                                    firstTest.BeatPercent ? <p>击败{firstTest.BeatPercent}的参赛者</p> : <p>参与排名正在努力计算中……</p>
                                                }
                                                <small>* 取三次成绩中最高者为最后得分</small>
                                            </div>
                                            <div className="table-wrap">
                                                <table>
                                                    <thead>
                                                    <tr>
                                                        <th>轮次</th>
                                                        <th>开始时间</th>
                                                        <th>分数</th>
                                                        <th>用时</th>
                                                    </tr>

                                                    </thead>

                                                    <tbody>
                                                    {
                                                        firstTest.TestRecords.map((e,i) => <tr key={i}>
                                                            <td>第{e.Round}次</td>
                                                            <td>{e.SDate}</td>
                                                            <td>{e.Score != 0 ? e.Score + '分' : '--'}</td>
                                                            <td>{e.Score != 0 ? e.UsingTime + '秒' : '--'}</td>
                                                        </tr>)
                                                    }

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                }
                            </div> :                     <div>
                                {
                                    secondTest === undefined ? '' : secondTest === null ? <div style={{textAlign:'center',paddingTop:'80px'}}>
                                            <img src={noDataImg} className="no_data_img" alt=""/>
                                            <p className="no_data_p">参加比赛后成绩才会显示在这里哦~</p>
                                        </div>
                                        :    <div>

                                            <div className="mid-wrap">
                                                <h1>{secondTest.BestScore} 分</h1>
                                                <small>* 取三次成绩中最高者为最后得分</small>
                                            </div>
                                            <div className="table-wrap">
                                                <table>
                                                    <thead>
                                                    <tr>
                                                        <th>轮次</th>
                                                        <th>开始时间</th>
                                                        <th>分数</th>
                                                        <th>用时</th>
                                                    </tr>

                                                    </thead>

                                                    <tbody>
                                                    {
                                                        secondTest.TestRecords.map((e,i) => <tr key={i}>
                                                            <td>第{e.Round}次</td>
                                                            <td>{e.SDate}</td>
                                                            <td>{e.Score != 0 ? e.Score + '分' : '--'}</td>
                                                            <td>{e.Score != 0 ? e.UsingTime + '秒' : '--'}</td>
                                                        </tr>)
                                                    }

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                }
                            </div>

                        }


            </div>
        )
    }
}