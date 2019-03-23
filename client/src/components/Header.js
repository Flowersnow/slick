import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Header as UiHeader } from 'semantic-ui-react';
import { currentChannelSelector } from "../selectors";

const HeaderDiv = styled.div`
  grid-column: 2;
  grid-row: 1;
  text-align: center;
`;

const mapStateToProps = state => (
    { currentChannel: currentChannelSelector(state) }
);

export class Header extends Component {
    render() {
        const {
            props: { currentChannel }
        } = this;

        return (
        <HeaderDiv>
            <UiHeader as='h2'>#{currentChannel.name}</UiHeader>
        </HeaderDiv>
        );
    }
}

export default connect( mapStateToProps )( Header );
