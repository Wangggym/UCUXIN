import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Card, Button, Popconfirm, Icon, List, Select, Form, message, Input, Pagination, Checkbox} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

import styles from './SupplyModules.less';

const Option = Select.Option;
const FormItem = Form.Item;
const Search = Input.Search;


@connect(({courseList, loading}) => ({
    courseState: courseList,
    loading: loading.models.courseList,
}))
@Form.create()
export default class CourseList extends PureComponent {
    state = {
        list: []
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'courseList/fetchSupply'
        })
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
                type: 'courseList/fetchList',
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
            type: 'courseList/fetchList',
            payload: {
                pageIndex: currentPage,
                pageSize: 15,
                supplierid: values.supplierID,
                publishID: values.publishID,
                subjectID: values.subjectID,
                phaseID: values.phaseID,
                packageName: values.packageName,
                shelveStatus: values.shelveStatus,
                gradeID: values.gradeID,
            }
        });
    }
    phaseIDChange = (v) => {
        const {form} = this.props;

        this.props.dispatch({
            type: 'courseList/fetchGrade',
            payload: v
        });

        form.setFieldsValue({gradeID: undefined, subjectID: undefined, publishID: undefined});
    }

    gradeIDChange = (v) => {
        const {form} = this.props;
        const values = form.getFieldsValue();
        this.props.dispatch({
            type: 'courseList/fetchSubject',
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
            type: 'courseList/fetchPublish',
            payload: {
                subjectID: v,
                gradeID: values.gradeID,
                phaseID: values.phaseID
            }
        });
        form.setFieldsValue({publishID: undefined});
    }
    //下架
    getOffShelves = () => {
        if (this.state.list.length == 0) {
            message.info('必须选中一个')
            return;
        }
        console.log(this.state.list)
        this.props.dispatch({
            type: 'courseList/updateCoursePackage',
            payload: {
                CoursePackageIDList: this.state.list,
                IsShelves: false
            }
        })
    }
    //上架
    putOnShelves = () => {
        if (this.state.list.length == 0) {
            message.info('必须选中一个')
            return;
        }
        this.props.dispatch({
            type: 'courseList/updateCoursePackage',
            payload: {
                CoursePackageIDList: this.state.list,
                IsShelves: true
            }
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
        console.log(this.state.list)
        const values = form.getFieldsValue();
        const {gradeList, subjectList, publishList, supplierList} = courseState;
        const {getFieldDecorator} = this.props.form;
        return (
            <PageHeaderLayout>
                <Card>
                    <Form className={styles.courseList_form} layout="inline" onSubmit={this.handleSubmit}>
                        <FormItem className={styles.formItem_option} label="状态">
                            {getFieldDecorator('shelveStatus')(
                                <Select className={styles.select} placeholder='请选择'>
                                    <Option value='1'>上架</Option>
                                    <Option value='2'>下架</Option>
                                </Select>
                            )}
                        </FormItem>
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
                                <Select className={styles.select} placeholder='教材' disabled={!values.subjectID}  style={{width: 250}}>
                                    {
                                        publishList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={styles.formItem_option}>
                            {getFieldDecorator('supplierID')(
                                <Select className={styles.select} placeholder='供应商'>
                                    {
                                        supplierList.map(e => <Option key={e.ID} value={e.ID}>{e.Name}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem className={styles.formItem_option}>
                            {getFieldDecorator('packageName')(
                                <Search className={styles.input} placeholder="请输入关键字"/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button className={styles.m10}
                                    type="primary"
                                    htmlType="submit">
                                查询
                            </Button>
                            <Popconfirm placement="topLeft" title="是否将选中的批量上架？" onConfirm={this.putOnShelves}
                                        okText="确定" cancelText="取消">
                                <Button className={styles.m10}>上架</Button>
                            </Popconfirm>
                            <Popconfirm placement="topLeft" title="是否将选中的批量下架？" onConfirm={this.getOffShelves}
                                        okText="确定" cancelText="取消">
                                <Button className={styles.m10}>下架</Button>
                            </Popconfirm>
                        </FormItem>
                    </Form>
                    <div className={styles.cardList} style={{paddingBottom: '30px'}}>
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
                                              actions={[<Link to={`/management/course-detail/${item.ID}`}>查看详情</Link>,
                                                  <Checkbox
                                                      onChange={e => this.onCheckBoxChange(e, item.ID, index)}>选中</Checkbox>]}>
                                            <Card.Meta className={styles.courseContent}
                                                       avatar={<img alt="" className={styles.courseImg}
                                                                    src={item.Img || 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'}/>}
                                                       title={<h3>{item.Name}</h3>}
                                                       description={(
                                                           <div className={styles.flexDiv}>
                                                                <span>
                                                                <p>状态：{item.IsShelves ? '已上架' : '已下架'}</p>
                                                                <p>模块：{item.ModulName}</p>
                                                                </span>
                                                                <span>
                                                                <p>出版社：{item.PublisherName}</p>
                                                                <p>册别：{item.FasciculeName}</p>
                                                                </span>
                                                                <p>数量：{item.QtyTotalRes}</p>
                                                           </div>
                                                       )}
                                            />
                                        </Card> 
                                    </List.Item>
                                ) : <div></div>
                            )}
                        />
                    </div>

                </Card>
            </PageHeaderLayout>
        );
    }
}

 
 