import React from "react";
import styled from "styled-components";
import moment from "moment";
import { keyframes } from "styled-components";
import { useNavigate } from "react-router";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import singleChatItemBackground from "../../assets/chat-low-poly-grid-haikei.svg";
const SingleGroupChatItem = ({ activity }) => {
  let navigate = useNavigate();

  const handleActivityChat = () => {
    navigate(`/chats/${activity._id}`);
  };

  return (
    <Wrapper onClick={() => handleActivityChat()}>
      <Container>
        <Title>
          <div>{activity.activityType},</div>
          <div>
            On{" "}
            {moment(activity.activityDate.date, "YYYY-MM-DD").format(
              "ddd MMMM Do YYYY"
            )}
          </div>
        </Title>
        <Details>
          <Time>
            <FiCalendar />
            <span>
              Time:{" "}
              {moment(activity.activityDate.from, "HH:mm").format("hh:mm A")} -{" "}
              {moment(activity.activityDate.to, "HH:mm").format("hh:mm A")}
            </span>
          </Time>
          <Members>
            <FiUsers />
            <span>{activity.joining.length} people joined this activity</span>
          </Members>
        </Details>
        <Address>
          <FiMapPin />
          <span>
            {activity.activityAddress.street}
            {", "}
            {activity.activityAddress.city}
            {", "}
            {activity.activityAddress.province}
          </span>
        </Address>
      </Container>
    </Wrapper>
  );
};

const slideIn = keyframes`
  0% {
    -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px;
  border-radius: 10px;
  padding: 10px;
  /* background-color: #293241; */
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  animation: ${slideIn} 0.5s ease-in-out;
  background-image: url(${singleChatItemBackground});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

const Wrapper = styled.div`
  /* border: 1px solid green; */
`;

const Title = styled.div`
  display: flex;
  color: #ee6c4d;
  div {
    margin-right: 10px;
    font-size: 1.1em;
    font-weight: bold;
  }
`;
const Details = styled.div``;

const Time = styled.div`
  margin-top: 5px;
  color: darkgrey;
  display: flex;
  align-items: center;

  span {
    margin-left: 5px;
  }
`;

const Members = styled.div`
  margin-top: 5px;
  color: darkgrey;
  display: flex;
  align-items: center;

  span {
    margin-left: 5px;
  }
`;

const Address = styled.div`
  margin-top: 5px;
  color: darkgrey;
  display: flex;
  align-items: center;

  span {
    margin-left: 5px;
  }
`;

export default SingleGroupChatItem;
