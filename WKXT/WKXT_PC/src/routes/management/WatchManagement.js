import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Link, routerRedux} from 'dva/router';
import {Card, Button, Popconfirm, Icon, List, Select, Form, message, Input, Pagination, Checkbox,Spin} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

import styles from './SupplyModules.less';

const Option = Select.Option;
const FormItem = Form.Item;
const Search = Input.Search;


@connect(({watchList, loading}) => ({
    courseState: watchList,
    loading: loading.effects['watchList/fetchList'],
}))
@Form.create()
export default class CourseList extends PureComponent {
    state = {
        list: []
    }

    componentDidMount() {

    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const newValues = {}
            for (let key in values) {
                if (values[key]) {
                    newValues[key] = values[key]
                }
            }
            this.props.dispatch({
                type: 'watchList/fetchList',
                payload: {
                    pageIndex: 1,
                    pageSize: 15,
                    ...newValues
                }
            });
        });
    }
    onPageChange = (currentPage) => {
        const {form} = this.props;
        const values = form.getFieldsValue();
        this.setState({
            list: []
        })
        this.props.dispatch({
            type: 'watchList/fetchList',
            payload: {
                pageIndex: currentPage,
                pageSize: 15,
                publishID: values.publishID,
                subjectID: values.subjectID,
                phaseID: values.phaseID,
                gradeID: values.gradeID,
            }
        });
    }
    phaseIDChange = (v) => {
        const {form} = this.props;

        this.props.dispatch({
            type: 'watchList/fetchGrade',
            payload: v
        });

        form.setFieldsValue({gradeID: undefined, subjectID: undefined, publishID: undefined});
    }

    gradeIDChange = (v) => {
        const {form} = this.props;
        const values = form.getFieldsValue();
        this.props.dispatch({
            type: 'watchList/fetchSubject',
            payload: {
                gradeID: v,
                phaseID: values.phaseID
            }
        });
        form.setFieldsValue({subjectID: undefined, publishID: undefined});
    }
    subjectIDChange = (v) => {
        const {form} = this.props;
        const values = form.getFieldsValue();

        this.props.dispatch({
            type: 'watchList/fetchPublish',
            payload: {
                subjectID: v,
                gradeID: values.gradeID,
                phaseID: values.phaseID
            }
        });
        form.setFieldsValue({publishID: undefined});
    }
    //取消试看
    getOffShelves = (list = this.state.list) => {
        if (list.length == 0) {
            message.info('必须选中一个')
            return;
        }
        this.props.dispatch({
            type: 'watchList/cancelResTrySee',
            payload: {
                TrySeeIDList: list
            }
        });
        //取消选中状态;
        this.setState({
            list: []
        })
    }

    onCheckBoxChange = (e, id, index) => {
        let {list} = this.state;
        let arr = [...list]
        if (e.target.checked) {
            arr.push(id);
            this.setState({
                list: arr
            })
        } else {
            arr = list.filter(e => e !== id);
            this.setState({
                list: arr
            })
        }
    }

    render() {
        const {courseState: {...courseState}, loading, form} = this.props;
        const values = form.getFieldsValue();
        const {gradeList, subjectList, publishList} = courseState;
        const {getFieldDecorator} = this.props.form;
        return (
            <PageHeaderLayout>
                <Card>
                    <Form className={styles.courseList_form} layout="inline" onSubmit={this.handleSubmit}>

                        <FormItem className={styles.formItem_option}>
                            {getFieldDecorator('phaseID')(
                                <Select className={styles.select} placeholder='学段' onChange={this.phaseIDChange}>
                                    <Option value='30020'>小学</Option>
                                    <Option value='30030'>初中</Option>
                                    <Option value='30040'>高中</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={styles.formItem_option}>
                            {getFieldDecorator('gradeID')(
                                <Select className={styles.select} placeholder='年级' disabled={!values.phaseID}
                                        onChange={this.gradeIDChange}>
                                    {
                                        gradeList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={styles.formItem_option}>
                            {getFieldDecorator('subjectID')(
                                <Select className={styles.select} placeholder='科目' disabled={!values.gradeID}
                                        onChange={this.subjectIDChange}>
                                    {
                                        subjectList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={styles.formItem_option}>
                            {getFieldDecorator('publishID')(
                                <Select className={styles.select} placeholder='教材' disabled={!values.subjectID}>
                                    {
                                        publishList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button className={styles.m10}
                                    type="primary"
                                    htmlType="submit">
                                查询
                            </Button>
                            <Button className={styles.m10} type='primary'
                                    onClick={() => this.props.dispatch(routerRedux.push('/management/course-management'))}>添加试看课程</Button>
                            <Popconfirm placement="topLeft" title="是否将选中的批量下架？" onConfirm={() => this.getOffShelves()}
                                        okText="确定" cancelText="取消">
                                <Button className={styles.m10}>批量取消</Button>
                            </Popconfirm>
                        </FormItem>
                    </Form>
                    <div className={styles.cardList} style={{paddingBottom: '30px'}}>
                        <Spin spinning={loading}>
                            <List
                                rowKey="id"
                                loading={loading}
                                grid={{gutter: 24, lg: 4, md: 2, sm: 1, xs: 1}}
                                pagination={{
                                    onChange: this.onPageChange,
                                    total: courseState.list.TotalRecords,
                                    pageSize: 15,
                                    showQuickJumper: true,
                                    hideOnSinglePage: true,
                                    current:courseState.list.PageIndex,
                                }}
                                dataSource={courseState.list.ViewModelList ? [...courseState.list.ViewModelList] : []}
                                renderItem={(item, index) => (item ? (
                                        <List.Item key={item.ID}>
                                            <Card hoverable className={styles.card}
                                                  actions={[<span onClick={() => this.getOffShelves([item.ID])}>取消试看</span>,
                                                      <Checkbox
                                                          onChange={e => this.onCheckBoxChange(e, item.ID, index)}>选中</Checkbox>]}>
                                                <Card.Meta className={styles.courseContent}
                                                           avatar={<img alt="" className={styles.courseImg}
                                                                        src={item.Img || 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'}/>}
                                                           title={<h3>{item.Name}</h3>}
                                                           description={(
                                                               <div>
                                                                   <p>年级：{item.GradeName}</p>
                                                                   <p>科目：{item.SubjectName}</p>
                                                                   <p>教材版本：{item.PublishName}</p>
                                                               </div>
                                                           )}
                                                />
                                            </Card>
                                        </List.Item>
                                    ) : <div></div>
                                )}
                            />
                        </Spin>
                    </div>
                </Card>
            </PageHeaderLayout>
        );
    }
}

 
 