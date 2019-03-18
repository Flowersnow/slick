import { USER_NAME_CHANGED } from './actionTypes.js';

export const usernameChanged = (oldUsername, newUsername) => ( {
    type: USER_NAME_CHANGED,
    payload: {
        oldUsername,
        newUsername
    }
} );
