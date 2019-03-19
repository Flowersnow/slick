import { CREATE_CHANNEL, DELETE_CHANNEL, CHANGE_CHANNEL } from '../actions/actionTypes';
import filter from 'lodash/filter';
import map from 'lodash/map';

export const channelReducer = (state = [], { type, payload }) => {
    switch (type) {
        case CREATE_CHANNEL:
            return [ ...state, payload ];
        case DELETE_CHANNEL:
            return filter( state, channel => channel !== payload );
        case CHANGE_CHANNEL:
            const { oldChannel, newChannel } = payload;
            return map( state, channel => channel === oldChannel ? newChannel : channel );
        default:
            return state;
    }
};

export const currentChannelReducer = (state = null, { type, payload }) => {
    switch (type) {
        case CHANGE_CHANNEL: {
            return payload.newChannel;
        }
        default:
            return state;
    }

};
