import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import configureStore from './redux/configureStore';
import './index.scss';
import App from './views/homepage/App';
import registerServiceWorker from './registerServiceWorker';
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const store = configureStore();

ReactDOM.render(
<Provider store={store}>
    <Router basename="/InfantLeader/"><App/></Router>
    </Provider>, document.getElementById('root'));
registerServiceWorker();
