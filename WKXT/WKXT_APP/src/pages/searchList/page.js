import React from 'react'
import style from './page.less'
import { SearchComp, CourseItem, GetMore } from '../../components'
import api from "../../api";
import kong from '../../public/assets/kong@2x.png'

class SearchList extends React.Component {
    state = {
        ViewModelList: [],
        searchValue: '',
        firstShow: true,
    }

    handleSearch = (value) => {
        this.GetCoursePeriodList({ Keyword: value })
    }

    //list数据接口
    GetCoursePeriodList = ({ Keyword, CursorID = '0' }) => {
        api.GetCoursePeriodList({ CursorID, Keyword }).then(res => {
            if (res.Ret === 0) {
                this.setState({ ...res.Data, searchValue: Keyword, firstShow: false })
            }
        })
    }

    //点击加载更多
    handleGetMore = (CursorID) => {
        this.GetCoursePeriodList({ Keyword: this.state.searchValue, CursorID })
    }

    render() {
        const { ViewModelList = [], HasNext = false, CursorID = '0', firstShow = true } = this.state
        return <div>
            <SearchComp onSearch={this.handleSearch} />
            <div>
                {ViewModelList && ViewModelList.length ? ViewModelList.map((item, index) =>
                    <CourseItem key={index} {...item} modal={'searchList'} />
                ) : null}
                {!firstShow && !(ViewModelList && ViewModelList.length) && <div className={style.notfound}>
                    <img src={kong} alt="" />
                    <p>没有找到你想要的课程</p>
                </div>}
                {HasNext && <GetMore onClick={() => this.handleGetMore(CursorID)} />}
            </div>
        </div>
    }
}

export default SearchList