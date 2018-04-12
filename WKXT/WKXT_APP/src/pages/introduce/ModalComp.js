import React, {Fragment} from 'react'
import {Modal, List, InputItem} from 'antd-mobile';
import style from './page.less'
import api from "../../api"
import {createForm} from 'rc-form';

function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

class ModalComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        }
    }

    componentDidMount() {

    }

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({visible: true});
    }

    onClose = key => () => {
        this.setState({visible: false})
    }

    onSure = key => () => {
        this.props.form.validateFields((error, value) => {
            this.props.onSubmit(value)
        });
        this.setState({visible: false})
    }

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    render() {
        const {modalList = []} = this.state
        const {getFieldProps} = this.props.form;
        console.log(this.props);
        return (
            <Fragment>
                <span onClick={this.showModal('11')} style={this.props.style}>
                    {this.props.children}
                </span>
                <Modal
                    visible={this.state.visible}
                    transparent
                    maskClosable={true}
                    onClose={this.onClose('modal1')}
                    title={<div className={style.modal_title}>请填写需要开通服务的优信账号，购买成功后，
                        使用该账号登陆优课优信即可学习相关微课</div>}
                    footer={
                        [
                            {
                                text: '提交', onPress: () => {
                                    this.onSure('modal1')();
                                }
                            },
                        ]
                    }
                    wrapProps={{onTouchStart: this.onWrapTouchStart}}
                >
                    <div className={style.modalContent}>
                        <List>
                            <InputItem
                                {...getFieldProps('uxcode')}
                                type="number"
                                placeholder="请输入优信账号"
                            >账户</InputItem>
                            <InputItem
                                {...getFieldProps('pwd')}
                                type="password"
                                placeholder="请输入优信密码"
                            >密码</InputItem>
                        </List>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}

export default createForm()(ModalComp)

