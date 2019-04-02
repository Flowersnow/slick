const {
    MESSAGE_SENT,
    MESSAGE_RECEIVED,
    CHANGE_CHANNEL,
    CREATE_CHANNEL,
    NEW_CHANNEL,
    LOGIN_SUCCESS,
    SOCKET_MESSAGE,
    MESSAGES_RECEIVED,
    USER_ENTERS,
    INITIALIZE,
    INITIALIZE_USERS,
    INITIALIZE_CHANNELS,
    THREAD_MESSAGE_SENT,
    THREAD_MESSAGE_RECEIVED,
    THREAD_MESSAGES_RECEIVED,
    CHANGE_THREAD,
    GET_VIEWING_USER_STATS,
    SENT_VIEWING_USER_STATS,
    UPDATE_CHANNEL_DESCRIPTION_SENT,
    EDIT_CHANNEL
} = require( '../client/src/actions/actionTypes' );
const {
    saveMessage,
    sendCurrentChannelMessages,
    getUserInfo,
    getInitialInfo,
    createNewChannel,
    saveThreadMessage,
    getThreadMessages,
    updateChannel,
    getUserStatistics,
} = require( './queries/messages' );

let currentChannelId;

function handleIo(io, db) {
    io.on( 'connect', socket => {
        console.log( 'connection started' );
        socket.on( CHANGE_CHANNEL, onChannelChange( socket, db ) );
        socket.on( MESSAGE_SENT, onMessage( socket, db ) );
        socket.on( LOGIN_SUCCESS, onLoginSuccess( socket, db ) );
        socket.on( INITIALIZE, initialize( socket, db ) );
        socket.on( CREATE_CHANNEL, createChannel( socket, db ) );
        socket.on( THREAD_MESSAGE_SENT, onThreadSent( socket, db ) );
        socket.on( CHANGE_THREAD, onThreadChanged( socket, db ) );
        socket.on( GET_VIEWING_USER_STATS, userStats( socket, db ) );
        socket.on( UPDATE_CHANNEL_DESCRIPTION_SENT, onUpdateChannelDescription( socket, db ) );
        socket.on( 'disconnect', (reason) => {
            console.log( 'disconnecting!', reason );
        } );
    } );
}

const onChannelChange = (socket, db) => async ({ newChannelId }) => {
    if (currentChannelId != null) {
        socket.leave( currentChannelId, err => {
            if (err) {
                console.log( 'Error leaving:' );
                console.log( err );
            }
            currentChannelId = null;
            join();
        } );
    } else {
        join();
    }

    function join() {
        socket.join( newChannelId, () => {
            currentChannelId = newChannelId;
            sendCurrentChannelMessages( db, currentChannelId ).then(
                payload => socket.emit( SOCKET_MESSAGE, { type: MESSAGES_RECEIVED, payload } )
            );
        } );
    }
};

const onMessage = (socket, db) => ({ userId, message, channelId, timestamp }) => {
    const payload = {
        userId,
        timestamp,
        message,
        channelId
    };

    if (channelId !== currentChannelId) {
        payload.message = `Error, current channelId, ${channelId}, did not match currentChannelId, ${currentChannelId}, on server`
    }
    saveMessage( db, payload )
        .then( message => socket.to( currentChannelId ).emit( SOCKET_MESSAGE, {
            type: MESSAGE_RECEIVED,
            payload: message
        } ) );
};

const onLoginSuccess = (socket, db) => ({ username }) => {
    getUserInfo( db, username ).then(
        payload => socket.emit( SOCKET_MESSAGE, { type: USER_ENTERS, payload } )
    );
};

const initialize = (socket, db) => () => {
    getInitialInfo( db ).then(
        ({ users, channels }) => {
            socket.emit( SOCKET_MESSAGE, { type: INITIALIZE_USERS, payload: users } );
            socket.emit( SOCKET_MESSAGE, { type: INITIALIZE_CHANNELS, payload: channels } );
        }
    );
};

const createChannel = (socket, db) => (channelInfo) => {
    createNewChannel( db, channelInfo )
        .then( newChannel => socket.emit( SOCKET_MESSAGE, { type: NEW_CHANNEL, payload: newChannel } ) );
};

const onThreadSent = (socket, db) => (threadInfo) => {

    saveThreadMessage( db, threadInfo ).then(
        thread => socket.emit( SOCKET_MESSAGE, { type: THREAD_MESSAGE_RECEIVED, payload: thread } ) );
};

const onThreadChanged = (socket, db) => ({ messageId, channelId }) => {
    getThreadMessages( db, { messageId, channelId } )
        .then( threads => socket.emit( SOCKET_MESSAGE, { type: THREAD_MESSAGES_RECEIVED, payload: threads } ) )
};

const userStats = (socket, db) => ({ id, nameMode, channelName }) => {
    getUserStatistics( db, id, nameMode, channelName )
        .then( userStats => socket.emit( SOCKET_MESSAGE, { type: SENT_VIEWING_USER_STATS, payload: userStats}))
};

const onUpdateChannelDescription = (socket, db) => ({ channelId, channelDescription }) => {
  updateChannel(db, { channelId, channelDescription })
      .then( channel => socket.emit( SOCKET_MESSAGE, { type: EDIT_CHANNEL, payload: channel } ) );
};

module.exports = handleIo;
