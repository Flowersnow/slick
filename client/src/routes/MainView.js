import React from 'react';

import SideBar from '../components/Sidebar';
import Header from '../components/Header';
import Messages from '../components/Messages';
import Input from '../components/Input';
import Layout from '../components/Layout';

export default () => (
    <Layout>
        <SideBar>SideBar</SideBar>
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
