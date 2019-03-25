import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/actionTypes';

let user = JSON.parse( localStorage.getItem( 'user' ) );
const initialState = user ? { loggedIn: true, user } : {};

export function authentication(state = initialState, { type, payload }) {
    switch (type) {
        case LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: payload.user
            };
        case LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: payload.user
            };
        case LOGIN_FAILURE:
            return {};
        case LOGOUT:
            return {};
        default:
            return state
    }
}
