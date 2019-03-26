import {
    USER_ENTERS,
    USER_ADDED,
    USER_REMOVED,
    GETALL_REQUEST,
    GETALL_SUCCESS,
    GETALL_FAILURE,
    DELETE_REQUEST,
    DELETE_SUCCESS,
    DELETE_FAILURE,
    INITIALIZE_USERS,
    CHANGE_VIEWING_USER,
} from '../actions/actionTypes.js';
import filter from 'lodash/filter';

export const usersReducer = (state = [], { type, payload }) => {
    switch (type) {
        case INITIALIZE_USERS:
            return [ ...payload ];
        case USER_ADDED:
            return [ ...state, payload ];
        case USER_REMOVED:
            return filter( state, user => user.id !== payload.id );
        // todo verify the following switch cases are implemented correctly, may have errors due to conflicting code
        case GETALL_REQUEST:
            return {
                loading: true
            };
        case GETALL_SUCCESS:
            return {
                items: payload.users
            };
        case GETALL_FAILURE:
            return {
                error: payload.error
            };
        case DELETE_REQUEST:
            // add 'deleting:true' property to user being deleted
            return {
                ...state,
                items: state.items.map( user =>
                    user.id === payload.id
                        ? { ...user, deleting: true }
                        : user
                )
            };
        case DELETE_SUCCESS:
            // remove deleted user from state
            return {
                items: state.items.filter( user => user.id !== payload.id )
            };
        case DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to user
            return {
                ...state,
                items: state.items.map( user => {
                    if (user.id === payload.id) {
                        // make copy of user without 'deleting:true' property
                        const { deleting, ...userCopy } = user;
                        // return copy of user with 'deleteError:[error]' property
                        return { ...userCopy, deleteError: payload.error };
                    }

                    return user;
                } )
            };
        default:
            return state
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

export const viewingUserIdReducer = (state = 'U01', { type, payload }) => {
    switch (type) {
        case CHANGE_VIEWING_USER: {
            return payload.id;
        }
        default:
            return state;
    }
};
