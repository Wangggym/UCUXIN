/**
 * Created by QiHan Wang on 2017/9/29.
 * Plyr
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import plyr from 'plyr';
import 'plyr/dist/plyr.css';

const sourceConfig = (url, type='video', title='title')=>{
  return {
    type,
    title,
    sources: [
      {
        src: url,
        type: 'video/mp4'
      },
      {
        src: url,
        type: 'video/webm'
      }
    ]
  }
};

class Plyr extends Component {
  static propTypes = {
    options: PropTypes.object,  // this is an options object from the docs
    source: PropTypes.object,  // this is a source object from the docs
  };

  constructor(props) {
    super(props);
    this.state = {
      source: sourceConfig(this.props.url)
    }
  }
  componentDidMount() {
    this.player = plyr.setup(ReactDOM.findDOMNode(this), this.props.options)[0];
    this.player.source(this.state.source);
    this.player.play();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.url && nextProps.url !== this.props.url){
      this.player.source(sourceConfig(nextProps.url));
    }
    if (nextProps.isClose !== undefined && nextProps.isClose !== this.props.isClose) {
      if(this.props.isClose){
        this.player.pause();
      }else{
        this.player.play();
      }
    }
  }

  componentWillUnmount() {
    this.player.destroy();
  }

  render() {
    return (<video data-plyr='{}'/>);
  }
}

export default Plyr;
