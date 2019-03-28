import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { channelChanged, socketAction, channelCreated, user, clearThread } from "../../actions";
import { currentChannelSelector, currentUserSelector } from "../../selectors";
import { Button, Modal, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

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
  padding-left: 10px;
  display: grid;
  height: min-content;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
`;

const SlickHeaderLeft = styled.h1`
  color: #fff;
  font-size: 20px;
  grid-column: 1;
  grid-row: 1;
`;

const SlickHeaderRight = styled.h1`
  color: #fff;
  font-size: 20px;
  grid-column: 2;
  grid-row: 1;
  margin: 0;
  text-align: end;
`;

const Username = styled.h4`
  color: #fff;
  grid-column: 1 / 2;
  grid-row: 2;
  margin: 0;
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
  grid-template-columns: 90% 10%;
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
    clearThread,
    logout: user.logout
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

    linkToAdminButton = ({isAdmin}) => (isAdmin
            ? <Link to="/admin" target="_blank">Go to Admin Panel</Link>
            : <Button style={this.hidden}/>
    );

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

    logout = () => (this.props.logout());

    render() {
        const {
            renderChannels,
            renderUsers,
            renderButton,
            onFormUpdate,
            handleClose,
            logout,
            linkToAdminButton,
            props: { users, currentUser, channels },
            state: { newChannelName, newChannelDescription, modalOpen }
        } = this;

        return (
            <SidebarDiv>
                <SidebarHeader>
                    <SlickHeaderLeft>Slick</SlickHeaderLeft>
                    <SlickHeaderRight>
                        <Button icon='log out' size='mini' circular onClick={logout} />
                    </SlickHeaderRight>
                    <Username>{currentUser.name}</Username>
                    {linkToAdminButton(currentUser)}
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
