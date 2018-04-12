import React from 'react'
import { Tabs, Toast } from 'antd-mobile';
import style from './page.less'
import api from "../../api";
import { CourseItem, GetMore, GoToStudy } from '../../components'

export default class CollectList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabs: [{
                title: '全部', ID: '0'
            }],
            SubjectID: '0',
        }
    }

    componentDidMount() {
        api.GetSubjectList().then(res => {
            if (res.Ret === 0) {
                this.setState({ tabs: this.formatTabs([{ Name: '全部', ID: '0' }, ...res.Data]) })
            }
        })
    }

    //格式话tab数据
    formatTabs = (data) => {
        const newData = []
        if (!(data && data.length)) return newData
        return data.map(({ ID, Name: title }) => {
            return { title, ID }
        })
    }


    handleChange = ({ ID: SubjectID }) => {
        this.setState({ SubjectID })
    }


    render() {
        let { tabs, tabsData, SubjectID } = this.state
        const renderContent = ({ ID }) => <TabsContent SubjectID={ID} />
        return <div>
            <Tabs
                tabs={tabs}
                animated={true}
                renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />}
                onChange={this.handleChange}>
                {renderContent}
            </Tabs>
        </div>
    }
}


class TabsContent extends React.Component {
    state = {
        ViewModelList: []
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.SubjectID === '0') {
            const { SubjectID, CursorID } = this.conditionChange(this.props.SubjectID)
            api.GetFavList({ SubjectID, CursorID }).then(res => {
                if (res.Ret === 0) {
                    this.setState({ ...res.Data })
                }
            })
        }
    }

    componentDidMount() {
        this.GetFavList(this.conditionChange(this.props.SubjectID))
    }

    conditionChange = (SubjectID = '0', CursorID = '0') => {
        const newSubjectID = this.props.SubjectID || SubjectID
        return { SubjectID: newSubjectID, CursorID }
    }


    //list数据接口
    GetFavList = ({ SubjectID, CursorID }) => {
        api.GetFavList({ SubjectID, CursorID }).then(res => {
            if (res.Ret === 0) {
                const prototypeViewModelList = res.Data.ViewModelList || []
                const ViewModelList = [...this.state.ViewModelList, ...prototypeViewModelList]
                this.setState({ ...res.Data, ViewModelList, firstLoading: false })
            }
        })
    }

    //点击加载更多
    handleGetMore = (CursorID) => {
        this.GetFavList(this.conditionChange(this.props.SubjectID, CursorID))
    }

    //点击取消收藏
    handleClose = (CoursePeriodID) => {
        api.SetFavarite({ body: { CoursePeriodID, isFav: false } }).then(res => {
            if (res.Ret === 0) {
                this.setState({ ViewModelList: [...this.state.ViewModelList].filter(item => item.CoursePeriodID !== CoursePeriodID) }, () => {
                    Toast.info('已取消收藏', 1)
                })
            }
        })
    }

    render() {
        const { ViewModelList = [], HasNext = false, CursorID = '0', firstLoading = true } = this.state
        return <div>
            {ViewModelList && ViewModelList.length ? ViewModelList.map((item, index) =>
                <CourseItem
                    key={index}
                    {...item}
                    modal={'collectList'}
                    onClose={this.handleClose}
                />
            ) : <GoToStudy firstLoading={firstLoading} />}
            {HasNext && <GetMore onClick={() => this.handleGetMore(CursorID)} />}
        </div>
    }
}










