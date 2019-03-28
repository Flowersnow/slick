const uuid = require( 'uuid/v4' );

async function saveMessage(db, payload) {
    const { message, userId, channelId, timestamp } = payload;
    const contentQuery = {
        text: 'INSERT INTO "content" VALUES($1, $2) ON CONFLICT DO NOTHING',
        values: [ message, message.length ],
    };
    const values = [ `T${uuid()}`, timestamp, userId, channelId, message ];
    const messageQuery = {
        text: 'INSERT INTO messages VALUES($1, $2, NULL, $3, NULL, $4, $5)',
        values
    };
    try {
        await db.query( contentQuery );
        await db.query( messageQuery );
        return {
            id: values[ 0 ],
            timestamp,
            pinnedby: null,
            userId,
            isreplytotextid: null,
            channelId,
            message
        }
    }
    catch (err) {
        logError( err );
    }
}

async function sendCurrentChannelMessages(db, currentChannelId) {
    const query = {
        text: 'SELECT * FROM messages WHERE channelid = $1 AND isreplytotextid IS NULL',
        values: [ currentChannelId ]
    };
    try {
        const response = await db.query( query );
        return response.rows.map( ({ id, sentat, pinnedby, userid, isreplytotextid, channelid, content }) => ( {
                id,
                timestamp: sentat,
                pinnedby,
                userId: userid,
                isreplytotextid,
                channelId: channelid,
                message: content
            }
        ) );
    } catch (err) {
        logError( err );
    }
}

async function getUserInfo(db, username) {
    const query = {
        text: 'SELECT * FROM users WHERE username = $1',
        values: [ username ]
    };
    try {
        const response = await db.query( query );
        return response.rows.map( ({ userid }) => ( { id: userid } ) )[ 0 ];
    } catch (err) {
        logError( err );
    }
}

async function getInitialInfo(db) {
    const usersQuery = {
        text: 'SELECT u.userid AS id, fullname AS name, description, username, status,\n' +
            '\tCASE WHEN a.userid IS NOT NULL\n' +
            '\tTHEN true\n' +
            '\tELSE false\n' +
            '\tEND AS "isAdmin"\n' +
            '\tFROM users u LEFT JOIN ADMIN a ON u.userid = a.userid'
    };
    const channelsQuery = {
        text: 'SELECT * FROM channel'
    };
    try {
        const usersResponse = await db.query( usersQuery );
        const channelsResponse = await db.query( channelsQuery );

        const users = usersResponse.rows.map( ({ id, name, description, username, status, isAdmin }) => ( {
            id,
            name,
            description,
            username,
            isOnline: status === "active",
            isAdmin
        } ) );

        const channels = channelsResponse.rows.map( ({ channelid, channelname, description, ismanagedbyadminid }) => (
            {
                id: channelid,
                name: channelname,
                description,
                channelAdmin: ismanagedbyadminid
            }
        ) );
        return { users, channels };
    } catch (err) {
        logError( err );
    }
}

async function createNewChannel(db, { name, description, channelAdmin }) {
    const values = [ `C${uuid()}`, name, description, channelAdmin ];
    const query = {
        text: 'INSERT INTO channel VALUES($1, $2, $3, $4)',
        values
    };
    try {
        await db.query( query );
        return { id: values[ 0 ], name, description, channelAdmin };
    } catch (err) {
        logError( err );
    }
}

async function saveThreadMessage(db, { message, channelId, userId, isreplytotextid, timestamp }) {
    const contentQuery = {
        text: 'INSERT INTO "content" VALUES($1, $2) ON CONFLICT DO NOTHING',
        values: [ message, message.length ],
    };
    const values = [ `T${uuid()}`, timestamp, userId, isreplytotextid, channelId, message ];
    const messageQuery = {
        text: 'INSERT INTO messages VALUES($1, $2, NULL, $3, $4, $5, $6)',
        values
    };
    try {
        await db.query( contentQuery );
        await db.query( messageQuery );
        return {
            id: values[ 0 ],
            timestamp,
            pinnedby: null,
            isreplytotextid,
            userId,
            channelId,
            message
        }
    }
    catch (err) {
        logError( err );
    }
}

async function getThreadMessages(db, { messageId, channelId }) {
    const query = {
        text: 'SELECT * FROM MESSAGES WHERE isreplytotextid = $1 AND channelid = $2',
        values: [ messageId, channelId ]
    };
    try {
        const threads = await db.query( query );
        return threads.rows.map( ({ id, sentat, pinnedby, userid, isreplytotextid, channelid, content }) => ( {
            id,
            timestamp: sentat,
            pinnedby,
            userId: userid,
            isreplytotextid,
            channelId: channelid,
            message: content
        } ) );
    } catch (err) {
        logError( err );
    }
}

async function updateChannel(db, { channelId, channelDescription }) {
    const updateQuery = {
        text: 'UPDATE channel\n' +
            'SET description = $1\n' +
            'WHERE channelid = $2',
        values: [ channelDescription, channelId ]
    };
    const selectQuery = {
        text: 'SELECT * from channel where channelid = $1',
        values: [ channelId ]
    };
    try {
        await db.query( updateQuery );
        const channel = await db.query( selectQuery );
        return channel.rows.map( ({ channelid, channelname, description, ismanagedbyadminid }) => (
            {
                id: channelid,
                name: channelname,
                description,
                channelAdmin: ismanagedbyadminid
            }
        ) )[ 0 ];
    } catch (err) {
        logError( err );
    }
}


function logError(err) {
    console.log( 'Error while querying database!' );
    console.log( err );
}

module.exports = {
    saveMessage,
    sendCurrentChannelMessages,
    getUserInfo,
    getInitialInfo,
    createNewChannel,
    saveThreadMessage,
    getThreadMessages,
    updateChannel
};
