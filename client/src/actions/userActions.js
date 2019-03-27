import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    GETALL_REQUEST,
    GETALL_SUCCESS,
    GETALL_FAILURE,
    DELETE_REQUEST,
    DELETE_SUCCESS,
    DELETE_FAILURE,
    INITIALIZE,
    CHANGE_VIEWING_USER
} from './actionTypes';
import { userService } from '../_services';
import { alert } from './alert';
import { history } from '../_helpers';
import { socketAction } from "./socket";

export const user = {
    login,
    logout,
    register,
    getAll,
    delete: _delete,
    initialize,
    success,
    changeViewingUser,
};

function login(username, password, adminstatus) {

    const successSocket = socketAction( success );
    const initializeSocket = socketAction( initialize );

    return dispatch => {
        dispatch( request( { username } ) );

        userService.login( username, password, adminstatus )
            .then(
                user => {
                    dispatch( successSocket( user ) );
                    dispatch( initializeSocket() );
                    history.push( '/' );
                },
                error => {
                    dispatch( failure( error.toString() ) );
                    dispatch( alert.error( error.toString() ) );
                }
            );
    };

    function request(user) {
        return { type: LOGIN_REQUEST, payload: user }
    }

    function failure(error) {
        return { type: LOGIN_FAILURE, payload: error }
    }
}

function success(user) {
    return { type: LOGIN_SUCCESS, payload: user }
}

function initialize() {
    return { type: INITIALIZE }
}

function logout() {
    history.push('/login');
    userService.logout();
    return { type: LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch( request( user ) );

        userService.register( user )
            .then(
                user => {
                    dispatch( success() );
                    history.push( '/login' );
                    dispatch( alert.success( 'Registration successful' ) );
                },
                error => {
                    dispatch( failure( error.toString() ) );
                    dispatch( alert.error( error.toString() ) );
                }
            );
    };

    function request(user) {
        return { type: REGISTER_REQUEST, payload: user }
    }

    function success(user) {
        return { type: REGISTER_SUCCESS, payload: user }
    }

    function failure(error) {
        return { type: REGISTER_FAILURE, payload: error }
    }
}

function getAll() {
    return dispatch => {
        dispatch( request() );

        userService.getAll()
            .then(
                users => dispatch( success( users ) ),
                error => dispatch( failure( error.toString() ) )
            );
    };

    function request() {
        return { type: GETALL_REQUEST }
    }

    function success(users) {
        return { type: GETALL_SUCCESS, payload: users }
    }

    function failure(error) {
        return { type: GETALL_FAILURE, payload: error }
    }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch( request( id ) );

        userService.delete( id )
            .then(
                user => dispatch( success( id ) ),
                error => dispatch( failure( id, error.toString() ) )
            );
    };

    function request(id) {
        return { type: DELETE_REQUEST, payload: id }
    }

    function success(id) {
        return { type: DELETE_SUCCESS, payload: id }
    }

    function failure(id, error) {
        return { type: DELETE_FAILURE, payload: error }
    }
}

function changeViewingUser(id) {
    history.push('/user');
    return { type: CHANGE_VIEWING_USER, payload: id }
}
