//积分规则
import * as React from "react";
import styles from './page.less'
import router from 'umi/router';

export default class Home extends React.Component {

    goStudy = () => {
        router.push('/learningReport');
    };
    goExchange = () => {
        router.push('/courseList');
    };

    render() {

        return <div className={styles.pointsRuler}>


            <div className={styles.header}>
                <span className={styles.title}>积分有什么用</span>
                <span className={styles.headline}>1、积分可以参与抽取奖品</span>
                <span className={styles.text}>每抽取一次奖品将消耗2个积分，每日参与次数以具体活动规则为准</span>
                <span className={styles.headline}>2、积分可以在积分商城兑换商品</span>
                <span className={styles.text}>根据商品定价消耗相应的积分</span>
                {/*<div className={styles.btn} onClick={this.goStudy}>*/}
                {/*去兑换*/}
                {/*</div>*/}
            </div>

            <div className={styles.black}>

            </div>

            <div className={styles.header}>
                <span className={styles.title}>如何获得积分</span>
                <span className={styles.headline}>1、学习微课获得积分</span>
                <span className={styles.text}>学习时长满15分钟可以获得3个积分，满15分钟后，每增长5分钟获得1个积分。每日最多可以获取10个积分（不含奖励积分）</span>
                <span className={styles.headline}>2、评级微课奖励积分</span>
                <span className={styles.text}>评价微课每次奖励2个积分</span>
                <span className={styles.headline}>3、连续学习奖励积分</span>
                <span className={styles.text}>连续学习满3天奖励5个积分，满3天后每连续学习增加1天奖励奖励2个积分</span>
                <span className={styles.headline}>4、荣登每周荣誉榜奖励积分</span>
                <span className={styles.text}>荣登每周荣誉榜，每次奖励5积分</span>
                <div className={styles.btn} onClick={this.goExchange}>
                    去学习
                </div>
            </div>

        </div>
    }

}