import { SUCCESS, ERROR, CLEAR } from '../actions/actionTypes';

export function alert(state = {}, action) {
    switch (action.type) {
        case SUCCESS:
            return {
                type: 'alert-success',
                payload: action.payload
            };
        case ERROR:
            return {
                type: 'alert-danger',
                payload: action.payload
            };
        case CLEAR:
            return {};
        default:
            return state
    }
}