//入口身份选择
import * as React from "react";
import 'babel-polyfill';
import styles from './page.less'
import { List, Toast} from 'antd-mobile'
import api from '../../api'
import router from "umi/router";
// import Config from '../../api/config';
// import Link from 'umi/link';

const Item = List.Item;
const Brief = Item.Brief;
// const pageList = [
    // {key: 'catalog', value: '课程目录 --10'},
    // {key: 'collectList', value: '收藏列表 --14'},
    // {key: 'courseList', value: '课程列表 --9'},
    // {key: 'learnRecord', value: '学习记录 --13'},
    // {key: 'searchList', value: '搜索列表 --12'},
    // {key: 'learnCourse', value: '学习课程 --11'},
    // {key: 'thisWeekRank', value: '本周排名 --8'},
    // {key: 'conLearnList', value: '班主任_连续学习详情 --36'},
    // {key: 'home', value: '首页选择用户 --2'},
    // {key: 'introduce', value: '微客介绍 --5'},
    // {key: 'studentReport', value: '学生_每周荣誉榜 --7'},
    // {key: 'subjectLearnDetail', value: '微课观看率 --35'},
    // {key: 'learningReport', value: '学习报告 --16'},
    // {key: 'pointsItem', value: '积分明细 --18'},
    // {key: 'pointsRank', value: '积分排名 --17'},
    // {key: 'pointsRuler', value: '积分规则 --19'},
    // {key: 'studyDetails', value: '学习详情 --32'},
    // {key: 'buyResult', value: '购买 --22'},
    // {key: 'timeFrame', value: '时段详情--33'},
    // {key: 'classReport', value: '班级报告--31'},
    // {key: 'teacherReport', value: '班主任_每周报表 --30'},
    // {key: 'learnDaysList', value: '班主任_学习天数详情 --37'},
// ]

export default class Home extends React.Component {
    // state = {
    //     list: []
    // }
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: true,
        };
    }

    componentDidMount() {
      api.GetUserMembers().then(res => {
        if (res.Ret === 0) {
          this.setState({list: res.Data});      
            let  list = res.Data;
            if(list && list.length === 1){
              let user = (list[0]);
              this.go_to_home(user);
            //   sessionStorage.setItem('user', user)
            //   if(list.length===1 && list[0].MTypeID === 11){
            //     router.push('/classReport');
            //   }else if(list.length===1 && list[0].MTypeID === 12){
            //     if (list[0].IsLearnOrBought) {
            //       if (list[0].DayOfWeek === 1) {
            //         router.push('/studentReport') //进入每周荣誉榜
            //       } else {
            //         router.push('/thisWeekRank')  //进入本周排行
            //       }
            //     } else {
            //       return router.push('/introduce'); //未购买进入介绍页

            //     }
            //   }
            } else {
                this.setState({loading: false});
                Toast.hide();
            }
          
        } else {
          Toast.info(res.Msg,1)
        }

      })
      }
    go_to_home = (e) => {
        let user = JSON.stringify(e);
        api.SaveUserMemberCache({body: e}).then(res => {
          
            if (!res.Ret) { 
                sessionStorage.setItem('user', user)
                if (sessionStorage.getItem('goBack') === '1') {
                    sessionStorage.setItem('goBack', '0')
                    return router.goBack();
                }
                if (e.MTypeID === 11) return router.push('/classReport'); //老师对应接口
                if (e.MTypeID !== 11) {
                    if (e.IsLearnOrBought) {
                        if (e.DayOfWeek === 1) {
                            return router.push('/studentReport') //进入每周荣誉榜
                        } else {
                            return  router.push('/thisWeekRank')  //进入本周排行
                        }
                    } else {
                        return router.push('/introduce'); //未购买进入介绍页
        
                    }
        
                }
             
            } else {
                alert(res.Msg);
            }
        })
       


    }
    get_teachers = (list) => {
        return (
            <List renderHeader={() => '我是班主任'} key="1">
                {
                    list.map(e =>
                        <Item
                            className="item-global"
                            arrow="horizontal"
                            thumb={e.UPic || 'https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png'}
                            multipleLine
                            onClick={() => this.go_to_home(e)}
                            key={e.ClassID}
                        >
                            {`${e.GName} ${e.ClassName}`} <Brief>{e.MName}</Brief>
                            <div className={styles.uname}>{e.UName}</div>
                        </Item>
                    )
                }
            </List>
        )
    };
    get_students = (list) => {
        return (
            <List renderHeader={() => '我是学生&家长'} key="2">
                {
                    list.map(e =>
                        <Item
                            className="item-global"
                            key={e.ClassID}
                            arrow="horizontal"
                            thumb={e.UPic || 'https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png'}
                            multipleLine
                            onClick={() => this.go_to_home(e)}
                        >
                            {`${e.GName} ${e.ClassName}`} <Brief>{e.MName}</Brief>
                            <div className={styles.uname}>{e.UName}</div>
                        </Item>
                    )
                }
            </List>
        )
    };
    renderPage = () => {
        const {list} = this.state;
        let teacher = list.filter(e => e.MTypeID === 11); //班主任
        let student = list.filter(e => e.MTypeID !== 11);//学生&&家长

        return <div className={styles.home}>
            {
                teacher.length > 0 ? this.get_teachers(teacher) : null
            }
            {
                student.length > 0 ? this.get_students(student) : null
            }


        </div>
    }

    renderLoading = () => {
         Toast.loading('加载中');
         return null;
    }
    render(){
        return this.state.loading ? this.renderLoading() : this.renderPage();
    }
}