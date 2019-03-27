import { CHANGE_THREAD, THREAD_MESSAGE_SENT, CLEAR_THREADS } from './actionTypes';

export const changedThread = (messageId, channelId) => ({
    type: CHANGE_THREAD,
    payload: {messageId, channelId}
});

export const clearThread = () => ({
    type: CLEAR_THREADS,
    payload: []
});

export const threadMessageSent = (message, channelId, isreplytotextid, userId) => ( {
   type: THREAD_MESSAGE_SENT,
   payload: {message, channelId, isreplytotextid, userId, timestamp: new Date().toLocaleString()}
});
