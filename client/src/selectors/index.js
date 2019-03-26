import find from 'lodash/find';
import filter from 'lodash/filter';

const defaultChannel = { name: "Unknown" };

export const currentChannelSelector = (channels, currentChannelId) => (
    find( channels, ({ id }) => id === currentChannelId ) || defaultChannel
);

const defaultUser = { name: "Unknown", description: "random description", username: "this is an email", isOnline: true };
export const currentUserSelector = (users, currentUserId) => (
    find( users, ({ id }) => id === currentUserId ) || defaultUser
);

export const viewingUserSelector = (users, viewingUserId) => {
    console.log('users = ', users);
    console.log('viewingId = ', viewingUserId);
    return (
    find( users, ({ id }) => id === viewingUserId ) || defaultUser
)};


export const messagesForChannelSelector = (messages, currentChannelId) => (
    filter( messages, ({ channelId }) => channelId === currentChannelId )
);
