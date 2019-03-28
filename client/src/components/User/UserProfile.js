import React from 'react';
import { connect } from "react-redux";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { viewingUserSelector } from '../../selectors';
import {socketAction, user} from "../../actions";

const UserComponentDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: stretch;
`;

const MetadataField = styled.span`
  display: flex;
  justify-content: space-between;
  font-size: 2.8vw;
`;

const MetadataFieldDescriptor = styled.span`
    color: #A9A9A9;
`;


const MetadataContainer = styled.div`
    padding: 2em;
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
`;

const Wrapper = styled.section`
  height: 100vh;
  width: 100wh;
  display: flex;
  align-content: stretch;
`;

const DisplayName = styled.h1`
  font-size: 3vw;
`;

const mapStateToProps = ({users, viewingUserId}) => {
    return ( {
    userInfo: viewingUserSelector(users, viewingUserId)
} )};

const mapDispatchToProps = {
    getUserStatistics: socketAction( user.getUserStatistics ),
};

export class UserProfile extends React.Component {

    goToUserStats() {
        this.props.getUserStatistics(this.props.userInfo.id);
    }

    render() {

        const {
            props: { userInfo },
            goToUserStats,
        } = this;

        return (
            <Wrapper>
            <UserComponentDiv>
                <UserMetadata {...userInfo} />
                <div>
                    <img onClick={goToUserStats.bind(this)} src="https://cdn1.iconfinder.com/data/icons/charts-and-diagrams-1-1/512/barchart-512.png" height="24" width="24"/>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>Click the icon to view {userInfo.name}'s usage stats!
                </div>
                <br></br>
                <div>
                    <img src="https://cdn3.iconfinder.com/data/icons/android-app-solid/128/16_Message-512.png" height="24" width="24"/>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Link to={"/"}>Return to messages</Link>
                </div>
                <br></br>
            </UserComponentDiv>
            </Wrapper>
        );
    }
}

const UserMetadata = ({name, description, isOnline, username}) => (

    <MetadataContainer>
        <div>
        <DisplayName>{name}</DisplayName>
        </div>

        <MetadataField>
            <MetadataFieldDescriptor>Description</MetadataFieldDescriptor>
            <span>&nbsp;</span>
            <span>{description}</span>
        </MetadataField>

        <MetadataField>
            <MetadataFieldDescriptor>Status</MetadataFieldDescriptor>
            <span>&nbsp;</span>
            <span>{isOnline ? "Active" : "Away"} </span>
        </MetadataField>

        <MetadataField>
            <MetadataFieldDescriptor>Email</MetadataFieldDescriptor>
            <span>&nbsp;</span>
        <span>{username}</span>
        </MetadataField>
    </MetadataContainer>
);


export default connect( mapStateToProps, mapDispatchToProps )( UserProfile );
