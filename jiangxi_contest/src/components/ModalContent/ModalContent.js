import React from 'react'
import {Modal} from 'antd-mobile';

export default class ModalContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== undefined && nextProps.visible !== this.props.visible) {
            this.setState({ visible: nextProps.visible })
        }
    }

    showModal = (e) => {
        // e.preventDefault(); // 修复 Android 上点击穿透
        this.toggle(true)
    }

    onClose = () => {
        this.toggle(false)
    }

    toggle(boolean) {
        const { onChangeVisible } = this.props
        onChangeVisible ? onChangeVisible(boolean) : this.setState({ visible: boolean })
    }

    render() {
        return (
            <div onClick={this.showModal}>
                <Modal
                    visible={this.state.visible}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose}
                    footer={[{
                        text: 'OK', onPress: () => this.onClose()
                    }]}
                >
                    <div style={{padding: '10px 0'}}>{this.props.children}</div>
                </Modal>
            </div>
        );
    }
}