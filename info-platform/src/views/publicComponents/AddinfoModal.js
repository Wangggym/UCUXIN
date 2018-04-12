/**
 * Created by Yu Tian Xiong on 2018/1/5.
 */
import React, {Component} from 'react';
import {Modal,Button} from 'antd';

export default class AddinfoModal extends Component {

    state = { visible: false }
    showModal = () => {
      this.setState({
        visible: true,
      });
    }
    hideModal = () => {
      this.setState({
        visible: false,
      });
    }
    render() {
      return (
        <div>
          <Button type="primary" onClick={this.showModal}>Modal</Button>
          <Modal
            title="Modal"
            visible={this.state.visible}
            onOk={this.hideModal}
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
          >
            <p>Bla bla ...</p>
            <p>Bla bla ...</p>
            <p>Bla bla ...</p>
          </Modal>
        </div>
      );
    }
}