import {
    CHANGE_THREAD,
    THREAD_MESSAGE_RECEIVED,
    THREAD_MESSAGES_RECEIVED,
    CLEAR_THREADS
} from '../actions/actionTypes';

export const threadReducer = (state = [], { type, payload }) => {
    switch (type) {
        case THREAD_MESSAGE_RECEIVED: {
            return [ ...state, payload ];
        }
        case THREAD_MESSAGES_RECEIVED: {
            return [ ...payload ];
        }
        case CLEAR_THREADS: {
            return payload;
        }
        default:
            return state;
    }
};

export const currentThreadIdReducer = (state = 'U1', { type, payload }) => {
    switch (type) {
        case CHANGE_THREAD: {
            return payload.messageId;
        }
        default:
            return state;
    }
};
