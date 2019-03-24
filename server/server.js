require( 'dotenv' ).config();
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const http = require( 'http' );
const { Pool } = require( 'pg' );
const socketIo = require( 'socket.io' );
const pool = new Pool();
const handleIo = require( './websocket' );

const app = express();
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );

( async () => {
    const db = await pool.connect();
    try {
        let res = await db.query( 'SELECT * FROM "testSchema"."testTable"' );
        console.log( res.rows );
        const values = [ res.rows[ res.rows.length - 1 ].col1ID + 1, null, 2 ];
        await db.query( 'INSERT INTO "testSchema"."testTable"("col1ID", "col2", "col3") VALUES ($1, $2, $3)', values );
        res = await db.query( 'SELECT * FROM "testSchema"."testTable"' );
        console.log( res.rows );

        app.get( '/', (req, res) => res.send( 'Hello World' ) );
        const server = http.Server( app );
        server.listen( 3001 );
        const io = socketIo( server );

        handleIo( io );

    } finally {
         db.release()
    }
} )().catch( e => console.log( e.stack ) );
