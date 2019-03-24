import { USER_ENTERS, USER_LEAVES, USER_NAME_CHANGED } from '../actions/actionTypes.js';
import filter from 'lodash/filter';
import map from 'lodash/map';

export const usersReducer = (state = [], { type, payload }) => {
    switch (type) {
        case USER_ENTERS:
            return [ ...state, payload ];
        case USER_LEAVES:
            return filter( state, user => user.id !== payload.id );
        case USER_NAME_CHANGED: {
            const { id, newUsername: username } = payload;
            return map( state, user => user.id === id ? { ...user, username } : user );
        }
        default:
            return state;
    }
};

export const currentUserIdReducer = (state = 1, { type, payload }) => {
    switch (type) {
        case USER_ENTERS: {
            return payload.id;
        }
        default:
            return state;
    }
};
