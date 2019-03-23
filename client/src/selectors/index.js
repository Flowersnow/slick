import find from 'lodash/find';
const defaultChannel = { name: "Unknown" };

export const currentChannelSelector = ( state ) => (
    find( state.channels, channel => channel.id === state.currentChannel ) || defaultChannel
)
