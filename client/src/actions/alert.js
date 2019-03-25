import { SUCCESS, ERROR, CLEAR } from './actionTypes';

export const alert = {
    success,
    error,
    clear
};

function success(message) {
    return { type: SUCCESS, payload: message };
}

function error(message) {
    return { type: ERROR, payload: message};
}

function clear() {
    return { type: CLEAR, payload: null };
}