import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useParams, useHistory } from "react-router";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { FiMapPin, FiClipboard } from "react-icons/fi";
import moment from "moment";
import JoinButton from "./JoinButton";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import ActivityParticipant from "./ActivityParticipant";

const ActivityDetails = () => {
  // Get the current user data from the context
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  // Get the post id for fetching
  const { _id } = useParams();

  // A state variable store single post data aftet fetching
  const [postData, setPostData] = useState(null);

  // A state variable to handle the loading screen until data is fetched
  const [postStatus, setPostStatus] = useState("loading");

  // A state variable to handle the update of remaining sports in the activity
  // The State variable is for user interaction to show a realtime update in the number
  // of remaining sports in the activity. The backend already is built to update the remaining spots for an activity
  const [numOfRemainingSpots, SetNumOfRemainingSpots] = useState(undefined);

  // Create an endpoint to fetch specific post information
  useEffect(() => {
    setPostStatus("loading");
    fetch(`/posts/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setPostData(data.post);
        setPostStatus("idle");
        SetNumOfRemainingSpots(data.post.limit - data.post.joining.length);
      });
  }, [_id]);

  if (postStatus === "loading") {
    return (
      <CircleWrapper>
        <CircularProgress style={{ color: "#EE6C4D" }} />
      </CircleWrapper>
    );
  }
  return (
    <Wrapper>
      <ReturnBar>
        <ReturnButton onClick={() => navigate(-1)}>
          <FaArrowLeft size={30} />
        </ReturnButton>
      </ReturnBar>
      <Summary>
        <FaShieldAlt size={100} color={"#EE6C4D"} />
        {postData.creator_id !== currentUser._id && (
          <JoinButton
            postData={postData}
            numOfRemainingSpots={numOfRemainingSpots}
            SetNumOfRemainingSpots={SetNumOfRemainingSpots}
          />
        )}
        <Type>
          <span>{postData.activityType}</span>
          {" - "}
          <span>{postData.level} Level</span>
        </Type>
        <Date>
          {moment(postData.activityDate.date, "YYYY-MM-DD").format(
            "ddd MMMM Do YYYY"
          )}
        </Date>
        <Time>
          {moment(postData.activityDate.from, "HH:mm").format("hh:mm A")} to{" "}
          {moment(postData.activityDate.to, "HH:mm").format("hh:mm A")}
        </Time>
        <SubContainer>
          <Text>
            <FiClipboard size={20} />
            <span>{numOfRemainingSpots} spots left</span>
          </Text>
          <Text>
            <FiMapPin size={20} />
            <span>
              {postData.activityAddress.city},{" "}
              {postData.activityAddress.province}{" "}
            </span>
          </Text>
        </SubContainer>
      </Summary>

      <Container>
        <Description>
          <h2>Description</h2>
          <p>
            {postData.description}
            {postData.description}
          </p>
        </Description>
        <Address>
          <h2>Address</h2>
          <p>
            {postData.activityAddress.street}
            {", "}
            {postData.activityAddress.city}
            {", "}
            {postData.activityAddress.province}
          </p>
        </Address>
      </Container>
      <Container>
        <Description>
          <h2>Participants</h2>
          <ParticipantsContainer>
            <ActivityParticipant
              role={"Activity Host"}
              _id={postData.creator_id}
            />
            {postData.joining.map((participant) => {
              if (participant._id !== postData.creator_id) {
                return (
                  <ActivityParticipant
                    key={participant._id}
                    role={"Participant"}
                    _id={participant._id}
                  />
                );
              }
            })}
          </ParticipantsContainer>
        </Description>
      </Container>
      <br />
      <br />
    </Wrapper>
  );
};

const PuffInCenter = keyframes`
    0% {
        -webkit-transform: scale(2);
                transform: scale(2);
        -webkit-filter: blur(4px);
                filter: blur(4px);
        opacity: 0;
    }
    100% {
        -webkit-transform: scale(1);
                transform: scale(1);
        -webkit-filter: blur(0px);
                filter: blur(0px);
        opacity: 1;
    }
`;

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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  /* animation: ${PuffInCenter} 0.4s both; */
  animation: ${slideIn} 0.4s ease-out both;
`;

const CircleWrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const ReturnBar = styled.div`
  padding: 10px 10px;
`;

const ReturnButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 30px 0px;
`;

const Container = styled.div`
  padding: 0px 15px;
`;
const Description = styled.div`
  h2 {
    font-size: 1.5em;
    border-bottom: 2px solid #e0fbfc;
    padding-bottom: 6px;
    color: #ee6c4d;
  }
  p {
    margin: 10px 0px;
  }
`;
const Address = styled.div`
  h2 {
    font-size: 1.5em;
    border-bottom: 2px solid #e0fbfc;
    padding-bottom: 6px;
    color: #ee6c4d;
  }
  p {
    margin: 10px 0px;
  }
`;

const Date = styled.div`
  margin-top: 5px;
  font-size: 1.2em;
`;
const Time = styled.div`
  margin-top: 5px;
  font-size: 1.2em;
`;
const Type = styled.div`
  font-weight: 600;
  font-size: 1.6em;
  color: #ee6c4d;
`;

const SubContainer = styled.div`
  display: flex;

  color: #bcdeeb;
  font-size: 1.1em;
`;

const Text = styled.div`
  display: flex;
  margin: 7px;
  align-items: center;
  span {
    margin-left: 7px;
  }
`;

const ParticipantsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

export default ActivityDetails;
