import React, { Component } from 'react';
import { connect } from 'react-redux';

import SideBar from './Sidebar';
import Header from './Header';
import Messages from './Messages';
import Input from './Input';
import Layout from './Layout';

const mapStateToProps = ({ messages, users, socket: { connected }, channels }) => ( {
    messages,
    connected,
    userCount: users ? users.length : 0,
    channelName: channels ? channels[ 0 ].name : 'Channel Error'
} );

export class MainApp extends Component {

    render() {
        return (
            <Layout>
                <SideBar/>
                <Header/>
                <Messages/>
                <Input/>
            </Layout>
        )
    }
}

/*export default */ connect( mapStateToProps )( MainApp );

