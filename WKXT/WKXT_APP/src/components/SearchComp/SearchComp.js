import React, { Fragment } from 'react'
import style from './SearchComp.less'
import Link from 'umi/link';
import { Toast } from 'antd-mobile';
class SearchComp extends React.Component {
    state = {
        value: ''
    }

    componentDidMount() {
        const input = this.refs.input
        input && input.focus()
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value })
    }

    handleSearch = () => {
        const value = this.state.value.trim()
        if (!value) return Toast.info('请输入课程名称', 1)
        this.props.onSearch(this.state.value)
    }

    render() {
        const { linkto, onSearch, onFocus } = this.props
        let element = null
        if (linkto) {
            element = <div className={style.SearchComp_linkto}>
                <div>
                    <input
                        type="text"
                        maxLength="20"
                        placeholder="输入微课名称查询"
                        onFocus={onFocus}
                    />
                </div>
                <Link to="/collectList">
                    <span className={style.collect}></span>
                </Link>
                <Link to="/learnRecord">
                    <span className={style.history}></span>
                </Link>
                <Link to={(sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).MTypeID !== 11) ? "/learningReport" : '/classReport'}>
                    <span className={style.ranking}></span>
                </Link>
            </div>
        } else {
            element = <div className={style.SearchComp}>
                <div><input type="search" maxLength="16" onChange={this.handleChange} value={this.state.value}
                    ref={'input'} /></div>
                <span onClick={this.handleSearch}>搜索</span>
            </div>
        }
        return <Fragment>
            {element}
        </Fragment>
    }
}

export default SearchComp