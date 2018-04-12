import React from 'react'
import PropTypes from 'prop-types'
import { message, Form } from 'antd'
// import { webApi } from '../../__share'
//******************************************** */
//      modal弹出框逻辑、请求高阶控件
//******************************************** */
function modeWrapper(getUrl, postOrPutUrl) {
    return function (Comp) {
        class FormComponent extends React.Component {
            constructor(props) {
                super(props)
                this.state = {
                    visible: false,
                    loading: false,
                }
            }

            componentWillRecevieProps(nextProps) {
                if (nextProps.onOff !== undefined && nextProps.onOff !== this.props.onOff) {
                    this.setState({ visible: nextProps.onOff })
                    !nextProps.onOff && this.props.form.resetFields()
                }
            }

            toggle(boolean) {
                const { changeOnOff } = this.props
                changeOnOff ? changeOnOff(boolean) : this.setState({ visible: boolean })
            }

            showModal() {
                this.toggle(true)
                const { extraValue, ID } = this.props
                if (getUrl) {
                    if (ID) {
                        this.setState({ loading: true })
                        getUrl({ ID }).then(result => {
                            if (result.Msg) return message.error(result.Msg)
                            this.props.form.setFieldsValue(this.getDeal(result.Data))
                            this.setState({ loading: false })
                        })
                    }
                } else if (extraValue) {
                    this.props.form.setFieldsValue(extraValue)
                }
            }

            handleSubmit(value) {
                this.setState({ loading: true })
                let ID = 0
                let operationType = '添加'
                if (this.props.ID) {
                    ID = this.props.ID
                    operationType = '修改'
                }
                const body = { ...value, ID }
                postOrPutUrl({ body }).then(result => {
                    this.setState({ loading: false })
                    if (result.Msg) return message.error(result.Msg)
                    result.operationType = operationType
                    this.toggle(false)
                    this.props.callback(result)
                    this.props.form.resetFields()
                })
                console.log(operationType, body)
            }

            handleOk(e, value) {
                if (value) return this.handleSubmit(this.postDeal(value))
                if (!postOrPutUrl) return message.error('请在代码中传入post或者putAPI')
                this.props.form.validateFields((err, value) => {
                    if (err) return message.error('请填入正确信息！')
                    this.handleSubmit(this.postDeal(value))
                })
            }

            handleCancel() {
                this.toggle(false)
                this.props.form.resetFields()
            }



            //******************************************************提交代码函数处理 */
            postDeal(value) {

                return value
            }

            //******************************************************后台返回数据处理 */
            getDeal(data) {

                return data
            }
            render() {
                const { visible, loading } = this.state
                const { disabled } = this.props
                // const { getFieldDecorator } = this.props.form
                const modal = <Comp
                    {...this.props}
                    visible={visible}
                    loading={loading}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                />
                return (
                    <span
                        onClick={this.showModal.bind(this)}
                        disabled={disabled} >
                        {this.props.children}
                        {visible && modal}
                    </span>
                )
            }
        }
        //*****************************************限定控件传入的属性类型--说明书 */
        FormComponent.propsTypes = {
            callback: PropTypes.func.isRequired,    //回传到父组件方法
            ID: PropTypes.string,                 //组件识别get,post方法唯一关键ID,也是修改ID.在修改组件中传入
            extraValue: PropTypes.object,           //附加需要提交的数据，或者是在修改时显示数据
            disabled: PropTypes.bool,               //组件是否禁用，在传入自定义按钮样式时需要同样传入该属性

            //*************************扩展方法可在父级组件处控制modal的显示与隐藏 */
            onOff: PropTypes.bool,                  //当前显示隐藏状态
            changeOnOff: PropTypes.func,          //与父组件双向绑定回传参数
        }
        return Form.create()(FormComponent)
    }
}
export default modeWrapper