import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import configureStore from './redux/configureStore';
import './index.scss';
import App from './views/homepage/App';
import registerServiceWorker from './registerServiceWorker';
const store = configureStore();


ReactDOM.render(<Provider store={store}><Router basename="/InfantBackGro"><App /></Router></Provider>, document.getElementById('root'));
registerServiceWorker();
