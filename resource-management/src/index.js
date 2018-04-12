import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import configureStore from './common/configureStore';
import './index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
const store = configureStore();


ReactDOM.render(<Provider store={store}><Router basename="/ResOrg"><App /></Router></Provider>, document.getElementById('root'));
registerServiceWorker();
