import React from 'react';
import styled from 'styled-components';
import {Header} from 'semantic-ui-react';

const HeaderDiv = styled.div`
  grid-column: 2;
  grid-row: 1;
`;

export default ({channelName}) => (
    <HeaderDiv>
        <Header>#{channelName}</Header>
    </HeaderDiv>
);
