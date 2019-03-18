import { MESSAGE_SENT } from './actionTypes.js';

export const messageSent = (message) => ( {
    type: MESSAGE_SENT,
    payload: { content: message }
} );
