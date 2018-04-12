import React from 'react'

const getLog = () => {
  console.log('111')
}


class parentBox extends React.Component {
  render() {
    return <div id="container">
      <PullDown/>
    </div>
  }
}


export default class PullDown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataResourse: [1, 1, 1,]
    }
  }

  componentDidMount() {
    document.getElementById('container').addEventListener('scroll', getLog, false);
    this.refs.container.addEventListener('touchstart', () => console.log('111'), false);
  }


  componentWillUnmount() {
    // this.refs.container.removeEventListener('scroll', fn, false);
  }


  pullDown() {
    let totalHeight = this.refs.container.offsetHeight;// 容器总高度
    let scrollTop = this.refs.container.scrollTop; // 被卷去的高度
    let scrollHeight = this.refs.container.scrollHeight; // 滚动条总高度
    if (scrollTop + scrollHeight == totalHeight) {
      console.log('已经滚动到底了。。')
      this.setState({dataResourse: [...this.state.dataResourse].push(1)})
    }
  }


  render() {
    const {dataResourse} = this.state
    return (
      <div>
        <div ref="container" id="container">
          <div className="render-header">123123</div>
          <div className="render-main">
            {dataResourse && dataResourse.length ? dataResourse.map((item, index) => <div key={index}>
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
              <br/>
              生成的数据
            </div>) : null}
          </div>
          <div className="render-footer">下部分</div>
        </div>
      </div>
    )
  }
}
