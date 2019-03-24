const { MESSAGE_SENT, MESSAGE_RECEIVED, CHANGE_CHANNEL } = require( '../client/src/actions/actionTypes' );
let currentChannelId;

function handleIo(io) {
    io.on( 'connect', socket => {
        console.log( 'connection started' );
        socket.on( CHANGE_CHANNEL, onChannelChange( socket ) );
        socket.on( MESSAGE_SENT, onMessage( socket ) );
        socket.on( 'disconnect', (reason) => {
            console.log( 'disconnecting!', reason );
        } );
    } );
}

const onChannelChange = (socket) => ({ newChannelId }) => {
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
        } );
    }
};

const onMessage = (socket) => ({ userId, message, channelId, timestamp }) => {
    const payload = {
        userId,
        timestamp,
        message,
        channelId
    };

    if (channelId !== currentChannelId) {
        payload.message = `Error, current channelId, ${channelId}, did not match currentChannelId, ${currentChannelId}, on server`
    }
    socket.to( currentChannelId ).emit( MESSAGE_RECEIVED, { type: MESSAGE_RECEIVED, payload } );
};

module.exports = handleIo;
