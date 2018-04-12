import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
const cssRoot = 'AddTestPaper'
const TextArea = Input.TextArea

export default class TestPaperTitle extends React.Component {
    constructor(props) {
        super(props)
    }

    handleChange(field, value) {
        this.props.onChange(field, value)
    }

    render() {
        const { Name, Subtitle, Desc, Remark } = this.props
        return <div >
            <TextArea
                placeholder='试卷名称（必填）'
                className={`${cssRoot}-textArea`}
                rows={1}
                value={Name}
                onChange={(e) => this.handleChange('Name', e.target.value)}
            />
            <TextArea
                placeholder='副标题（选填）'
                className={`${cssRoot}-textArea`}
                rows={1}
                onChange={(e) => this.handleChange('Subtitle', e.target.value)}
                value={Subtitle}
            />
            <TextArea
                placeholder='试卷描述，该信息考生不可见（必填）'
                className={`${cssRoot}-textArea`}
                rows={2}
                onChange={(e) => this.handleChange('Desc', e.target.value)}
                value={Desc}
            />
            <TextArea
                placeholder='考试说明，该信息考生可见（选填）'
                className={`${cssRoot}-textArea`}
                rows={2}
                onChange={(e) => this.handleChange('Remark', e.target.value)}
                value={Remark}
            />
        </div>
    }
}

//限定控件传入的属性类型
TestPaperTitle.propTypes = {
    onChange: PropTypes.func.isRequired,
    Name: PropTypes.string.isRequired,
    Subtitle: PropTypes.string.isRequired,
    Desc: PropTypes.string.isRequired,
    Remark: PropTypes.string.isRequired,
}

//设置默认属性
// TestPaperTitle.defaultProps = {

// }
