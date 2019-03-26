import React from 'react';
import connect from "react-redux/es/connect/connect";
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

const MetadataField = styled.span`
  display: flex;
  justify-content: space-between;
  font-size: 2.8vw;
`;

const StatsComponent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
`;

const mapStateToProps = ({users, socket: { connected } }) => ( {

} );

export class UserStats extends React.Component {

    constructor(props) {
        super(props);
    };

    render() {

        return (
            <Wrapper>
                <UserStatsDiv>
                    <StatsComponent>
                <DisplayName>
                    <NameHeader {...{fname:"Jon", lname:"Snow"}}></NameHeader>
                </DisplayName>
                <FormattedFieldDisplay {...{
                    value: '2019-01-27',
                    message_prefix: "Joined:",
                    message_suffix:""}}>
                </FormattedFieldDisplay> <span></span>
                <FormattedFieldDisplay {... {
                    value: "#yvr-foodie",
                    message_prefix: "Most active in this channel: ",
                    message_suffix: ""
                }}>
                </FormattedFieldDisplay>
                <FormattedFieldDisplay {...{
                value:3,
                message_prefix: "Currently a member of ",
                message_suffix: " channels"}}>
                </FormattedFieldDisplay>
                <FormattedFieldDisplay {...{
                    value: 2,
                    message_prefix: "Currently an admin of ",
                    message_suffix: " channels"}}>
                </FormattedFieldDisplay>
                <FormattedFieldDisplay {...{
                    value: 1024,
                    message_prefix: "Sent ",
                    message_suffix: " messages"
                }}>
                </FormattedFieldDisplay>
                <FormattedFieldDisplay {...{
                    value: 35,
                    message_prefix: "Avg. number of messages sent today: ",
                    message_suffix: ""
                }}>
                </FormattedFieldDisplay>
                <FormattedFieldDisplay {...{
                    value: 47,
                    message_prefix: "Avg. length of messages sent: ",
                    message_suffix: ""
                }}>
                </FormattedFieldDisplay>
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
                </UserStatsDiv>
            </Wrapper>
        );
    }
}

const NameHeader = ({fname, lname}) => (
    <div>{fname} {lname}'s Usage Stats</div>
);

const FormattedFieldDisplay = ({value, message_prefix, message_suffix}) => (
    <MetadataField>
        {message_prefix} {value} {message_suffix}
    </MetadataField>
);



connect( mapStateToProps )( UserStats );
