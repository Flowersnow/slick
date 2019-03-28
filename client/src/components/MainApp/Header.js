import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Header as UiHeader, Form, Input } from 'semantic-ui-react';
import { currentChannelSelector } from "../../selectors";
import { socketAction, updateChannelDescription } from "../../actions";

const HeaderDiv = styled.div`
  grid-column: 2;
  grid-row: 1;
  text-align: center;
`;

const mapStateToProps = state => (
    {
        currentChannel: currentChannelSelector( state.channels, state.currentChannelId ),
        currentChannelId: state.currentChannelId
    }
);

const mapDispatchToProps = { updateChannelDescription: socketAction( updateChannelDescription ) };

export class Header extends Component {
    state = {
        channelDescription: ''
    };

    onMessageChanged = ({ target: { value: channelDescription } }) => {
        this.setState( { channelDescription } );
    };

    onMessageKeypress = ({ key }) => {
        if (key !== 'Enter') {
            return;
        }
        this.props.updateChannelDescription( this.props.currentChannelId, this.state.channelDescription );
        this.setState( { channelDescription: '' } );
    };

    render() {
        const {
            onMessageChanged,
            onMessageKeypress,
            state: { channelDescription },
            props: { currentChannel }
        } = this;

        return (
            <HeaderDiv>
                <UiHeader as='h2' dividing style={{ height: '100%' }}>#{currentChannel.name}
                    <UiHeader.Subheader>
                        <Form.Field>
                            <Input placeholder={currentChannel.description}
                                   value={channelDescription}
                                   onChange={onMessageChanged}
                                   onKeyPress={onMessageKeypress}
                                   transparent focus/>
                        </Form.Field>
                    </UiHeader.Subheader>
                </UiHeader>
            </HeaderDiv>
        );
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Header );
