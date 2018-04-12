import React from 'react'
import { Modal, Button, message } from 'antd';
import { resSetting_watch } from '../../services/resSetting';
import styles from './resSetting_Details.less'
export default class Details extends React.Component {

    state = {
        visible: false,
        getData: false,
    }

    showModal = () => {
        if (this.state.getData === false) {
            const { gid, configType } = this.props
            resSetting_watch({ gid, configType }).then(res => {
                if (res.Ret === 0) {
                    this.setState({ ...res.Data, getData: true })
                } else {
                    message.info(res.InfoMsg)
                }
            })
        }
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    render() {
        const { ResPhaseConfigModel = [] } = this.state
        return (
            <div >
                <div onClick={this.showModal}>
                    {this.props.children}
                </div>
                <Modal
                    title="资源配置详情"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {ResPhaseConfigModel && ResPhaseConfigModel.length !== 0 ?
                        ResPhaseConfigModel.map(({ PhaseName, SupplierName, SubjectNameList }, index) =>
                            <div key={index} className={styles.resSetting_Details}>
                                <div className={styles.item}>
                                    <div className={styles.title}>
                                        学段：
                                    </div>
                                    <div className={styles.content}>
                                        {PhaseName}
                                    </div>
                                </div>
                                <div className={styles.item}>
                                    <div className={styles.title}>
                                        供应商：
                                    </div>
                                    <div className={styles.content}>
                                        {SupplierName}
                                    </div>
                                </div>
                                <div className={styles.item}>
                                    <div className={styles.title}>
                                        选择科目：
                                    </div>
                                    <div className={styles.content}>
                                        {SubjectNameList && SubjectNameList.length !== 0 ?
                                            SubjectNameList.map((item, index) =>
                                                <span key={index}>{item}</span>
                                            ) : null}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                </Modal>
            </div>

        );
    }
}
