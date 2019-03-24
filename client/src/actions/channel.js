import { CREATE_CHANNEL, DELETE_CHANNEL, CHANGE_CHANNEL } from './actionTypes';

export const channelCreated = (channelName) => ( { type: CREATE_CHANNEL, payload: channelName } );
export const channelDeleted = (channelName) => ( { type: DELETE_CHANNEL, payload: channelName } );
export const channelChanged = (newChannelId) => ( {
    type: CHANGE_CHANNEL,
    payload: { newChannelId }
} );
