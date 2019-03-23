import { CREATE_CHANNEL, DELETE_CHANNEL, CHANGE_CHANNEL } from '../actions/actionTypes';
import filter from 'lodash/filter';

export const channelReducer = (state = [], { type, payload }) => {
    switch (type) {
        case CREATE_CHANNEL:
            return [ ...state, payload ];
        case DELETE_CHANNEL:
            return filter( state, channel => channel !== payload );
        default:
            return state;
    }
};

export const currentChannelReducer = (state = 1, { type, payload }) => {
    switch (type) {
        case CHANGE_CHANNEL: {
            return payload.newChannelId;
        }
        default:
            return state;
    }

};
