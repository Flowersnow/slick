import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';

const InputDiv = styled.div`
  grid-column: 2;
  grid-row: 3;
  margin: 20px;
`;

export default ({channelName}) => (
    <InputDiv class="ui input">
        <Input fluid placeholder={`Message #${channelName}`}/>
    </InputDiv>
)
