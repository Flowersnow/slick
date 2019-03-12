import React from 'react';

import SideBar from '../components/Sidebar';
import Header from '../components/Header';
import Messages from '../components/Messages';
import Input from '../components/Input';
import Layout from '../components/Layout';

const channels = [{ id: 1, name: 'general' }, { id: 2, name: 'random' }];
const users = [{ id: 1, name: 'slackbot' }, { id: 2, name: 'user1' }];

export default () => (
    <Layout>
        <SideBar
            username="Username"
            channels={channels}
            users={users}
        />
        <Header>Header</Header>
        <Messages>
            <ul className="message-list">
                <li />
                <li />
            </ul>
        </Messages>
        <Input>
            <input type="text" placeholder="CSS Grid Layout Module" />
        </Input>
    </Layout>
);
