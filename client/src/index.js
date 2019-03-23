import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './routes';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'

import * as reducers from './reducers';
import socketIoMiddleware from './middleware/socket';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

const socketPort = 3001;

const middlewares = [ socketIoMiddleware( socketPort ) ];

const channels = [ { id: 1, name: 'general' }, { id: 2, name: 'random' } ];
const users = [ { id: 1, name: 'slackbot', isOnline: true }, { id: 2, name: 'user1', isOnline: false } ];
const currentUser = users[ 1 ];
const currentChannel = 1;
const messages = [
    { userId: 1, message: 'hello!', timestamp: '2019-Mar-03 3:00' },
    { userId: 2, message: 'hi bot', timestamp: '2019-Mar-03 3:02' },
    { userId: 1, message: 'hello again!', timestamp: '2019-Mar-03 3:03' }
];

const initialState = {
    users,
    currentUser,
    messages,
    socket: { connected: false },
    channels,
    currentChannel
};

export const store = createStore(
    combineReducers( {
        ...reducers,
    } ),
    initialState,
    compose( applyMiddleware( ...middlewares ) )
);

ReactDOM.render(
    <Provider store={store}>
        <Routes/>
    </Provider>, document.getElementById( 'root' ) );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
