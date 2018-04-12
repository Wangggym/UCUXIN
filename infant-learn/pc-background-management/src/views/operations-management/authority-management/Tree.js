import React from 'react'
import PropTypes from 'prop-types'
import { Tree, message, Spin } from 'antd';
import api from '../../../api'

const TreeNode = Tree.TreeNode;
function getNewTreeData(treeData, pos, child) {
    const array = pos.split('-')
    console.log(array)
    switch (array.length) {
        case 2:
            treeData[array[1]].children = child
            break
        case 3:
            treeData[array[1]].children[array[2]].children = child
            break
    }
    return treeData
}


export default class TreeComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            treeData: [],
            selectedKeys: [],
            loading: false
        }
        this.userID = null
        this.firstTreeData = []
    }
    componentWillMount() {
        api.AuthorityManagement.GetUserAreaID().then(res => {
            if (!res) {
                return message.error('res为空')
            }
            if (res.Ret === 0) {
                this.userID = res.Data
                this.defaultSelect()
            } else {
                message.info(res.Msg)
            }
        })
    }
    componentDidMount() {
        this.getTreeData()
    }

    getTreeData = (ID = 0, pos) => {
        // if (!ID) this.setState({ loading: true })
        return api.AuthorityManagement.GetRegion({ rid: ID }).then(res => {
            if (!res) {
                return message.error('res为空')
            }
            if (res.Ret === 0) {
                if (!ID) {
                    this.firstTreeData = res.Data
                    return this.setState({ treeData: res.Data });
                    this.defaultSelect()
                }
                const treeData = getNewTreeData(this.state.treeData, pos, res.Data)
                return this.setState({ treeData });
            } else {
                message.info(res.Msg)
            }
        })
    }

    defaultSelect() {
        if (this.userID && this.firstTreeData) {
            const selectedKeys = [this.userID.toString()]
            this.setState({ selectedKeys })
            this.props.onChange(selectedKeys[0])

        }
    }

    onSelect = (selectedKeys, e) => {
        console.log(selectedKeys, e)
        this.setState({ selectedKeys })
        this.props.onChange(selectedKeys[0])
    }

    onLoadData = (treeNode) => {
        if (treeNode.props.children && treeNode.props.children.length) return new Promise((resolve) => resolve())
        return this.getTreeData(treeNode.props.eventKey, treeNode.props.pos)
    }

    render() {
        const loop = data => data.map(({ ID, Name, Type, children }) => {
            if (children) {
                return <TreeNode title={Name} key={ID}>{loop(children)}</TreeNode>;
            }
            return <TreeNode title={Name} key={ID} isLeaf={Type === 3} />;
        });
        const treeNodes = loop(this.state.treeData);
        return (
            <Spin spinning={this.state.loading}>
                <Tree onSelect={this.onSelect} loadData={this.onLoadData} showLine selectedKeys={this.state.selectedKeys}>
                    {treeNodes}
                </Tree>
            </Spin>
        );
    }
}

//限定控件传入的属性类型
TreeComponent.propTypes = {
    onChange: PropTypes.func
}

//设置默认属性
TreeComponent.defaultProps = {
    onChange: f => f
}
