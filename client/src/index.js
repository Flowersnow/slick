import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Routes } from './routes';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

import * as reducers from './reducers';
import socketIoMiddleware from './middleware/socket';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';

const socketPort = 3001;

const loggerMiddleware = createLogger();
const middlewares = [ socketIoMiddleware( socketPort ), thunkMiddleware, loggerMiddleware ];

const channels = [ { id: 'C5', name: 'general' }, { id: 'C3', name: 'random' } ];
const users = [ { id: 'U01', name: 'slackbot', isOnline: true }, { id: 'U02', name: 'user1', isOnline: false } ];

const initialState = {
    // users,
    socket: { connected: false },
    // channels,
    currentChannelId: 'C5',
    // currentUserId: 'U02'
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
