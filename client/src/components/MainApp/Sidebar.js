import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { channelChanged, socketAction, channelCreated, user, clearThread } from "../../actions";
import { currentChannelSelector, currentUserSelector } from "../../selectors";
import { Button, Modal, Form } from 'semantic-ui-react';

const SidebarDiv = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
  overflow-y: auto;
`;

const SidebarList = styled.ul`
  padding-left: 0px;
  list-style: none;
  width: 100%;
`;

const SidebarListItem = styled.li`
  padding: 2px;
  padding-left: 10px;
  &:hover {
    background: #3e313c;
  }
`;

const SidebarHeader = styled.div`
  grid-column: 1;
  padding-left: 10px;
`;

const SlickHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;

const GreenCircle = styled.span`
  height: 6px;
  width: 6px;
  background-color: #38978d;
  border-radius: 50%;
  display: inline-block;
`;

const AddingHeaderDiv = styled.div`
  display: grid;
  height: min-content;
  grid-template-columns: 80% 20%;
`;

const StyledModal = styled( Modal )`
  grid-column: 2;
`;

const mapStateToProps = state => ( {
    users: state.users,
    channels: state.channels,
    currentUser: currentUserSelector( state.users, state.currentUserId ),
    currentChannel: currentChannelSelector( state.channels, state.currentChannelId )
} );
const mapDispatchToProps = {
    channelChanged: socketAction( channelChanged ),
    channelCreated: socketAction( channelCreated ),
    changeViewingUser: user.changeViewingUser,
    clearThread
};

const Bubble = ({ on }) => ( on ? <GreenCircle/> : '○' );

export class Sidebar extends Component {
    state = {
        newChannelName: '',
        newChannelDescription: '',
        modalOpen: false
    };

    onChangeChannel = (newChannelId) => () => {
        this.props.clearThread();
        this.props.channelChanged( newChannelId );
    };

    goToUserProfile = (user) => () => {
        this.props.changeViewingUser( user );
    };

    renderChannels = ({ id, name }) => <SidebarListItem onClick={this.onChangeChannel( id )}
                                                        key={`channel-${id}`}># {name}</SidebarListItem>;

    renderUsers = (user) => (
        <SidebarListItem key={`user-${user.id}`} onClick={this.goToUserProfile( user )}>
            <Bubble on={user.isOnline}/> {user.name}
        </SidebarListItem>
    );

    hidden = { visibility: 'hidden' };

    handleOpen = () => this.setState( { modalOpen: true } );

    handleClose = () => {
        this.createChannel();
        this.setState( { modalOpen: false } );
    };

    renderButton = ({ isAdmin }) => ( isAdmin
        ? <Button icon='plus' size='mini' circular onClick={this.handleOpen}/>
        : <Button style={this.hidden}/> );

    createChannel = () => {
        const { newChannelName, newChannelDescription } = this.state;
        const { currentUser } = this.props;
        if (newChannelName && newChannelDescription) {
            this.props.channelCreated( {
                name: newChannelName,
                description: newChannelDescription,
                channelAdmin: currentUser.id
            } );
        }
        this.setState( { newChannelName: '', newChannelDescription: '' } );
    };

    onFormUpdate = (e, { name, value }) => this.setState( { [ name ]: value } );

    render() {
        const {
            renderChannels,
            renderUsers,
            renderButton,
            onFormUpdate,
            handleClose,
            props: { users, currentUser, channels },
            state: { newChannelName, newChannelDescription, modalOpen }
        } = this;

        return (
            <SidebarDiv>
                <SidebarHeader>
                    <SlickHeader>Slick</SlickHeader>
                    {currentUser.name}
                </SidebarHeader>
                <div>
                    <SidebarList>
                        <AddingHeaderDiv>
                            <SidebarListItem>Channels</SidebarListItem>
                            <StyledModal trigger={renderButton( currentUser )}
                                         centered={false}
                                         open={modalOpen}>
                                <Modal.Header>Add a channel</Modal.Header>
                                <Modal.Content>
                                    <Form>
                                        <Form.Field>
                                            <label>Channel Name</label>
                                            <Form.Input
                                                placeholder='Channel Name'
                                                name='newChannelName'
                                                value={newChannelName}
                                                onChange={onFormUpdate}
                                            />
                                        </Form.Field>
                                        <Form.Field>
                                            <label>Channel Description</label>
                                            <Form.Input
                                                placeholder='Channel Description'
                                                name='newChannelDescription'
                                                value={newChannelDescription}
                                                onChange={onFormUpdate}
                                            />
                                        </Form.Field>
                                        <Button type='submit' onClick={handleClose}>Submit</Button>
                                    </Form>
                                </Modal.Content>
                            </StyledModal>
                        </AddingHeaderDiv>
                        {channels.map( renderChannels )}
                    </SidebarList>
                </div>
                <div>
                    <SidebarList>
                        <SidebarListItem>Profiles</SidebarListItem>
                        {users.map( renderUsers )}
                    </SidebarList>
                </div>
            </SidebarDiv>
        );
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Sidebar );
