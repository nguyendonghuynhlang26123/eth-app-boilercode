import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/styles/index.css';

import { Provider } from 'react-redux';
import { store } from './store';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
