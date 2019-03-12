import React from 'react';
import styled from 'styled-components';

const SidebarDiv = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

export default ({username, channels, users}) => (
    <SidebarDiv>
        <div>
            {username}
        </div>
        <div>
            <ul>
                <li>Channels</li>
                {channels.map(({id, name})=><li key={`channel-${id}`}># {name}</li>)}
            </ul>
        </div>
        <div>
            <ul>
                <li>Direct Messages</li>
                {users.map(({id, name})=><li key={`user-${id}`}>{name}</li>)}
            </ul>
        </div>
    </SidebarDiv>
)
