import React from 'react'
import PropTypes from 'prop-types'

import ServiceAsync from '../../../common/service';
import urls from './urls'
// -- AntDesign Components
import { Form, Button, Select, Table, Popconfirm, Input, InputNumber, Spin, message, Row, Col, Modal } from 'antd';
// -- style
import './style.scss'
import api from '../../../api'

const menuType = ['菜单', '按钮']
const cssRoot = 'MenuSet'
class MenuSet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,                             //数据请求状态
            dataSource: [],                             //table所用数据
            visible: false,
            checkStatus: null,
        }
    }

    //获取table列表
    getTableList() {
        this.setState({ loading: true })
        api.Menu.Authority_GetAuthorityRoleListByID({ roleID: this.props.ID }).then(res => {
            if (!res) {
                this.setState({ loading: false })
                return message.error('res为空')
            }
            if (res.Ret === 0) {
                const dataSource = this.tableFormat(res.Data)
                this.setState({ dataSource, loading: false })
            } else {
                message.info(res.Msg)
            }
        })
    }

    //转为话table格式
    tableFormat(data) {
        const dataSource = []
        if (!(data && data.length)) return dataSource
        data.forEach(({ ID, PID, Instro, Level, ChildList, Name, Type, Url, AppID, IsChecked }, index, array) => {
            dataSource.push({
                key: ID,
                Name, Type: menuType[Type], Url, AppID,
                children: (ChildList && ChildList.length) ? this.tableFormat(ChildList) : '',
                IsChecked,
                prototypeData: array[index],
            })
        })
        return dataSource
    }

    showModal = () => {
        this.getTableList()
        this.setState({ visible: true })
    }

    handleOnOk = () => {
        const { checkStatus } = this.state
        if (!checkStatus) { return this.setState({ visible: false }) }
        const AuthorityRoleList = []
        for (let key in checkStatus) {
            AuthorityRoleList.push({
                ID: '0',
                AuthorityID: key,
                RoleID: this.props.ID,
                IsAdd: checkStatus[key]
            })
        }
        const body = { AuthorityRoleList }
        this.setState({ loading: true })
        api.Menu.Authority_AddAndRemoveAuthorRole({ body }).then(res => {
            if (res.Ret === 0) {
                message.success('修改成功')
                this.setState({ loading: false, visible: false, checkStatus: null })
            } else {
                message.info(res.Msg)
            }
        })
        console.log(body)
    }

    handleCancel = () => {
        this.setState({ visible: false })
    }

    handleSeleted = (record) => {
        const { checkStatus } = this.state
        let newCheckStatus = { ...checkStatus }
        newCheckStatus[record.key] = !record.IsChecked
        record.IsChecked = !record.IsChecked
        this.setState({ dataSource: this.state.dataSource, checkStatus: newCheckStatus })
    }

    handleRowClassName(record, index) {
        if (record.IsChecked) return 'table-isSelected'
        return 'table-notSelected'
    }

    render() {
        const columns = [
            { title: '名称', dataIndex: 'Name', width: '20%', },
            { title: '类型', dataIndex: 'Type', width: '20%', },
            { title: '地址（URL）', dataIndex: 'Url', width: '20%', },
            { title: 'APPID', dataIndex: 'AppID', width: '20%', },
            {
                title: '操作', dataIndex: 'Operation', width: '20%', render: (text, record, index) => {
                    return <a href='javascript:void(0)' onClick={() => this.handleSeleted(record)} className={`${cssRoot}-columns-a`}>{record.IsChecked ? '选中' : '未选中'}</a>
                }
            },
        ]
        return (
            <span onClick={this.showModal}>
                {this.props.children}
                <Modal
                    width='1000px'
                    onOk={this.handleOnOk}
                    onCancel={this.handleCancel}
                    title='菜单设置'
                    visible={this.state.visible}>
                    <Spin spinning={this.state.loading}>
                        <Table
                            className={`${cssRoot}-table`}
                            dataSource={this.state.dataSource}
                            columns={columns}
                            rowClassName={(record, index) => this.handleRowClassName(record, index)}
                        />
                    </Spin>
                </Modal>
            </span>

        )
    }
}

//限定控件传入的属性类型
MenuSet.propTypes = {

}

//设置默认属性
MenuSet.defaultProps = {

}
export default MenuSet