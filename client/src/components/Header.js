import React from 'react';
import styled from 'styled-components';

const HeaderDiv = styled.div`
  grid-column: 2;
  grid-row: 1;
`;

export default ({channelName}) => {

    console.log('channelName = ', channelName);

    return <HeaderDiv>
        <header>#{channelName}</header>
    </HeaderDiv>
}
