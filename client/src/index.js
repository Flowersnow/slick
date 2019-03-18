import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'
import App from './components/App';

import * as reducers from './reducers';
import socketIoMiddleware from './middleware/socket';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

const socketPort = 3001;

const middlewares = [ socketIoMiddleware( socketPort ) ];

const username = 'Username';
const channels = [ { id: 1, name: 'general' }, { id: 2, name: 'random' } ];
const users = [ { id: 1, name: 'slackbot', isOnline: true }, { id: 2, name: 'user1', isOnline: false } ];
const channelName = 'general';

const initialState = {
    users,
    messages: '',
    socket: { connected: false },
    channels
};

const store = createStore(
    combineReducers( {
        ...reducers,
    } ),
    initialState,
    compose( applyMiddleware( ...middlewares ) )
);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById( 'root' ) );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
