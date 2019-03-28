import { NEW_CHANNEL, DELETE_CHANNEL, CHANGE_CHANNEL, INITIALIZE_CHANNELS, EDIT_CHANNEL } from '../actions/actionTypes';
import filter from 'lodash/filter';

export const channelReducer = (state = [], { type, payload }) => {
    switch (type) {
        case INITIALIZE_CHANNELS:
            return [ ...payload ];
        case NEW_CHANNEL:
            return [ ...state, payload ];
        case DELETE_CHANNEL:
            return filter( state, channel => channel !== payload );
        case EDIT_CHANNEL:
            const newState = [];
            for (let i = 0; i < state.length; i++) {
                newState[ i ] = state[ i ].id === payload.id
                    ? payload
                    : state[ i ];
            }
            return newState;
        default:
            return state;
    }
};

export const currentChannelIdReducer = (state = 'C1', { type, payload }) => {
    switch (type) {
        case CHANGE_CHANNEL: {
            return payload.newChannelId;
        }
        default:
            return state;
    }

};
