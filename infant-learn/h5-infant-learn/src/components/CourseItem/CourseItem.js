import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames';
import './style.scss'
import {TimeShow} from '../index'
//培训计划item
// 培训类型 1-国培 2-省培3-市培 4-区县培
const TrainTypeColor = {
  1: 'green',
  2: 'orange',
  3: 'orange',
  4: 'black',
};


const IconTop = (TrainType) => classNames({
  'icon-top': true,
  [`${TrainTypeColor[TrainType]}-background`]: true,
});

const IconRight = (TeachWay) => classNames({
  'icon-right': true,
  [`${TeachWayColor[TeachWay]}-background`]: true,
});

// =============================================
const TeachWayColor = {
  3: 'blue',
  2: 'green',
  1: 'orange',
};


const CourseItem = ({className, Size, style, onClick, ID, Name, CourseType, TrainType, TrainTypeDesc, Credit, QtyLimit, QtySignUp, Count, TotalFee, CoverImg, TrainSDate, TrainEDate, blankTotalFee, IsSignUp, TeachWayDesc, TeachWay, EDate, SDate, noBold}) => {
  const priceStatus = () => {
    if (blankTotalFee) return null
    if (IsSignUp) return <span className='grey-color'>已报名</span>
    if (QtyLimit && QtySignUp === QtyLimit && CourseType !== 4 && QtyLimit != 0) return <span className='grey-color'>名额已满</span>
    if (!TotalFee) return <span className='orange-font'>免费</span>
    return <span className='orange-font'>￥{TotalFee}</span>
  };

  // 标签类型
  const renderPicSign = () => {
    switch (CourseType) {
      case 1:
        return TrainTypeDesc && <span className={IconTop(TrainType)}>{TrainTypeDesc}</span>;
      case 4:
        return TeachWayDesc && <span className={IconRight(2)}>专辑</span>;
      default:
        return <div>
          {
            TrainTypeDesc && <span className={IconTop(TrainType)}>{TrainTypeDesc}</span>
          }
          {
            TeachWayDesc && <span className={IconRight(TeachWay)}>{TeachWayDesc}</span>
          }
        </div>
    }
  };

  //报名
  const getApply = () => {
    if (QtyLimit === undefined && QtySignUp === undefined) return
    if (CourseType === 4 && QtyLimit) {
      return <span>报名：{QtySignUp}</span>
    } else {
      if (QtyLimit == '0' || QtyLimit == undefined) {
        return `报名：${QtySignUp}`
      } else {
        return `报名：${QtySignUp}/${QtyLimit}`
      }
    }
  }

  return (
    <div className={`course-item activeClass ${className}`} onClick={() => setTimeout(onClick, 200)} style={style}>
      <div className='pic'>
        {
          renderPicSign()
        }

        <img src={CoverImg}/>
        {TeachWay === 2 && EDate && SDate &&
        <span className='icon-bottom'><TimeShow EDate={EDate} SDate={SDate}/></span>}
        {TeachWay === 2 && EDate && SDate &&
        <span className='icon-bottom'><TimeShow EDate={EDate} SDate={SDate}/></span>}
        {Size && CourseType === 4 && <span className='icon-bottom'>{(Size / 1024 / 1024).toFixed(1)}MB</span>}
      </div>
      <div className='content'>

        <div className='title'>{TrainTypeDesc && `【${TrainTypeDesc}】`}{Name}</div>
        <div className='classify'>
          <span>共{Count}个课时</span>
          <span>学分:{Credit}分</span>
        </div>
        {/*{TeachWayDesc && <div className='classify'>*/}
        {/*<span>授课方式：{TeachWayDesc}</span>*/}
        {/*</div>}*/}
        <div className='classify'>
          {getApply()}
          {priceStatus()}
        </div>
      </div>
    </div>
  )
}

//限定控件传入的属性类型
CourseItem.PropTypes = {
  blankTotalFee: PropTypes.bool, //是否显示价格 default:false
}

//设置默认属性
CourseItem.defaultProps = {
  onClick: f => f
}

export default CourseItem
