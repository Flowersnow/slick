import { MESSAGE_SENT } from './actionTypes.js';

export const messageSent = (message, userId, channelId) => ( {
    type: MESSAGE_SENT,
    payload: { message, userId, channelId, timestamp: new Date().toLocaleString() }
} );
