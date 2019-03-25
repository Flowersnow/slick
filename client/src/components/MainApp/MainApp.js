import React, { Component } from 'react';
import { connect } from 'react-redux';

import SideBar from './Sidebar';
import Header from './Header';
import Messages from './Messages';
import Input from './Input';
import Layout from './Layout';

class MainApp extends Component {

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

const connectedApp = connect()( MainApp );
export { connectedApp as MainApp };
