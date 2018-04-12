import React from 'react';
import {Input} from 'antd';
import {connect} from 'react-redux';
//可编辑的表格内容
class EditableCell extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    value: this.props.value,
    editable: this.props.editable,
  }
  componentWillReceiveProps (nextProps,nextState){
    this.setState({
      editable:nextProps.editable
    })
  }
  handleChange = (e) => {
    const value = e.target.value;
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
    this.setState({value});
  }

  render() {
    const {value, editable} = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
            </div>
        }
      </div>
    );
  }
}
const mapStateToProps = (state)=> {
  // console.log(state)
  return {
    isEdit: state.editState
  }
}
export default connect(mapStateToProps)(EditableCell)
