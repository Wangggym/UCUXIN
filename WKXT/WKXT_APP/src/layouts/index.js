import * as React from 'react';
import withRouter from 'umi/withRouter';
import router from 'umi/router';
import * as styles from './index.less';
import { Config } from '../api';

import { setTitleFunc, showAppMenuFunc, getSearchObjFunc } from '../components'


@withRouter
export default class extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
        }
        this.pathname = null,
            this.affirmToken = false
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.history.location.pathname !== this.pathname) {
            this.pathname = nextProps.history.location.pathname
            setTitleFunc(this.pathname)
        }
    }

    componentDidMount() {
        if (window.location.href.indexOf('goBack') !== -1) {
            sessionStorage.setItem('goBack', '1');
        }
        //去掉分享按钮
        showAppMenuFunc()

        //开发模式
        if (process.env.NODE_ENV === `development` && Config.token) {
            sessionStorage.setItem('UCUX_OCS_AccessToken', Config.token)
            this.judgeLinkTo()
        }

        //如果不是ucux运行环境
        if (navigator.userAgent.indexOf('UCUX_WebBrowser') === -1) {
            const { token } = getSearchObjFunc(this.props.history)
            if (token) sessionStorage.setItem("UCUX_OCS_AccessToken", token)
            this.judgeLinkTo()
        } else {
            try {
                setTimeout(() => window.location.href = "ucux://getappinfo?callback=ongetappinfo")
            } catch (e) {
                console.log(e)
            }
            window.ongetappinfo = dataStr => {
                let data = eval('(' + dataStr + ')')
                sessionStorage.setItem('UCUX_OCS_AccessToken', data.AccessToken)
                this.judgeLinkTo()
            }
        }
    }

    //判断跳转路由
    judgeLinkTo = () => {
        // console.log(this.props);
        // 除身份选择页面本身及下面提到的两个特殊页面外，其余页面需公共处理user缓存信息的判断，若进入页面时没有从缓存中获取到user信息，则跳转到身份选择页面
        // 微课介绍页和每周荣誉榜
        const pathname = this.props.history.location.pathname
        if (pathname.indexOf('/studentReport') !== -1 || pathname.indexOf('/teacherReport') !== -1 || pathname.indexOf('/introduce') !== -1 || sessionStorage.getItem('user')) {
            return this.setState({ visible: true })
        } else if (navigator.userAgent.indexOf('UCUX_WebBrowser') === -1 && !getSearchObjFunc(this.props.history).token) {
            router.push('/introduce')
            return this.setState({ visible: true })
        } else {
           
            router.push('/home')
            return this.setState({ visible: true })
        }
    }


    render() {
        const { visible } = this.state
        return (
            <div>{visible && this.props.children}</div>
        );
    }
}


