import React, {Fragment} from 'react'
import {Modal} from 'antd-mobile';
import style from './page.less'
import api from "../../api";
import {Toast} from 'antd-mobile'
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

const initModalList = (data) => {
    if (!(data && data.length)) return []
    const newData = []
    return data.map((item) => {
        return {...item, hover: false}
    })

}

export default class ModalComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            modalList: []
        }
    }

    componentDidMount() {
        //获取评价项
        api.GetEvaluateItemList().then(res => {
            if (res.Ret === 0) {
                this.setState({modalList: initModalList(res.Data)})
            }
        })

    }

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({visible: true});
    }

    onClose = key => () => {
        this.setState({visible: false}, () => {
            this.setState({modalList: initModalList(this.state.modalList)})
        })
    }

    onSure = key => () => {
        const EvaluateItemIDs = [];
        [...this.state.modalList].forEach(({Key, Value, hover}) => {
            if (hover) EvaluateItemIDs.push(Key)
        })
        if (EvaluateItemIDs.length) {
            this.props.onSure(EvaluateItemIDs)
            this.setState({visible: false}, () => {
                this.setState({modalList: initModalList(this.state.modalList)})
            })
        } else {
            Toast.info('请至少选择一项')
        }
    }

    handleChange = (thisKey) => {
        const newData = [];
        [...this.state.modalList].forEach((item) => {
            if (item.Key === thisKey) {
                newData.push({...item, hover: !item.hover})
            } else {
                newData.push({...item})
            }
        })
        this.setState({modalList: newData})
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
        return (
            <Fragment>
                <div onClick={this.showModal('11')}>
                    {this.props.children}
                </div>
                <Modal
                    visible={this.state.visible}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('modal1')}
                    title="评一评"
                    footer={
                        [
                            {
                                text: '取消', onPress: () => {
                                    this.onClose('modal1')();
                                }
                            },
                            {
                                text: '确定', onPress: () => {
                                    this.onSure('modal1')();
                                }
                            },
                        ]
                    }
                    wrapProps={{onTouchStart: this.onWrapTouchStart}}
                >
                    <div className={style.modalContent}>
                        <div className={style.title}>告诉我们你对该微课的意见吧</div>
                        <div className={style.content}>
                            {modalList && modalList.length ? modalList.map(({Key, Value, hover}) => {
                                return <div
                                    className={hover ? style.hover : null}
                                    onClick={() => this.handleChange(Key)}
                                    key={Key}
                                >{Value}</div>
                            }) : null}
                        </div>
                    </div>
                </Modal>
            </Fragment>
        );
    }
}

