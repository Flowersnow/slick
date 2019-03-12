import React from 'react';
import styled from 'styled-components';

const SidebarDiv = styled.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #4e3a4c;
  color: #958993;
`;

const SidebarList = styled.ul`
  padding-left: 0px;
  list-style: none;
  width: 100%;
`;

const SidebarListItem = styled.li`
  padding: 2px;
  padding-left: 10px;
  &:hover {
    background: #3e313c;
  }
`;

const SidebarHeader = styled.div`padding-left: 10px;`;

const SlickHeader = styled.h1`
  color: #fff;
  font-size: 20px;
`;

const GreenCircle = styled.span`
  height: 6px;
  width: 6px;
  background-color: #38978d;
  border-radius: 50%;
  display: inline-block;
`;

const Bubble = ({ on }) => (on ? <GreenCircle/> : '○');

const renderChannels = ({ id, name }) => <SidebarListItem key={`channel-${id}`}># {name}</SidebarListItem>;

const renderUsers = ({ id, name, isOnline }) => (
    <SidebarListItem key={`user-${id}`}>
        <Bubble on={isOnline}/> {name}
    </SidebarListItem>
);

export default ({username, channels, users}) => (
    <SidebarDiv>
        <SidebarHeader>
            <SlickHeader>Slick</SlickHeader>
            {username}
        </SidebarHeader>
        <div>
            <SidebarList>
                <SidebarListItem>Channels</SidebarListItem>
                {channels.map(renderChannels)}
            </SidebarList>
        </div>
        <div>
            <SidebarList>
                <SidebarListItem>Direct Messages</SidebarListItem>
                {users.map(renderUsers)}
            </SidebarList>
        </div>
    </SidebarDiv>
)
