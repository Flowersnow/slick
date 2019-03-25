const { MESSAGE_SENT, MESSAGE_RECEIVED, CHANGE_CHANNEL } = require( '../client/src/actions/actionTypes' );
const { saveMessage, sendCurrentChannelMessages } = require( './queries/messages' );
let currentChannelId;

function handleIo(io, db) {
    io.on( 'connect', socket => {
        console.log( 'connection started' );
        socket.on( CHANGE_CHANNEL, onChannelChange( socket, db ) );
        socket.on( MESSAGE_SENT, onMessage( socket, db ) );
        socket.on( 'disconnect', (reason) => {
            console.log( 'disconnecting!', reason );
        } );
    } );
}

const onChannelChange = (socket, db) => ({ newChannelId }) => {
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
            sendCurrentChannelMessages( db, currentChannelId, socket );
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

    saveMessage( db, payload );

    if (channelId !== currentChannelId) {
        payload.message = `Error, current channelId, ${channelId}, did not match currentChannelId, ${currentChannelId}, on server`
    }
    socket.to( currentChannelId ).emit( MESSAGE_RECEIVED, { type: MESSAGE_RECEIVED, payload } );
};

module.exports = handleIo;
