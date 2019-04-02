import React from 'react';
import { connect } from "react-redux";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { viewingUserStatsSelector } from '../../selectors';
import { Form, Dropdown } from 'semantic-ui-react';
import {socketAction, user} from "../../actions";

const UserStatsDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100wh;
`;

const Wrapper = styled.section`
  height: 100vh;
  width: 100wh;
`;

const DisplayName = styled.h1`
  font-size: 2.5vw;
`;

const MetadataField = styled.div`
  font-size: 1.8vw;
`;

const StatsComponent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
`;

const MetadataFieldDescriptor = styled.span`
    color: #A9A9A9;
`;

const mapStateToProps = ({users, viewingUserId, viewingUserStats}) => {
        return ({
            viewingUser: viewingUserStatsSelector(users, viewingUserId),
            userStatistics: viewingUserStats
        })
};

const mapDispatchToProps = {
    getUserStatistics: socketAction( user.getUserStatistics ),
};

class UserStats extends React.Component {
    state = {
        channelName: '',
        nameMode: 'fullname'
    };

    handleSubmit = () => {
        this.props.getUserStatistics(this.props.viewingUser.id, this.state.nameMode, this.state.channelName, false);
    };

    onChannelNameChanged = ({ target: { value: channelName } } ) => {
        this.setState( { channelName } );
    };

    onNameModeChanged = (e,{value})=>this.setState({nameMode:value})

    dropdownOptions = [
        {key: 'fullname', text: 'Display full name', value: 'fullname'},
        {key: 'firstname', text: 'First name only', value: 'firstname'},
        {key: 'lastname', text: 'Last name only', value: 'lastname'},
    ];

    render() {

        const {
            props: {
                userStatistics: {
                    mostactivechannel,
                    numChannels,
                    numAdminChannels,
                    sentMessages,
                    avgLengthMessagesSent,
                    usersMessagedAllChannels
                },
                viewingUser
            },
            state: {
                nameMode
            },
            onChannelNameChanged,
            onNameModeChanged,
            handleSubmit,
            dropdownOptions
        } = this;

        return (
            <Wrapper>
                <UserStatsDiv>
                    <StatsComponent>
                <DisplayName>
                    <div>{viewingUser.name}'s Usage Stats</div>
                </DisplayName>
                <MetadataField>
                    Most active in this channel: {this.props.userStatistics.mostactivechannel}
                </MetadataField>
                <MetadataField>
                    Currently a member of {this.props.userStatistics.numChannels} channels
                </MetadataField>
                <MetadataField>
                    Currently an admin of {this.props.userStatistics.numAdminChannels} channels
                </MetadataField>
                <MetadataField>
                    Sent {this.props.userStatistics.sentMessages} messages
                </MetadataField>
                <MetadataField>
                    Avg. length of messages sent: {this.props.userStatistics.avgLengthMessagesSent}
                </MetadataField>
                    </StatsComponent>

                <div>
                    <img src="https://image.flaticon.com/icons/png/512/64/64572.png" height="24" width="24"/>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Link to={"/user"}>Go back to User Profile View</Link>
                </div>

                    <br></br>

                <div>
                    <img src="https://cdn3.iconfinder.com/data/icons/android-app-solid/128/16_Message-512.png" height="24" width="24"/>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <Link to={"/"}>Return to messages</Link>
                </div>
                <br></br>
                    <img src="https://cdn3.iconfinder.com/data/icons/stars-5/512/gold_star-512.png" height="24" width="24"/>

                    <MetadataFieldDescriptor>
                <FormattedFieldDisplay {... {
                        value: "",
                        message_prefix: "Slick Superstars (people who've messaged all the channels!):",
                        message_suffix: ""
                    }}>
                </FormattedFieldDisplay>
                    </MetadataFieldDescriptor>
                    <Dropdown
                        placeholder='Please select an option'
                        selection
                        options={dropdownOptions}
                        value={nameMode}
                        onChange={onNameModeChanged}
                    />
                    <br></br>
                    <Form onSubmit={handleSubmit}>
                        <label>Search only within channels containing this keyword &nbsp;</label>
                        <input
                            id="channelname"
                            type="text"
                            onChange={onChannelNameChanged} />
                        <button>Find the people!</button>
                    </Form>
                    <MetadataField>
                    {this.props.userStatistics.usersMessagedAllChannels}
                    </MetadataField>
                </UserStatsDiv>
            </Wrapper>
        );
    }
}


const FormattedFieldDisplay = ({value, message_prefix, message_suffix}) => (
    <MetadataField>
        {message_prefix} {value} {message_suffix}
    </MetadataField>
);



const userStatsConnected = connect( mapStateToProps, mapDispatchToProps )( UserStats );
export { userStatsConnected as UserStats };
