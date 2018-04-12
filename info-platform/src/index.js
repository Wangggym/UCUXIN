import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './views/home/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Router basename="/ZX"><App /></Router>, document.getElementById('root'));
registerServiceWorker();
