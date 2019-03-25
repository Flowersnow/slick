import { USER_ENTERS, USER_LEAVES } from './actionTypes.js';

// todo migrate ./user.js to this file

export const userEnters = (user) => ( {
    type: USER_ENTERS,
    payload: { ...user }
} );

export const userLeaves = (user) => ( {
    type: USER_LEAVES,
    payload: { ...user }
} );
