import React, { Component } from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Comment } from 'semantic-ui-react';
import find from 'lodash/find';

const MessagesDiv = styled.div`
  grid-column: 2;
  grid-row: 2;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
`;

const mapStateToProps = (state) => (
    {
        users: state.users,
        messages: state.messages
    }
);

export class Messages extends Component {

    getUserFromId = (userId) => (
        ( find( this.props.users, user => user.id === userId ) || { name: "Unknown" } ).name
    );

    renderComments = ({ userId, message, timestamp }) => (
        <Comment>
            <Comment.Content>
                <Comment.Author as='a'>{this.getUserFromId( userId )}</Comment.Author>
                <Comment.Metadata>
                    <div>{timestamp}</div>
                </Comment.Metadata>
                <Comment.Text>{message}</Comment.Text>
                <Comment.Actions>
                    <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
            </Comment.Content>
        </Comment>
    );

    render() {
        const {
            renderComments,
            props: { messages }
        } = this;

        return (
            <MessagesDiv>
                <Comment.Group>
                    {messages.map( renderComments )}
                </Comment.Group>
            </MessagesDiv>
        )
    }
}

export default connect( mapStateToProps )( Messages );