import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react';
import { currentThreadSelector, currentUserSelector } from "../../selectors/index";

const ThreadHeaderDiv = styled.div`
  grid-column: 3;
  grid-row: 1;
  text-align: center;
  padding-top: 10px;
`;

const mapStateToProps = state => ( {
    currentThread: currentThreadSelector( state.messages, state.currentThreadId ),
    currentUser: currentUserSelector.bind( null, state.users )
} );

class ThreadHeader extends Component {

    getThreadMessage = () => (
        this.props.currentThread
            ? this.props.currentThread.message
            : "Click 'Reply' to start a thread" );

    getThreadOwner = () => (
        this.props.currentThread
            ? this.props.currentUser( this.props.currentThread.userId ).username
            : "" );

    render() {

        const {
            getThreadMessage,
            getThreadOwner
        } = this;

        return (
            <ThreadHeaderDiv>
                <Header dividing style={{ height: '100%' }}>
                    {getThreadMessage()}
                    <Header.Subheader>
                        {getThreadOwner()}
                    </Header.Subheader>
                </Header>
            </ThreadHeaderDiv>
        )
    }
}

export default connect( mapStateToProps )( ThreadHeader );
