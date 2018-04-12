/**
 * Created by Yu Tian Xiong on 2017/12/18.
 */
import React, {Component} from 'react';
import {Input, Form, Select, Button, Table, message, Modal, Radio, DatePicker, Popover} from 'antd';
import {withRouter} from 'react-router-dom';
import PublicFuc from '../../basics/publicFuc';
import Addinfo from './Addinfo';
import Api from '../../api';
import './infoTab.less';
import moment from 'moment';

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const {TextArea} = Input;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

class InfoTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            channelList: [],
            ContentType: '',
            ChannelID: '',
            Status: '',
            IsRefContent: '',
            Keyword: '',
            GID: '',
            CreateUID: '',
            pagination: {current: 1, pageSize: 5},
            sort: '',
            sortType: '1',//排序
            sortOne: '1',
            sortTwo: '1',
            sortThree: '1',
            sortFour:'1',
            visible: false,//操作关闭模态框
            startvisible: false,//开启模态框
            addinfo: false,
            closeDesc: '',
            ContentID: '',
            loading: false,
            modelValue: '',
            data: {type: 0, date: null},
        };
        //加载列表条数
        this.columns = [
          {
            title: '列表',
            dataIndex: 'cake',
            width:180,
            render:(text,record)=>(
              <div className="thumb-img">
                  <img src={PublicFuc.handleContentStatus(record.Status)} alt="" className="status-img"/>
                  <img src={record.Thumb} className="item-img"/>
              </div>
            )
          },
            {
                title: '列表',
                dataIndex: 'List',
                render: (text, record) => (
                    <div className="list-item">
                        <div className="content-text">
                            <div>
                                <span className="article"
                                      style={{fontSize: 18}}>【{PublicFuc.handleContentType(record.ContentType)}】</span>
                                <span style={{fontSize: 18}}>{record.Title}</span>
                                {/*文章操作*/}
                                <span className="button-right">
                                    {(record.Status === 8 && record.ContentType === 14) || (record.Status === 11 && record.ContentType === 14) ?
                                        <Button className="operation-btn">导出用户</Button> : null}
                                    {record.Status === 5 ? <Button className="operation-btn"
                                                                   onClick={() => this.showNowPublishConfirm(record.ContentType, record.ID)}>立即发布</Button> : null}
                                    {record.Status === 0 || record.Status === 2 || record.Status === 3 || record.Status === 5 || record.Status === 8 || record.Status === 9 ?
                                        <Button className="operation-btn"
                                                onClick={() => this.goDetailEdit(record.ID,record.ContentType)}>编辑</Button> : null}
                                    {record.Status === 5 || record.Status === 8 ? <Button className="operation-btn"
                                                                                          onClick={() => this.handleCloseInfo(record.ContentType, record.ID)}>关闭</Button> : null}
                                    {record.Status === 9 ? <Button className="operation-btn"
                                                                   onClick={() => this.handleStartInfo(record.ContentType, record.ID)}>开启</Button> : null}
                                    {record.Status === 0 || record.Status === 9 ? <Button className="operation-btn"
                                                                                          onClick={() => this.deleteInfo(record.ContentType, record.ID)}>删除</Button> : null}
                                </span>
                            </div>
                            <div className="item-info">
                                {record.Author !== null ? <span className="item-one">作者:{record.Author}</span> : null}
                                <span className="item-one">所在频道：{record.ChannelsName}</span>
                                {record.PublishUName && <span className="item-one">发布人：{record.PublishUName}</span>}
                                {record.PublishDate != null ?
                                    <span className="item-one">发布时间：{record.PublishDate}</span> : null}
                                {record.PublishTimerDate != null ?
                                    <span className="item-one">定时发布时间：{record.PublishTimerDate}</span> : null}
                                {record.CloseUName ? <span className="item-one">关闭人：{record.CloseUName}</span> : null}
                                {record.CloseDate != null && record.Status === 9 ?
                                    <span className="item-one">关闭时间：{record.CloseDate}</span> : null}
                                <span style={{float: 'right'}}><span style={{marginLeft: '10px'}}><img
                                    src={require('../../assets/images/PraiseCount.png')}/>&nbsp;&nbsp;{record.PraiseCount}</span><span
                                    style={{marginLeft: '10px'}}><img
                                    src={require('../../assets/images/NolikeCount.png')}/>&nbsp;&nbsp;{record.NolikeCount}</span></span>
                            </div>
                            {record.Summary !== null ? <div className="item-info"
                                                            style={{marginBottom: 10}}>{PublicFuc.changeString(record.Summary)}</div> :
                                <div style={{marginBottom: 10}}></div>}
                            <div className="item-infoOne">
                                {record.RefContents !== null && <span>关联内容:</span>}
                                {Array.isArray(record.RefContents) && record.RefContents.map((item,i) =>
                                    <Popover placement="bottom" title={text} content={item.Title.map((item,i)=><div key={i}><a>{item}</a></div>)}
                                             trigger="click" key={i}>
                                        <Button
                                            className="infoOne-btn">{PublicFuc.handleContentType(item.ContentType)}</Button>
                                    </Popover>
                                )}
                                <span style={{float: "right", position: "absolute", right: '0'}}><span
                                    className="one-left"><img src={require('../../assets/images/see.png')} alt=""
                                                              style={{position: 'relative', top: '1px'}}/>&nbsp;&nbsp;
                                    <span className="middle-p">预览&nbsp;{record.ReadCount}</span></span>
                                <span className="one-left"><img src={require('../../assets/images/favorite.png')}
                                                                alt=""/>&nbsp;&nbsp;<span
                                    className="middle-p">收藏&nbsp;{record.FavoriteCount}</span></span>
                                <span className="one-left"><img src={require('../../assets/images/zhuan.png')}
                                                                alt=""/>&nbsp;&nbsp;<span
                                    className="middle-p">分享&nbsp;{record.ShareCount}</span></span>
                                <span className="one-left"><img src={require('../../assets/images/comment.png')}
                                                                alt=""/>&nbsp;&nbsp;<span
                                    className="middle-p">评论&nbsp;{record.CommentCount}</span></span></span>
                            </div>
                            {record.CloseDesc && record.Status === 9 ?
                                <div className="item-info" style={{color: '#cf331c'}}>
                                    关闭原因:{record.CloseDesc}</div> : null}
                        </div>
                    </div>
                ),
            }
        ];
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.type !== this.props.type) {
            this.setState({ContentType: nextProps.type}, () => {
                this.getList(1, 5);
            });
        }
    }
    componentDidMount() {
        this.getchannelList();
        this.getList(1, 5);
    }
    //获取频道列表
    getchannelList = () => {
        Api.Info.getChannelList().then(res => {
            if (res.Ret === 0) {
                this.setState({
                    channelList: res.Data
                })
            } else {
                message.error(res.Msg);
            }
        })
    };
    //获取列表内容
    getList = (pIndex) => {
        const {ContentType, ChannelID, Status, IsRefContent, Keyword, GID, CreateUID, sort} = this.state;
        const {current, pageSize} = this.state.pagination;
        this.setState({loading: true});
        Api.Info.getList({
            pageIndex: pIndex || current,
            pageSize: pageSize,
            body: {ContentType, ChannelID, Status, IsRefContent, Keyword, GID, CreateUID, SortFields: sort}
        }).then(res => {
            if (res.Ret === 0) {
                let dataSource = [];
                const pagination = {...this.state.pagination};
                if (res.Data) {
                    pagination.total = res.Data.TotalRecords;
                    pagination.current = res.Data.PageIndex;
                    if (res.Data.TotalRecords) {
                        let data = res.Data.ViewModelList;
                        //操作关联内容数据
                        data.map(item => {
                            dataSource.push({
                                ...item,
                                RefContents: this.handleRefContents(item.RefContents)
                            })
                        })
                    }
                }
                this.setState({dataSource, pagination, loading: false});
            } else {
                message.error(res.Msg);
            }
        })
    };
    //处理关联内容类型
    handleRefContents = (type) => {
        if (!(type && type.length)) return;
        const newData = [];
        let newType = [...type];
        const getData = (newType) => {
            let index = null;
            index = newType[0].ContentType;
            let title = [];
            newType.forEach(({ContentType, Title}) => {
                if (ContentType === index) {
                    title.push(Title)
                }
            });
            newData.push({ContentType:index,Title: title});
            let newType2 = newType.filter(({ContentType}) => {
                return ContentType !== index
            });
            if (newType2.length) {getData(newType2)}
        };
        getData(newType);
        return newData;
    };
    //获取资讯详情
    getInfoDetail = (type, id) => {
        Api.Info.getInfoDetail({contentType: type, contentID: id}).then(res => {
            if (res.Ret === 0) {
            } else {
                message.error(res.Msg);
            }
        })
    };
    //操作列表分页
    handleTableChange = (pagination) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({pagination: pager});
        this.getList(pagination.current);
    };
    //--------操作模态窗口的显示隐藏--------
    //确定关闭资讯并调用关闭接口
    handleOk = () => {
        const {ContentType, ContentID, closeDesc, pagination} = this.state;
        if (closeDesc === "") {
            message.warning('请输入关闭原因');
        } else {
            Api.Info.handleCloseInfo({
                contentType: ContentType,
                contentID: ContentID,
                closeDesc: closeDesc
            }).then(res => {
                if (res.Ret === 0) {
                    this.setState({
                        visible: false,
                        // ContentType: '',
                        closeDesc: '',
                    }, () => {
                        this.getList(pagination.current)
                    });
                    message.success('关闭成功');
                } else {
                    message.error(res.Msg);
                }
            });
        }
    };
    //开启资讯
    handleConfirm = () => {
        //publishSendType:1 定时发布   publishSendType:0 即时发布
        const {pagination, data, ContentType, ContentID} = this.state;

        if (data.type === 1 && data.date === null) {
            message.info('请选择定时发布时间');
            return;
        }

        Api.Info.handleStartInfo({
            contentType: ContentType,
            contentID: ContentID,
            publishSendType: data.type,
            publishTimerDate: data.type == 0 ? '' : moment(data.date).format('YYYY-MM-DD HH:mm:ss'),//定时发布时间
        }).then(res => {
            if (res.Ret === 0) {
                this.setState({
                    startvisible: false,
                    // ContentType: ''
                }, () => {
                    this.getList(pagination.current);
                });
                message.success('开启资讯成功');
            } else {
                message.error(res.Msg);
            }
        });
    };
    //新增资讯模态
    handleAddInfo = () => this.setState({addinfo: true});
    handleCancelAddInfo = () => {
        this.setState({
            addinfo: false,
        });
    };
    handleConfrimAdd = () => {
        let {ContentType} = this.state;
        if(ContentType === '' || ContentType==='item_0'){
          this.setState({addinfo: true})
        }else{
          ContentType === '11' && this.props.history.push('/news/editarticle');
          ContentType === '13' && this.props.history.push('/news/editaltas');
          ContentType === '12' && this.props.history.push('/news/edittopic');
          ContentType === '14' && this.props.history.push('/news/editpropaganda');
        }
        // this.setState({addinfo: false})
    };
    handleConfrim = () =>{
      let {modelValue} = this.state;
      modelValue === '' && this.props.history.push('/news/editarticle');
      modelValue === 1 && this.props.history.push('/news/editarticle');
      modelValue === 3 && this.props.history.push('/news/editaltas');
      modelValue === 2 && this.props.history.push('/news/edittopic');
      modelValue === 4 && this.props.history.push('/news/editpropaganda');
    };
    //隐藏关闭资讯模态
    handleCancel = () => {
        this.setState({
            visible: false,
            closeDesc: ''
        });
    };
    //打开关闭模态并赋值
    handleCloseInfo = (type, id) => {
        this.setState({
            visible: true,
            ContentType: type,
            ContentID: id
        });
    };
    //打开开启模态并赋值
    handleStartInfo = (type, id) => {
        this.setState({
            startvisible: true,
            ContentType: type,
            ContentID: id
        });
    };
    //隐藏开启资讯模态
    handleStartCancel = () => {
        this.setState({
            startvisible: false
        })
    };
    //关闭资讯时获取输入的描述信息
    onChangeCloseDesc = (e) => {
        this.setState({closeDesc: e.target.value});
    };
    //操作即时发布
    handleChangeType = (e) => {
        const data = {...this.state.data, type: +e.target.value, date: null};
        this.setState({data});
    };
    handleChangeDate = (value) => {
        const data = {...this.state.data, date: value};
        this.setState({data});
    };
    //------操作下拉选项框的值并进行帅选--------
    //频道
    handleSelectChannelID = (value) => {
        this.setState({
            ChannelID: value,
            sort: ''
        }, () => {
            this.getList(1);
        })
    };
    //状态
    handleSelectContentType = (value) => {
        this.setState({
            Status: value,
            sort: '',
        }, () => {
            this.getList(1);
        })
    };
    //关联内容
    handleSelectIsRefContent = (value) => {
        this.setState({
            IsRefContent: value,
            sort: ''
        }, () => {
            this.getList(1);
        })
    };
    //操作下方选页器
    handleSelectBottom = (value) => {
        let {pagination} = this.state;
        this.setState({
            pagination: {current: pagination.current, pageSize: +value, total: pagination.total}
        }, () => {
            this.getList(1);
        })
    };
    //-----------右侧状态按钮操作-----------
    //立即发布资讯确认框
    showNowPublishConfirm = (type, id) => {
        let _this = this;
        confirm({
            title: '确定立即发布该资讯吗?',
            onOk() {
                Api.Info.nowPublishInfo({contentType: type, contentID: id}).then(res => {
                    if (res.Ret === 0) {
                        _this.getList(1);
                        message.success('发布资讯成功');
                    } else {
                        message.error(res.Msg);
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    };
    //删除资讯确认框
    deleteInfo = (type, id) => {
        let _this = this;
        confirm({
            title: '是否确定删除该资讯?',
            onOk() {
                Api.Info.deleteInfo({contentType: type, contentID: id}).then(res => {
                    if (res.Ret === 0) {
                        _this.getList(1);
                        message.success('删除资讯成功');
                    } else {
                        message.error(res.Msg);
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    //编辑跳转(文章 话题 图集 宣传)
    goDetailEdit = (id,type) => {
        type === 11 && this.props.history.push(`/news/editarticle/${id}`);
        type === 12 && this.props.history.push(`/news/edittopic/${id}`);
        type === 13 && this.props.history.push(`/news/editaltas/${id}`);
        type === 14 && this.props.history.push(`/news/editpropaganda/${id}`);
    };
    //获取组件传过来的值
    getdata = (data) => this.setState({modelValue: data});
    //排序
    //喜欢数
    handleSort = () => {
        let {sortType} = this.state;
        if (sortType === "1") {
            this.setState({
                sortType: "-1",
                sort: [{Field: 'PraiseCount', sortType: "-1",}]
            }, () => {
                this.getList(1);
            })
        } else if (sortType === "-1") {
            this.setState({
                sortType: "1",
                sort: [{Field: 'PraiseCount', sortType: "1",}]
            }, () => {
                this.getList(1);
            })
        }
    };
    //预览数
    handleReadCount = () => {
        let {sortOne} = this.state;
        if (sortOne === "1") {
            this.setState({
                sortOne: "-1",
                sort: [{Field: 'ReadCount', sortType: "-1",}]
            }, () => {
                this.getList(1);
            })
        } else if (sortOne === "-1") {
            this.setState({
                sortOne: "1",
                sort: [{Field: 'ReadCount', sortType: "1",}]
            }, () => {
                this.getList(1);
            })
        }
    };
    //收藏数
    handleFavoriteCount = () => {
        let { sortTwo} = this.state;
        if (sortTwo === "1") {
            this.setState({
                sortTwo: "-1",
                sort: [{Field: 'FavoriteCount', sortType: "-1",}]
            }, () => {
                this.getList(1);
            })
        } else if (sortTwo === "-1") {
            this.setState({
                sortTwo: "1",
                sort: [{Field: 'FavoriteCount', sortType: "1",}]
            }, () => {
                this.getList(1);
            })
        }
    };
    //分享数
    handleShareCount = () => {
        let {sortThree} = this.state;
        if (sortThree === "1") {
            this.setState({
                sortThree: "-1",
                sort: [{Field: 'ShareCount', sortType: "-1",}]
            }, () => {
                this.getList(1);
            })
        } else if (sortThree === "-1") {
            this.setState({
                sortThree: "1",
                sort: [{Field: 'ShareCount', sortType: "1",}]
            }, () => {
                this.getList(1);
            })
        }
    };
    //评论数
    handleCommentCount = () =>{
      let {sortFour} = this.state;
      if (sortFour === "1") {
        this.setState({
          sortFour: "-1",
          sort: [{Field: 'CommentCount', sortType: "-1",}]
        }, () => {
          this.getList(1);
        })
      } else if (sortFour === "-1") {
        this.setState({
          sortFour: "1",
          sort: [{Field: 'CommentCount', sortType: "1",}]
        }, () => {
          this.getList(1);
        })
      }
    };
    //默认
    handleDefault = () =>{
      this.setState({
        sortType: '1',//排序
        sortOne: '1',
        sortTwo: '1',
        sortThree: '1',
        sortFour:'1',
        ContentType: '',
        ChannelID: '',
        Status: '',
        IsRefContent: '',
        Keyword: '',
        GID: '',
        CreateUID: '',
        sort: '',
      },()=>{this.getList(1)})
    };

    render() {
        const {channelList, dataSource, pagination, closeDesc, loading, data, sortType, sortOne, sortTwo, sortThree,ContentType,sortFour} = this.state;
        const icon =
            sortType === "1" ?
                <img src={require('../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
                : <img src={require('../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
        const iconOne =
            sortOne === "1" ?
                <img src={require('../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
                : <img src={require('../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
        const iconTwo =
            sortTwo === "1" ?
                <img src={require('../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
                : <img src={require('../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
        const iconThree =
            sortThree === "1" ?
                <img src={require('../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
                : <img src={require('../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
      const iconFour =
            sortFour === "1" ?
          <img src={require('../../assets/images/ascend.png')} style={{width: 16}} alt=""/>
          : <img src={require('../../assets/images/descend.png')} style={{width: 16}} alt=""/>;
        return (
            <div className="infomation">
                {/* 新增资讯 */}
                <Modal
                    title="选择资讯类型"
                    visible={this.state.addinfo}
                    onOk={this.handleConfrim}
                    onCancel={this.handleCancelAddInfo}
                    width={400}
                >
                    <Addinfo getdata={this.getdata}/>
                </Modal>
                {/* 关闭资讯 */}
                <Modal
                    title="关闭资讯"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <TextArea placeholder="请输入关闭原因" autosize={{minRows: 6, maxRows: 10}}
                              onChange={this.onChangeCloseDesc} value={closeDesc}/>
                </Modal>
                {/* 开启资讯 */}
                <Modal
                    title="开启资讯"
                    visible={this.state.startvisible}
                    onOk={this.handleConfirm}
                    onCancel={this.handleStartCancel}
                >
                    <div className="publish-set">
                        <RadioGroup defaultValue={data.type.toString()} onChange={this.handleChangeType}>
                            <Radio value="0">即时发布</Radio>
                            <Radio value="1">定时发布</Radio>
                        </RadioGroup>
                        {
                            data.type == 1 && <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                onChange={this.handleChangeDate}
                            />
                        }
                    </div>
                </Modal>
                {/*立即发布资讯 */}
                <Modal
                    title="关闭资讯"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <TextArea placeholder="请输入关闭原因" autosize={{minRows: 6, maxRows: 10}}
                              onChange={this.onChangeCloseDesc} value={closeDesc}/>
                </Modal>
                {/* 开启资讯 */}
                <div className="info-search">
                    <Search
                        placeholder="搜索"
                        onSearch={value => {
                            this.setState({Keyword: value, sort: ''}, () => {
                                this.getList(pagination.current);
                            });
                        }}
                        className="search-value"
                    />
                </div>
                {/*下拉选项框*/}
                <Form layout="inline">
                    <FormItem label="频道">
                        <Select defaultValue="全部" style={{width: 120}} onSelect={this.handleSelectChannelID}>
                            <Option value={""}>全部</Option>
                            {Array.isArray(channelList) && channelList.map(item => <Option value={item.ID}
                                                                                           key={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </FormItem>
                    <FormItem label="状态">
                        <Select defaultValue="全部" style={{width: 120}} onChange={this.handleSelectContentType}>
                            <Option value={""}>全部</Option>
                            <Option value={"0"}>草稿</Option>
                            <Option value={"1"}>审核中</Option>
                            <Option value={"2"}>不通过</Option>
                            {/*<Option value={"3"}>编辑发布</Option>*/}
                            <Option value={"5"}>定时发布</Option>
                            <Option value={"8"}>已发布</Option>
                            <Option value={"9"}>已关闭</Option>
                            <Option value={"11"}>已结束</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="关联内容">
                        <Select defaultValue="全部" style={{width: 120}} onChange={this.handleSelectIsRefContent}>
                            <Option value={""}>全部</Option>
                            <Option value={"true"}>有关联</Option>
                            <Option value={"false"}>没有关联</Option>
                        </Select>
                    </FormItem>
                </Form>
                {/*点击排序*/}
                <div className="sort">
                    <span style={{position: 'relative', bottom: '2px'}}>排序:</span>
                    <span className="sort-item" onClick={this.handleDefault}>默认</span>
                    <span className="sort-item" onClick={this.handleReadCount}>预览人数{iconOne}</span>
                    <span className="sort-item" onClick={this.handleCommentCount}>评论数{iconFour}</span>
                    <span className="sort-item" onClick={this.handleFavoriteCount}>收藏数{iconTwo}</span>
                    <span className="sort-item" onClick={this.handleShareCount}>分享数{iconThree}</span>
                    <span className="sort-item" onClick={this.handleSort}>喜欢数{icon}</span>
                    <Button onClick={this.handleConfrimAdd} className="sort-btn" size="large">{PublicFuc.changeText(ContentType)}</Button>
                </div>
                {/*列表*/}
                <div className="list">
                    <Table
                        columns={this.columns}
                        dataSource={dataSource} showHeader={false}
                        bordered={true}
                        rowKey="ID"
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange}
                        loading={loading}
                        rowClassName={() => 'no-bordered'}
                    />
                </div>
                <div style={{marginTop:'-58px'}} className="table-total">
                <div className="select-bottom">
                    <span>每页显示:&nbsp;</span>
                    <Select defaultValue="5条" style={{width: 120}} onChange={this.handleSelectBottom}>
                        <Option value={"5"}>5条</Option>
                        <Option value={"10"}>10条</Option>
                        <Option value={"15"}>15条</Option>
                    </Select>
                </div>
                <div className="total-info">
                    <span className="total-span">总共有{pagination.total}条记录</span>
                </div>
                </div>
            </div>
        )
    }
}

export default withRouter(InfoTab);