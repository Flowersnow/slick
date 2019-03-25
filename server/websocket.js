const {
    MESSAGE_SENT,
    MESSAGE_RECEIVED,
    CHANGE_CHANNEL,
    LOGIN_SUCCESS,
    SOCKET_MESSAGE,
    MESSAGES_RECEIVED,
    USER_ENTERS,
    INITIALIZE,
    INITIALIZE_USERS,
    INITIALIZE_CHANNELS
} = require( '../client/src/actions/actionTypes' );
const { saveMessage, sendCurrentChannelMessages, getUserInfo, getInitialInfo } = require( './queries/messages' );
let currentChannelId;

function handleIo(io, db) {
    io.on( 'connect', socket => {
        console.log( 'connection started' );
        socket.on( CHANGE_CHANNEL, onChannelChange( socket, db ) );
        socket.on( MESSAGE_SENT, onMessage( socket, db ) );
        socket.on( LOGIN_SUCCESS, onLoginSuccess( socket, db ) );
        socket.on( INITIALIZE, initialize(socket, db) );
        socket.on( 'disconnect', (reason) => {
            console.log( 'disconnecting!', reason );
        } );
    } );
}

const onChannelChange = (socket, db) => async ({ newChannelId }) => {
    if (currentChannelId != null) {
        socket.leave( newChannelId, err => {
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
    saveMessage( db, payload );

    socket.to( currentChannelId ).emit( SOCKET_MESSAGE, { type: MESSAGE_RECEIVED, payload } );
};

const onLoginSuccess = (socket, db) => ({ username }) => {
    getUserInfo( db, username ).then(
        payload => socket.emit( SOCKET_MESSAGE, { type: USER_ENTERS, payload } )
    );
};

const initialize = (socket, db) => () => {
    getInitialInfo( db ).then(
        ({users, channels}) => {
            socket.emit( SOCKET_MESSAGE, { type: INITIALIZE_USERS, payload: users } );
            socket.emit( SOCKET_MESSAGE, { type: INITIALIZE_CHANNELS, payload: channels } );
        }
    );
};

module.exports = handleIo;
