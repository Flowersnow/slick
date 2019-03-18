import { MESSAGE_RECEIVED, USER_ENTERS, USER_LEAVES } from '../actions/actionTypes.js';

export function messagesReducer(state = [], { type, payload }) {
    switch(type) {
        case MESSAGE_RECEIVED: {
            return [...state, payload];
        }
        case USER_ENTERS: {
            const { username } = payload;
            return [...state, { id: state.length, content: `User ${username} has joined`, type: 'notification' }];
        }
        case USER_LEAVES: {
            const { username } = payload;
            return [...state, { id: state.length, content: `User ${username} has left`, type: 'notification' }];
        }
        default:
            return state;
    }
}
