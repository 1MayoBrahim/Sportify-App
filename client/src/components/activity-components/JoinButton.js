import React, { useContext, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const JoinButton = ({
  postData,
  numOfRemainingSpots,
  setNumOfRemainingSpots,
}) => {
  // Get the current user data from the context
  const { currentUser } = useContext(CurrentUserContext);

  // Check the current status of joining ( before clicking on the join/withdraw button )
  // If the user has already joined, then the initial value for isCurrentUserJoined is set to true
  // If the user has not joined, then the initial value for isCurrentUserJoined is set to false
  const initialJoiningStatus = postData.joining.some(
    (user) => user._id === currentUser._id
  )
    ? true
    : false;
  const [isCurrentUserJoined, setIsCurrentUserJoined] =
    useState(initialJoiningStatus);

  const handleJoining = () => {
    // This update is for userinteraction to change the button style based on
    // the current status of joining
    setIsCurrentUserJoined(!isCurrentUserJoined);

    // This is also for frontend to increment/decrement num of spots in the activity
    if (isCurrentUserJoined) {
      setNumOfRemainingSpots((prev) => prev + 1);
    } else {
      setNumOfRemainingSpots((prev) => prev - 1);
    }

    // Now let's let the backend does its work to update the joining status + the num of remaining spots
    fetch("/post/updateJoining", {
      method: "PUT",
      body: JSON.stringify({ currentUser, postData }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  };

  if (postData.limit - postData.joining.length === 0 && !initialJoiningStatus) {
    return (
      <JoiningStatus>
        <Status>
          <FiXCircle size={20} color={"red"} />
          <span style={{ color: "red" }}>
            No remaining spots for this activity
          </span>
        </Status>
        <br />
      </JoiningStatus>
    );
  }
  return (
    <JoiningStatus>
      {isCurrentUserJoined ? (
        <>
          <Status>
            <FiCheckCircle size={20} color={"lightgreen"} />
            <span>You have joined this activity</span>
          </Status>
          <Button onClick={() => handleJoining()} style={{ background: "red" }}>
            withdraw
          </Button>
        </>
      ) : (
        <>
          <Status>
            <FiXCircle size={20} color={"red"} />
            <span style={{ color: "red" }}>
              You have not joined this activity
            </span>
          </Status>
          <Button
            onClick={() => handleJoining()}
            style={{ background: "green" }}
          >
            join
          </Button>
        </>
      )}
    </JoiningStatus>
  );
};

const Button = styled.button`
  margin: 10px;
  color: inherit;
  border: 2px solid white;
  height: 40px;
  width: 100px;
  padding: 5px 0px;
  text-align: center;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

const JoiningStatus = styled.div`
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid red; */
`;

const Status = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: 5px;
  }
`;

export default JoinButton;
