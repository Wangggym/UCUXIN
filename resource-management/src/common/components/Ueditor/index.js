import React, {Component} from 'react';
import UE from 'UEditor';
import PropTypes from 'prop-types';

class UEditor extends Component {
  static propTypes = {
    width: PropTypes.string,
    id: PropTypes.string,
    config: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.string
  }
  static defaultProps = {
    width: '100%',
    id: undefined,
    config: {},
    onChange(){},
    value: undefined
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const {id} = this.props;
    this.setState({
      id: `UE${id ? `-${id}` : ''}-${(new Date().getTime()).toString()}`
    })
  }

  componentDidMount() {
    this.initEditor()
  }

  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    UE.delEditor(this.state.id);
  }
  initEditor = () => {
    const {config, onChange, value} = this.props;
    const {id} = this.state;
    const ueEditor = UE.getEditor(id, config);


    ueEditor.ready((ueditor) => {
      if (!ueditor) {
        UE.delEditor(id);
        this.initEditor();
      }

      // 当值改变时将值返回
      ueEditor.addListener('contentChange', () => onChange(ueEditor.getContent()));
      // 初始化时设置默认值
      value && ueEditor.setContent(value)
    })
  }

  render() {
    const {width} = this.props;
    const {id} = this.state;
    return (
      <script id={id} name="content" type="text/plain" style={{width}}/>
    )
  }
}

export default UEditor;
