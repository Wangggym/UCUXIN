import React, {Component} from 'react'
import {Link} from 'react-router-dom';
import {List, Icon} from 'antd-mobile';
// import './identityChoose.less';
import {LinkTo} from '../../components'

export default class IdentityChoose extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userinfo: JSON.parse(sessionStorage.getItem("userinfo"))
        }
    }

    render() {
        const userinfo = this.state.userinfo
        const address = `/${this.props.match.params.address}/`
        return (
            <div className="IdentityChoose">
                {
                    userinfo && userinfo.length ? userinfo.map(({UMID, GName, MName, ClassName}, index) =>
                        <LinkTo className="item" to={address + UMID} key={index}>
                            <div className="info">
                                <div className="name">{MName}</div>
                                <div className="data">
                                    <span>{GName}</span>
                                    <span className="school">{ClassName}</span>
                                </div>
                            </div>
                            <div className="icon"></div>
                        </LinkTo>) : null
                }
            </div>
        )
    }
}