import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { channelChanged, socketAction, channelCreated, user } from "../../actions";
import { currentChannelSelector, currentUserSelector } from "../../selectors";
import { Button, Modal, Form, Comment } from 'semantic-ui-react';
import find from "lodash/find";

const ThreadDiv = styled.div`
  grid-column: 3;
  grid-row: 2;
  overflow-y: auto;
`;

const StyledContent = styled( Comment.Content )`
  &:hover {
    background: aliceblue;
  }
`;

const mapStateToProps = state => (
    {
        threads: state.threads,
        users: state.users
    }
);

export class Thread extends Component {

    getUserFromId = (userId) => ( find( this.props.users, user => user.id === userId ) || { name: "Unknown" } ).name;

    renderThreads = ({ userId, message, timestamp, id }) => (
        <Comment key={id}>
            <StyledContent>
                <Comment.Author as='a'>{this.getUserFromId( userId )}</Comment.Author>
                <Comment.Metadata>
                    <div>{timestamp}</div>
                </Comment.Metadata>
                <Comment.Text>{message}</Comment.Text>
            </StyledContent>
        </Comment>
    );

    render() {

        const {
            renderThreads,
            props: { threads }
        } = this;

        return (
            <ThreadDiv>
                <Comment.Group style={{ 'max-width': 'unset' }}>
                    {threads.map( renderThreads )}
                </Comment.Group>
            </ThreadDiv>
        )
    }
}

export default connect( mapStateToProps )( Thread );