import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, DatePicker, Select, message, Button, Row, Cascader, AutoComplete} from 'antd'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const Option = Select.Option
const SearchInput = Input.Search

const getOption = (Type) => {
    const array = []
    if (!(Type && Type.length)) return array
    Type.forEach(({ID, Name}) => {
        array.push(<Option value={ID} key={ID}>{Name}</Option>)
    })
    return array
}

const formatData = (data) => {
    if (!(data && data.length)) return []
    return data.map(({DisplayName, GID}) => {
        return {Name: DisplayName, ID: GID}
    })
}

class ConditionSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            gid: [],
            rid: [],
            type: '1',
        }
    }

    componentDidMount() {
        let count = 0
        new Promise((resolve, reject) => {
            this.GetRegionList().then(res => {
                this.setState({rid: this.getCascaderOption(res)})
                count++
                if (count === 1) resolve("成功!")
            })
        }).then(res => {
            this.setState({visible: true})
        })
    }

    GetRegionList = (rid) => {
        return fetch(`https://apitest.ucuxin.com/base/v3/Web/GetRegionList?rid=${rid || 0}&token=${sessionStorage.getItem('token')}`)
            .then(res => res.json())
            .then(res => {
                if (!res) return message.error('res为空')
                if (res.Ret === 0) {
                    return res.Data
                } else {
                    message.info(res.Msg)
                }
            })
    }

    handleSearch = () => {
        this.getSearchValue()
    }

    handleKeyDown = (e) => {
        if (e.watch === 13) this.getSearchValue()
    }

    getSearchValue = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return message.info(err)
            const {gid, type} = this.state
            if (gid.length === 0) return message.info('暂未查询到相关结果')
            const { gid: { key, label } } = fieldsValue
            let Phase = null
            for (let i = 0; i < gid.length; i++) {
                if (gid[i].ID === key) {
                    Phase = gid[i].Phase
                    break
                }
            }
            this.props.onSearch({ ...fieldsValue, Phase })
        })
    }

    handleAutoSearch = (name) => {
        clearTimeout(this.timer)
        const {currentRid: rid} = this.state
        this.timer = setTimeout(() => {
            fetch(`https://apitest.ucuxin.com/mcs/v3/ConfigWeb/GetGroupList?keyWord=${name}&rid=${rid}&token=${sessionStorage.getItem('token')}`)
                .then(res => res.json())
                .then(res => {
                    if (!res) return message.error('res为空')
                    if (res.Ret === 0) {
                        this.setState({gid: res.Data})
                    }
                })
        }, 500)
    }

    handleCascaderChange = (value, selectedOptions) => {
        this.setState({currentRid: value[value.length - 1]})
    }

    handleLoadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        // load options lazily
        this.GetRegionList(targetOption.value).then(res => {
            targetOption.loading = false;
            targetOption.children = this.getCascaderOption(res)
            this.setState({rid: [...this.state.rid]})
        })
    }

    getCascaderOption = (data) => {
        const newData = []
        if (!(data && data.length)) return newData
        data.forEach(({RID, Name, Type}) => {
            newData.push({label: Name, value: RID, isLeaf: Type === 3})
        })
        return newData
    }

    handleChange = (type) => {
        this.setState({type})
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {style} = this.props
        const {type} = this.state
        return (
            <div>
                {this.state.visible ? <Form layout="inline" style={style}>
                     <FormItem
                        label="机构所属省市县"
                    >
                        {getFieldDecorator('rid',{ rules: [{
                                required: true, message: '机构所属省市县必填',
                            }]})(
                            <Cascader
                                style={{width: 200}}
                                options={this.state.rid}
                                loadData={this.handleLoadData}
                                onChange={this.handleCascaderChange}
                                changeOnSelect
                                placeholder='请选择省市县'
                            />
                        )}
                    </FormItem>
                    <FormItem label='学校名称'>
                        {getFieldDecorator('gid',{ rules: [{
                                required: true, message: '学校必填',
                            }]})(
                            <AutoComplete
                                labelInValue
                                dataSource={this.state.dataSource}
                                style={{width: 200}}
                                onSearch={this.handleAutoSearch}
                                placeholder="请输入学校信息"
                            >
                                {getOption(this.state.gid)}
                            </AutoComplete>
                        )}
                    </FormItem>

                    <FormItem>
                        <Button type="primary" onClick={this.handleSearch}>查询</Button>
                    </FormItem>
                </Form> : null}
            </div>
        )
    }
}

//限定控件传入的属性类型
ConditionSearch.propTypes = {}

//设置默认属性
ConditionSearch.defaultProps = {}

export default Form.create()(ConditionSearch)

