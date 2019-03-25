import { channelChanged, socketAction, socketConnected, socketDisconnected, socketError } from '../actions';
import * as socketIo from 'socket.io-client';
import { SOCKET_MESSAGE } from "../actions/actionTypes";
import isFunction from 'lodash/isFunction';

export const defaultPrefix = "socket/";

const webSocketMiddleware = (port) => {
    const socket = socketIo( `http://${window.location.hostname}:${port}` );
    return (store) => {

        handleSocketEvents( socket, store );

        return handleSocketActions( socket );
    }
};

export default webSocketMiddleware;

const handleSocketEvents = (socket, { dispatch, getState }) => {

    socket.on( 'connect', (event) => {
        dispatch( socketConnected( event ) );
        dispatch( socketAction( channelChanged )( getState().currentChannelId ) );
    } );

    socket.on( 'disconnect', (event) => dispatch( socketDisconnected( event ) ) );
    socket.on( 'error', (error) => dispatch( socketError( error ) ) );

    socket.on( SOCKET_MESSAGE, data => {
        if (data.type && data.payload) {
            dispatch( data );
        } else {
            console.info( 'Received a payload from a socket that does not look like an action', data );
        }
    } );
};

const handleSocketActions = socket => next => action => {
    if (!isFunction( action )) {
        let { type, payload } = action;
        // Check if type calls for the payload to be routed via socket
        if (type.indexOf( defaultPrefix ) === 0) {
            type = type.slice( defaultPrefix.length ); // strip prefix
            socket.emit( type, payload );
        }
        return next( { type, payload } );
    } else {
        return next( action );
    }
};
