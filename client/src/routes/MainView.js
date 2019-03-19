import React from 'react';

import SideBar from '../components/Sidebar';
import Header from '../components/Header';
import Messages from '../components/Messages';
import Input from '../components/Input';
import Layout from '../components/Layout';
import { App } from "../components/App";

const username = 'Username';
const channels = [{id: 1, name: 'general'}, {id: 2, name: 'random'}];
const users = [{id: 1, name: 'slackbot', isOnline: true}, {id: 2, name: 'user1', isOnline: false}];

const channelName = 'general';

export default () => (
    <App/>
    /*<Layout>
        <SideBar
            username={username}
            channels={channels}
            users={users}
        />
        <Header channelName={channelName}/>
        <Messages>
            <ul className='message-list'>
                <li/>
                <li/>
            </ul>
        </Messages>
        <Input channelName={channelName}/>
    </Layout> */
);
