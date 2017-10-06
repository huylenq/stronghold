import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import 'url-search-params-polyfill';

import 'normalize.css';
import '@blueprintjs/core/dist/blueprint.css';
import '@blueprintjs/table/dist/table.css';
import './base.css';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory';
import { Route, Switch } from 'react-router';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';

import App from './App';

const history = createHistory();

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;

const store = createStore(
  combineReducers({
    routing: routerReducer,
  }),
  composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
    )));

// TODO: setup reducer hot reloading
/* if (process.env.NODE_ENV !== "production") {*/
/* if (module['hot']) {*/
/* module['hot'].accept('./reducers', () => {*/
/* store.replaceReducer(rootReducer)*/
/* })*/
/* }*/
/* }*/

render();
function render() {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App/>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
}

if (module['hot']) {
  console.log('HMR is enabled!');  // tslint:disable-line
  module['hot'].accept(
    './App',
    () => {
      render();
      console.log('Hot Reloaded!');  // tslint:disable-line
    });
}

/* registerServiceWorker();*/
