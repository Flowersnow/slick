import { SOCKET_CONNECTED, SOCKET_DISCONNECTED, SOCKET_ERROR } from '../actions/actionTypes.js';

export const socket = (state = { connected: false }, { type, payload }) => {
    switch(type) {
        case SOCKET_CONNECTED:
            return { ...state, connected: true };
        case SOCKET_DISCONNECTED:
            return { ...state, connected: false };
        case SOCKET_ERROR:
            console.error(`Socket Error!: ${ payload }`);
            return { ...state, connected: false};
        default:
            return state;
    }
};
