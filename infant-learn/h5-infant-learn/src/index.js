import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import configureStore from './redux/configureStore';
import './index.scss';
import App from './views/layout/App';
import registerServiceWorker from './registerServiceWorker';
const store = configureStore();

// H5 infant learn space
ReactDOM.render(<Provider store={store}><Router basename="/InLeSpa"><App /></Router></Provider>, document.getElementById('root'))
registerServiceWorker();
