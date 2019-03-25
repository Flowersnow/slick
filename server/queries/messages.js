const uuid = require( 'uuid/v4' );
const { MESSAGE_RECEIVED, MESSAGES_RECEIVED } = require( '../../client/src/actions/actionTypes' );

async function saveMessage(db, payload) {
    const { message, userId, channelId, timestamp } = payload;
    const contentQuery = {
        text: 'INSERT INTO "content" VALUES($1, $2) ON CONFLICT DO NOTHING',
        values: [ message, message.length ],
    };
    const messageQuery = {
        text: 'INSERT INTO messages VALUES($1, $2, NULL, $3, NULL, $4, $5)',
        values: [ `T${uuid()}`, timestamp, userId, channelId, message ]
    };
    try {
        await db.query( contentQuery );
        await db.query( messageQuery );
    }
    catch (err) {
        logError( err );
    }
}

async function sendCurrentChannelMessages(db, currentChannelId, socket) {
    const query = {
        text: 'SELECT * FROM messages WHERE channelid = $1',
        values: [ currentChannelId ]
    };
    try {
        let response = await db.query( query );
        response = response.rows.map( ({ sentat, pinnedby, userid, isreplytotextid, channelid, content }) => ( {
                timestamp: sentat,
                pinnedby,
                userId: userid,
                isreplytotextid,
                channelId: channelid,
                message: content
            }
        ) );
        socket.emit(MESSAGE_RECEIVED, { type: MESSAGES_RECEIVED, payload: response })
    } catch (err) {
        logError( err );
    }
}

function logError(err) {
    console.log( 'Error while querying database!' );
    console.log( err );
}

module.exports = { saveMessage, sendCurrentChannelMessages };
