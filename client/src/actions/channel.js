import { CREATE_CHANNEL, DELETE_CHANNEL, CHANGE_CHANNEL, UPDATE_CHANNEL_DESCRIPTION_SENT } from './actionTypes';

export const channelCreated = (channelInfo) => ( { type: CREATE_CHANNEL, payload: channelInfo } );
export const channelDeleted = (channelId) => ( { type: DELETE_CHANNEL, payload: channelId } );
export const channelChanged = (newChannelId) => ( {
    type: CHANGE_CHANNEL,
    payload: { newChannelId }
} );
export const updateChannelDescription = (channelId, channelDescription) => (
    {
        type: UPDATE_CHANNEL_DESCRIPTION_SENT,
        payload: { channelId, channelDescription }
    }
);
