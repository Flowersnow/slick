import React, { Component } from 'react';
import styled from 'styled-components';
import { Input as UiInput } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { socketAction, messageSent } from "../actions";
import { currentChannelSelector } from "../selectors";

const InputDiv = styled.div`
  grid-column: 2;
  grid-row: 3;
  margin: 20px;
`;

const mapStateToProps = state => ( {
    online: state.socket.connected,
    currentChannel: currentChannelSelector( state )
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
        // console.log( this.state.message ); // todo remove
        this.props.messageSent( this.state.message, this.props.username );
        this.setState( { message: "" } );
    };

    get disabled() {
        return !this.props.online;
    }

    render() {
        // console.log( 'this.state = ' );
        // console.log( this.state );

        const {
            onMessageChanged,
            onMessageKeypress,
            // disabled,
            state: {
                message
            }
        } = this;

        const {
            currentChannel
        } = this.props;

        return (
            <InputDiv>
                <UiInput fluid placeholder={`Message #${currentChannel.name}`}
                         value={message}
                         onChange={onMessageChanged}
                         onKeyPress={onMessageKeypress}/>
            </InputDiv>
        );
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Input );
