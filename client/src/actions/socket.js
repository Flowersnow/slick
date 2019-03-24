import { SOCKET_CONNECTED, SOCKET_ERROR, SOCKET_DISCONNECTED } from './actionTypes.js';
import { defaultPrefix } from "../middleware/socket";

export const socketConnected = (event) => ( { type: SOCKET_CONNECTED, payload: event } );
export const socketDisconnected = (event) => ( { type: SOCKET_DISCONNECTED, payload: event } );
export const socketError = (error) => ( { type: SOCKET_ERROR, payload: error } );
export const socketAction = (f) => (...args) => {
    const { type, payload } = f( ...args );
    return { type: defaultPrefix + type, payload }
};
