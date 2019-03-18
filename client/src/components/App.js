import React, { Component } from 'react';
import { connect } from 'react-redux';

import SideBar from './Sidebar';
import Header from './Header';
import Messages from './Messages';
import Input from './Input';
import Layout from './Layout';

const username = 'Username';
const channels = [ { id: 1, name: 'general' }, { id: 2, name: 'random' } ];
const users = [ { id: 1, name: 'slackbot', isOnline: true }, { id: 2, name: 'user1', isOnline: false } ];

const channelName = 'general';

const mapStateToProps = ({ messages, users, socket: { connected }, channels }) => ( {
    messages,
    connected,
    userCount: users ? users.length : 0,
    channelName: channels ? channels[0].name : 'Channel Error'
} );

export class App extends Component {

    onNewMessage = (message) => {
        this.send( message );
    };

    onNewUsername = (username) => {
        this.setState( { currentUser: { username } } );
    };

    render() {
        const { connected: online, userCount, messages, channelName } = this.props;

        return (
            <Layout>
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
                <Input />
            </Layout>
        )
    }
}

export default connect( mapStateToProps )( App );

// () => (
//     <Layout>
//         <SideBar
//             username={username}
//             channels={channels}
//             users={users}
//         />
//         <Header channelName={channelName}/>
//         <Messages>
//             <ul className='message-list'>
//                 <li/>
//                 <li/>
//             </ul>
//         </Messages>
//         <Input channelName={channelName}/>
//     </Layout>
// );
