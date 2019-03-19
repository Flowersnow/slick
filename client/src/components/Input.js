import React, { Component } from 'react';
import styled from 'styled-components';
import { Input as UiInput } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { socketAction, messageSent } from "../actions";
import { store } from "../index";

const InputDiv = styled.div`
  grid-column: 2;
  grid-row: 3;
  margin: 20px;
`;

const mapStateToProps = state => ( { online: state.socket.connected, channelName: state.currentChannel.name } );
const mapDispatchToProps = { messageSent: socketAction( messageSent ) };

export class Input extends Component {
    constructor(props) {
        super( props );

        this.state = {
            message: '',
            channelName: store.getState().currentChannel.name
        };

        store.subscribe(()=>{
            this.state.channelName = store.getState().currentChannel.name;
        });

    }

    onMessageChanged = ({ target: { value: message } }) => {
        this.setState( { message } );
    };

    onMessageKeypress = ({ key }) => {
        if (key !== 'Enter') {
            return;
        }
        console.log( this.state.message ); // todo remove
        this.props.messageSent( this.state.message, this.props.username );
        this.setState( { message: "" } );
    };

    get disabled() {
        return !this.props.online;
    }

    render() {
        console.log( 'this.state = ' );
        console.log( this.state );

        const {
            onMessageChanged,
            onMessageKeypress,
            state: { message, channelName },
            disabled
        } = this;

        return (
            <InputDiv>
                <UiInput fluid placeholder={`Message #${channelName}`}
                         value={message}
                         onChange={onMessageChanged}
                         onKeyPress={onMessageKeypress}/>
            </InputDiv>
        );
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Input );
