import { CREATE_CHANNEL, DELETE_CHANNEL, CHANGE_CHANNEL } from './actionTypes';

export const channelCreated = (channelInfo) => ( { type: CREATE_CHANNEL, payload: channelInfo } );
export const channelDeleted = (channelId) => ( { type: DELETE_CHANNEL, payload: channelId } );
export const channelChanged = (newChannelId) => ( {
    type: CHANGE_CHANNEL,
    payload: { newChannelId }
} );
