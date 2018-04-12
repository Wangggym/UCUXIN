import React, {Fragment} from 'react'
import {Modal, List, InputItem} from 'antd-mobile';
import style from './page.less'
import {createForm} from 'rc-form';
import router from "umi/router";

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

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({visible: true});
    }

    onClose = key => () => {
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
        const {trialDays = 0} = this.props
        const {modalList = []} = this.state
        const {getFieldProps} = this.props.form
        return (
            <Fragment>
                <span onClick={this.showModal('11')}>
                    {this.props.children}
                </span>
                <Modal
                    visible={this.state.visible}
                    transparent
                    maskClosable={true}
                    onClose={this.onClose('modal1')}
                    title={''}
                    wrapProps={{onTouchStart: this.onWrapTouchStart}}
                    footer={[ {text: '去体验', onPress: () => router.push('/courseList')},]}
                >
                    <div className={style.try}>
                        <img src={require('../../public/assets/b1041c7893395fe4a9d06edf90407dba@2x.png')} alt=""/>
                        <p>恭喜你获得了{trialDays}天的全科试看服务
                            你可以畅听全部科目的微课</p>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}

export default createForm()(ModalComp)

