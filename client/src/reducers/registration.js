import { REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE } from '../actions/actionTypes';

export function registration(state = {}, { type }) {
    switch (type) {
        case REGISTER_REQUEST:
            return { registering: true };
        case REGISTER_SUCCESS:
            return {};
        case REGISTER_FAILURE:
            return {};
        default:
            return state
    }
}
