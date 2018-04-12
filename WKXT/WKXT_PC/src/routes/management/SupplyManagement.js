import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Button, Icon, List } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Ellipsis from '../../components/Ellipsis';

import styles from './SupplyModules.less';

@connect(({ supplyList, loading }) => ({
  list:supplyList,
  loading: loading.models.list,
}))
export default class SupplyManagement extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'supplyList/fetch',
    });
  }

  render() {
    const { list: { list }, loading } = this.props;
    return (
    	<PageHeaderLayout>
	      <Card>
	        <div className={styles.cardList}>
	          <List
	            rowKey="id"
	            loading={loading}
	            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
	            dataSource={['', ...list]}
	            renderItem={item => (item ? (
	              <List.Item key={item.ID}>
	                <Card hoverable className={styles.card} actions={[<Link to={`/management/supply-detail/${item.ID}`}>查看详情</Link>]}>
	                  <Card.Meta
	                    avatar={<img alt="" className={styles.cardAvatar} src={item.Logo} />}
	                    title={<a href="#">{item.Name}</a>}
	                    description={(
	                      <Ellipsis className={styles.item} lines={3}>{item.Desc}</Ellipsis>
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

 
 