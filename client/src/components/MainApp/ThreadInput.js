import React, { Component } from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { socketAction, threadMessageSent } from "../../actions";
import { currentThreadSelector, currentUserSelector } from "../../selectors";

const ThreadInputDiv = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const mapStateToProps = state => ( {
    online: state.socket.connected,
    currentThread: currentThreadSelector( state.messages, state.currentThreadId ),
    currentChannelId: state.currentChannelId,
    currentUserId: state.currentUserId
} );

const mapDispatchToProps = { threadMessageSent: socketAction( threadMessageSent ) };

class ThreadInput extends Component {
    state = {
        message: ''
    };

    onMessageChanged = ({ target: { value: message } }) => {
        this.setState( { message } );
    };

    onMessageKeypress = ({ key }) => {
        if (key !== 'Enter') {
            return;
        }

        this.props.threadMessageSent(
            this.state.message,
            this.props.currentChannelId,
            this.props.currentThread.id,
            this.props.currentUserId );
        this.setState( { message: "" } );
    };

    get disabled() {
        return ( !this.props.online || !this.props.currentThread );
    }

    render() {

        const {
            onMessageChanged,
            onMessageKeypress,
            disabled,
            state: { message },
        } = this;

        return (
            <ThreadInputDiv>
                <Input fluid placeholder={'Reply to this thread'}
                       value={message}
                       onChange={onMessageChanged}
                       onKeyPress={onMessageKeypress}
                       disabled={disabled}/>
            </ThreadInputDiv>
        )
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( ThreadInput );
