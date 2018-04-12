import React from 'react'
import PropTypes from 'prop-types'
import { trainPlan } from '../../../api'
import { CourseItem, T_Time, T_collect, LongListWrappedComp, CollectButton } from '../../../components'
import { Link, withRouter } from 'react-router-dom'
import { SwipeAction, Toast, Popover, NavBar, Icon } from 'antd-mobile';

const Item = Popover.Item;
function addEvent(obj, type, fn) {
    if (obj.attachEvent) {
        obj['e' + type + fn] = fn;
        obj[type + fn] = function () { obj['e' + type + fn](window.event); }
        obj.attachEvent('on' + type, obj[type + fn]);
    } else
        obj.addEventListener(type, fn, false);
}
function removeEvent(obj, type, fn) {
    if (obj.detachEvent) {
        obj.detachEvent('on' + type, obj[type + fn]);
        obj[type + fn] = null;
    } else
        obj.removeEventListener(type, fn, false);
}

class MyCourse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            IsFavor: true,
            visible: false,
            selected: '',
        }
        this.timer = null
    }
    componentDidMount() {
        addEvent(this.refs.container, "touchstart", this.onTouchStart.bind(this))
        addEvent(this.refs.container, "touchmove", this.onTouchMove.bind(this))
        addEvent(this.refs.container, "touchend", this.onTouchEnd.bind(this))
    }
    componentWillUnmount() {
        removeEvent(this.refs.container, "touchstart", this.onTouchStart)
        removeEvent(this.refs.container, "touchmove", this.onTouchMove)
        removeEvent(this.refs.container, "touchend", this.onTouchEnd)
    }

    onTouchStart(e) {
        this.timer = setTimeout(() => this.setState({ visible: true }), 500)
    }
    onTouchMove(e) {
        clearTimeout(this.timer)
    }
    onTouchEnd(e) {
        clearTimeout(this.timer)
    }

    handlePress = (rid) => {
        const IsFavor = !this.state.IsFavor
        this.setState({ IsFavor })
        trainPlan.favorCourse({ rid }).then(res => {
            if (!res) return
            if (res.Ret === 0) {
                Toast.success(T_collect(IsFavor), T_Time)
            }
        })
    }

    onSelect = (opt) => {
        // console.log(opt.props.value);
        this.setState({
            visible: false,
            selected: opt.props.value,
        });
    };

    handleVisibleChange = (visible) => {
        if (!visible) setTimeout(() => this.setState({ visible: false }), 150)
    };


    handleClick = (ID) => {
        setTimeout(() => this.props.history.push({ pathname: `/course-detail/${ID}` }), 200)
    }



    render() {
        const { ID } = this.props
        const { IsFavor } = this.state
        let offsetX = -10; // just for pc demo
        if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
            offsetX = -26;
        }
        return (
            <div className='my-course' ref="container">
                <Popover
                    mask
                    overlayClassName="fortest"
                    overlayStyle={{ color: 'currentColor' }}
                    visible={this.state.visible}
                    overlay={[
                        (<Item key="4" value="scan"><CollectButton ID={this.props.ID} onClick={() => this.props.onRefresh()} favorType={2}/></Item>),
                    ]}
                    align={{
                        overflow: { adjustY: 10000, adjustX: 10000 },
                        offset: [offsetX, 0],
                    }}
                    onVisibleChange={this.handleVisibleChange}
                    onSelect={this.onSelect}
                >
                    <CourseItem {...this.props} blankTotalFee onClick={() => this.handleClick(this.props.ID)} style={this.state.visible ? { background: '#ddd' } : null} />
                </Popover>
            </div>
        )
    }
}

//限定控件传入的属性类型
MyCourse.propTypes = {

}

//设置默认属性
MyCourse.defaultProps = {

}

export default LongListWrappedComp(trainPlan.getMyFavorCoursePage)(withRouter(MyCourse))

