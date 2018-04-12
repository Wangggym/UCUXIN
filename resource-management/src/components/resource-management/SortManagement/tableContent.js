/**
 * Created by xj on 2017/7/14.
 */
import React, {Component} from 'react';
import {Button, message, Checkbox, Table, Popconfirm, Radio} from 'antd';
import EditableCell from './editableCell';

import ServiceAsync from '../../../common/service';
import {Token} from '../../../common/utils';
//redux
import {connect} from 'react-redux';

// -- Token Configuration
const token = Token();
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;


class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      isDisable: true,
      isOpen: true,//是否开启
      dataSource: [],
      itemList: [],//领域列表
      allData: [],
      plainOptions: [],//所有维度字段
      checkedList: [],//选中的维度字段
      count: 2,
      addOne: false,//限制只能一次新 增一行，保存后才可再新增
      isSave: false,//是否保存成功（是否可编辑，是否显示编辑按钮）
      editable: true,
      loading: this.props.loading,
      FirstPage:1,
      expandedRowKeys:[]//默认展开的行
    };
    this.columns = [{
      title: '分类名称',
      dataIndex: 'name',
      width: '30%',
      render: (text, record, index) => (
        <EditableCell
          value={text}
          onChange={this.onCellChange(index, 'name', record)}
          editable={record.editable}
        />
      ),
    }, {
      title: '状态',
      dataIndex: 'state',
    }, {
      title: '维度',
      dataIndex: 'dimension',
      render: (text, record) => {
        return (<Dimension
          PropertyList={record.PropertyList}
          onChange={(value) => this.onDimensionChange(record, value)}
          editable={record.editable}
        />)
      },
    },
      {
        title: '领域',
        dataIndex: 'field',
        render: (text, record, index) => {
          return (<Field
            Domian={record.Domian}
            onChange={(value) => this.onFieldChange(record, value)}
            editable={record.editable}
            itemList={this.state.itemList}
          />)
        }
      }
      , {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record, index) => {
          return (
            <BtnGroup {...this.props} addItem={() => this.addItem(record)}
                      forbidden={(btnState) => this.forbidden(record, btnState)}
                      save={() => this.save(record)} editable={record.editable} editAll={() => this.editAll(record)}
                      cancel={() => this.cancel(record)}
                      btnState={record.btnState}
            />
          );
        },
      }];
  }

  componentDidMount() {
    //获取领域列表
    ServiceAsync('GET', 'Resource/v3/Category/GetDomianList', {token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          itemList: res.Data
        })
      }
    })

    //获取全新维度列表(新增)
    ServiceAsync('GET', 'Resource/v3/Category/GetPropertyList', {token}).then(res => {
      if (res.Ret === 0) {
        this.setState({
          allData: res.Data
        })
        let allCheck = [];
        let selectCheck = [];
        this.state.allData.map(item => {
          //保存所有的维度
          allCheck.push(item.Text)
          //存储选中状态的维度
          if (item.isChecked) {
            selectCheck.push(item.Text)
          }
        })
        this.setState({
          plainOptions: allCheck,
          checkedList: selectCheck
        });
      }
    })
  }

//请求数据之后重新构造数据
  generateData(data) {
    let dataSource = [];
    for (let child of data) {
      var obj = {
        key: child.ID,
        name: child.Name,
        state: child.ST ? "已开启" : "未开启",
        btnState: child.ST,//显示当前行按钮的状态   启用/禁用
        children: (child.ChildList && child.ChildList.length) ? this.generateData(child.ChildList) : "",
        index: child.Level,
        parentID: child.ParentID,
        editable: false,//自定义的字段用来控制当前行是否可编辑
        PropertyList: child.PropertyList,
        Domian: child.Domian
      };
      dataSource.push(obj)
    }
    return dataSource;
  }

  componentWillReceiveProps(nextProps) {
    const dataSource = this.generateData(nextProps.dataList);
    const loading = nextProps.loading
    this.setState({
      dataSource,
      loading: loading
    })
  }

//输入框
  onCellChange = (index, key, record) => {
    return (value) => {
      record.name = value;
      this.setState({dataSource: this.state.dataSource});

    };
  };
//维度复选框改变
  onDimensionChange = (record, value) => {
    record.selectedValue = value;
    this.setState({dataSource: this.state.dataSource});
  }
//领域单选框改变
  onFieldChange = (record, value) => {
    record.fieldValue = value;
    this.setState({dataSource: this.state.dataSource});
  }

//禁用
  forbidden(record, btnState) {
    ServiceAsync('GET', 'Resource/v3/Category/DisableOrEnable', {
      token,
      categoryID: record.key,
    }).then(res => {
      if (res.Ret === 0) {
        message.success(`${btnState ? "禁用" : "启用"}成功`)

        //"是否开启"开关
        this.setState({
          isOpen: !this.state.isOpen
        })
        record.state = (record.state==="已开启"?"未开启":"已开启")
        record.btnState = !record.btnState;//编辑和新增子分类是否可点击
        this.setState({
          dataSource: this.state.dataSource
        });

      } else {
        message.warn(res.Msg)
      }
    })

  }

//保存
  save(record) {
    let property = record.selectedValue;
    let str = 0;
    //将选择的维度数组用“或”运算的方式传给后台
    if (property) {
      for (let value of property) {
        str += +value
      }
    } else {
      str = "";
    }
    if (!record.fieldValue&&!record.Domian) {
      message.warning('请选择领域！');
      return;
    }
    //设置加载状态
    this.setState({
      loading:true
    })
    ServiceAsync('POST', 'Resource/v3/Category/AddOrEditCategory', {token,
      body: {
        ID: record.key ? record.key : 0,
        Name: record.name,
        ParentID: record.parentID ? record.parentID : 0,
        Property: str,
        Domian: record.fieldValue?record.fieldValue:record.Domian
      }
    }).then(res => {
      if (res.Ret === 0) {
        this.setState({
          loading:false
        })
        message.success('保存成功');
        //将子组件编辑框变为不可编辑和改变按钮自身状态
        //record.editable = false;
        // record.btnState = true;//编辑和新增子分类按钮是否可用
        // record.key =res.Data;
        //保存成功后重新获取表格内容
        ServiceAsync('GET', 'Resource/v3/Category/GetCategoryList', {
          token,
          doMain: record.fieldValue?record.fieldValue:record.Domian,
          st: ""
        }).then(res => {
          if (res.Ret === 0) {
            //更改领域列表的值
            this.props.changeField(record.fieldValue?record.fieldValue:record.Domian)
            let dataList = res.Data;
            const dataSource = this.generateData(dataList)
            this.setState({
              dataSource
            })
          }
        })
        this.setState({
          dataSource: this.state.dataSource,
          addOne: false
        })
      } else {
        message.warn(res.Msg)
        this.setState({
          loading:false
        })
      }
    })
  }

//编辑
  editAll(record) {
    record.editable = true;
    this.setState({
      dataSource: this.state.dataSource
    });
  }

  //取消
  cancel(record) {
    record.editable = false;
    const{dataSource} = this.state
    this.delCurrentRow(dataSource)
    this.setState({
      dataSource: this.state.dataSource,
      addOne:false
    });
  }
  //取消后如果没有子类，不显示减号
  componentWillUpdate(){
    for(let item of this.state.dataSource){
      if(item.children.length===0){
        item.children = ""
      }
    }
  }

  delCurrentRow(dataSource){
    if(!dataSource||dataSource.length<1){
      return;
    }

    for (let row of dataSource){
      if(row.key===0  ){
        dataSource.splice(row,1);
      }else{
        this.delCurrentRow(row.children);
      }
    }
  }
  //新增子分类
  addItem(record) {

    const { expandedRowKeys } = this.state
    const NewExpandedRowKeys = [...expandedRowKeys, record.key]
    if (this.state.addOne) {
      message.warn("请先保存当前子分类！");
      return;
    }
    let [index, key] = [record.index + 1, (record.key.toString()) + (1 + record.children.length)];
    let child = {
      key: 0,//key为本地自定义用来保证新增子分类的唯一性
      name: '',
      state: '已开启',
      children: "",
      index: index,
      parentID: record.key,
      editable: true, //自定义字段，用于控制当前项是否可编辑
      PropertyList: this.state.allData
    };
    if(record.children===""){
      record.children=[]
    }
    record.children.unshift(child);
    this.setState({
      dataSource: this.state.dataSource,
      addOne: true,
      expandedRowKeys:NewExpandedRowKeys
    });


  }
//点击展开关闭符号出发
  onExpand(expanded,record){
    // console.log(expanded);
    // console.log(record)
  }
  //点击展开
  handleExpandedRowsChange = (expandedRowKeys) => {
    this.setState({ expandedRowKeys })
  }
  onChange = (pagination,filters,sorter)=>{
    console.log(pagination)
    this.setState({
      FirstPage:pagination.current
    })
  }
//新增一级分类
  handleAdd = () => {
    //console.log(this.state.allData)
    const {count, dataSource} = this.state;
    if(this.state.FirstPage!==1){
      message.warn("请跳转至首页,再新增一级分类！");
      return;
    }
    if (this.state.addOne) {
      message.warn("请先保存当前新增！")
      return;
    }
    const newData = {
      key: 0,
      name: ``,
      state: "已开启",
      children: '',
      index: 1, //层级,
      editable: true,  //自定义字段，用于控制当前项是否可编辑
      PropertyList: this.state.allData
    };
    this.setState({
      dataSource: [newData, ...dataSource],
      count: count + 1,
      addOne: true,
    });
  };

  render() {
    const {dataSource} = this.state;
    const columns = this.columns;
    return (
      <div style={{marginTop:"0.5rem"}}>
        <Button className="editable-add-btn ant-btn ant-btn-primary ant-btn-lg" type="primary" onClick={this.handleAdd}>新增一级分类</Button>
        <Table bordered dataSource={dataSource} columns={columns} defaultExpandAllRows={false} loading={this.state.loading}
               onChange={(pagination,filters,sorter)=>{this.onChange(pagination,filters,sorter)}}
               onExpand={(expanded,record)=>{this.onExpand(expanded,record)}}
               expandedRowKeys={this.state.expandedRowKeys}
               onExpandedRowsChange={this.handleExpandedRowsChange}/>
      </div>
    );
  }
}



//对应维度下的复选框
class Dimension extends Component {
  state = {
    allData: this.props.PropertyList,
    plainOptions: [],
    checkedList: [],
    selectValue: [],
    editable: this.props.editable,
  };

  componentDidMount() {
    let allCheck = [];
    let selectCheck = [];
    this.setState({
      allData: this.props.PropertyList
    })
    for (let i of  this.props.PropertyList) {
      //保存所有的维度
      allCheck.push(i.Text)
      //存储选中状态的维度
      if (i.isChecked) {
        selectCheck.push(i.Text)
      }
    }
    this.setState({
      plainOptions: allCheck,
      checkedList: selectCheck
    }, () => {
      for (let j of this.state.checkedList) {
        for (let i of this.state.allData) {
          if (j === i.Text) {
            this.setState({
              selectValue: []
            })
            this.state.selectValue.push(i.Value)
          }
        }
      }
      this.props.onChange(this.state.selectValue)
    })

  }

  //更改当前想的维度是否可用
  componentWillReceiveProps(nextProps) {
    this.setState({
      editable: nextProps.editable,
    })
  }

  render() {
    return (
      <CheckboxGroup options={this.state.plainOptions} value={this.state.checkedList} onChange={this.onChange}
                     disabled={!this.state.editable ? true : false}/>
    );
  }

  onChange = (checkedList) => {
    for (let j of checkedList) {
      for (let i of this.state.allData) {
        if (j === i.Text) {
          this.setState({
            selectValue: []
          })
          this.state.selectValue.push(i.Value)
        }
      }
    }
    this.setState({
      checkedList
    });
    this.props.onChange(this.state.selectValue)
  }
}

//领域
class Field extends Component {
  state = {
    itemList: this.props.itemList,
    selectValue: this.props.Domian,
    editable: this.props.editable,
  }

  //更改当前的领域是否可用
  componentWillReceiveProps(nextProps) {
    this.setState({
      editable: nextProps.editable
    })
  }

  onChange = (e) => {
    this.setState({
      selectValue: e.target.value,
    });
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <RadioGroup onChange={this.onChange} value={this.state.selectValue}
                  disabled={!this.state.editable ? true : false}>
        {
          this.state.itemList.map((item, index) => {
            return (
              <Radio value={parseInt(item.Value)} key={index} defaultChecked>{item.Text}</Radio>
            )
          })
        }
      </RadioGroup>
    );
  }
}

//按钮集合
class BtnGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ToggleBtn: this.props.editable,
      disable: true,
      btnState: this.props.btnState
    }
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      ToggleBtn: nextprops.editable,
      btnState: nextprops.btnState
    })
  }

//禁用
  disable(btnState) {
    //调用父组件的函数
    this.props.forbidden(btnState)
  }

  //编辑
  editAll() {
    this.props.editAll()
  }

  //保存
  save() {
    this.props.save();
  }

  //取消
  cancel() {
    this.props.cancel()
  }

  render() {
    return (
      <div className="btn-group">
        <div className={!this.state.ToggleBtn ? "current-block" : "current-none"}>
          <Popconfirm title={`确定${this.state.btnState ? '禁用' : '启用'}吗？`}
                      onConfirm={() => this.disable(this.state.btnState)}>
            <Button size="small" type="primary" style={{marginRight:8}}>{this.state.btnState ? '禁用' : '启用'}</Button>
          </Popconfirm>
          <Button size="small" type="primary" disabled={!this.state.btnState ? true : false}
                  onClick={() => this.editAll()} style={{marginRight:8}}>编辑</Button>
          <Button size="small" type="primary" disabled={!this.state.btnState ? true : false}
                  onClick={() => this.props.addItem()}>新增子分类</Button>
        </div>
        <div className={this.state.ToggleBtn ? "current-block" : "current-none"}>
          <Button size="small" type="primary" onClick={() => this.save()}>保存</Button>
          <Button size="small" type="primary" onClick={() => this.cancel()}>取消</Button>
        </div>
      </div>
    )
  }
}

//共同作用域
const mapStateToProps = (state) => {
  // console.log(state)
  return {
    isEdit: state.editState
  }
}

export default connect(mapStateToProps)(EditableTable);
