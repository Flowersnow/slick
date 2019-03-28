import React, { Component } from 'react';
import styled from 'styled-components';
import { Input as UiInput } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { socketAction, messageSent } from "../../actions";
import { currentChannelSelector, currentUserSelector } from "../../selectors";

const InputDiv = styled.div`
  grid-column: 2;
  grid-row: 3;
  margin: 20px;
`;

const mapStateToProps = state => ( {
    online: state.socket.connected,
    currentChannel: currentChannelSelector( state.channels, state.currentChannelId ),
    currentUser: currentUserSelector( state.users, state.currentUserId )
} );

const mapDispatchToProps = { messageSent: socketAction( messageSent ) };

class Input extends Component {
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
        this.props.messageSent( this.state.message, this.props.currentUser.id, this.props.currentChannel.id );
        this.setState( { message: '' } );
    };

    get disabled() {
        return !this.props.online;
    }

    render() {
        const {
            onMessageChanged,
            onMessageKeypress,
            disabled,
            state: { message }
        } = this;

        const {
            currentChannel
        } = this.props;

        return (
            <InputDiv>
                <UiInput fluid placeholder={`Message #${currentChannel.name}`}
                         value={message}
                         onChange={onMessageChanged}
                         onKeyPress={onMessageKeypress}
                         disabled={disabled}/>
            </InputDiv>
        );
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Input );
