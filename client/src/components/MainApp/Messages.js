import React, { Component } from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Comment } from 'semantic-ui-react';
import find from 'lodash/find';
import { messagesForChannelSelector } from "../../selectors/index";

const MessagesDiv = styled.div`
  grid-column: 2;
  grid-row: 2;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
`;

const StyledContent = styled( Comment.Content )`
  &:hover {
    background: aliceblue;
  }
`;

const mapStateToProps = (state) => (
    {
        users: state.users,
        messagesForChannel: messagesForChannelSelector( state.messages, state.currentChannelId )
    }
);

export class Messages extends Component {

    getUserFromId = (userId) => ( find( this.props.users, user => user.id === userId ) || { name: "Unknown" } ).name;

    renderComments = ({ userId, message, timestamp }) => (
        <Comment key={timestamp}>
            <StyledContent>
                <Comment.Author as='a'>{this.getUserFromId( userId )}</Comment.Author>
                <Comment.Metadata>
                    <div>{timestamp}</div>
                </Comment.Metadata>
                <Comment.Text>{message}</Comment.Text>
                <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
            </StyledContent>
        </Comment>
    );

    render() {
        const {
            renderComments,
            props: { messagesForChannel }
        } = this;

        return (
            <MessagesDiv>
                <Comment.Group style={{ 'max-width': 'unset' }}>
                    {messagesForChannel.map( renderComments )}
                </Comment.Group>
            </MessagesDiv>
        )
    }
}

export default connect( mapStateToProps )( Messages );