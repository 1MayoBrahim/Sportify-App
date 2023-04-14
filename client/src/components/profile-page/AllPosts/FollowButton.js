import React, { useState } from "react";
import styled from "styled-components";

// This components handles follow/unfollow button that is shown in
// the user profile.

const FollowButton = ({
  currentUser,
  targetedUser,
  numOfFollowers,
  setNumOfFollowers,
}) => {
  // Check if whether current user is already following the targeted user or not
  // If yes, then set the initial value of isCurrentUserFollowing to true
  // If no, then set the initial value of isCurrentUserFollowing to false
  // The state variable is for frontend, the backend already knows if it's asked to follow or unfollow
  // based on the current status of following
  const initialFollowerStatus = targetedUser.followers.some(
    (user) => user._id === currentUser._id
  )
    ? true
    : false;
  const [isCurrentUserFollowing, setIsCurrentUserFollowing] = useState(
    initialFollowerStatus
  );

  console.log("numOfFollowers", numOfFollowers);

  const handleFollowing = () => {
    // When follow button is clicked, set the opposite of it's current value
    setIsCurrentUserFollowing(!isCurrentUserFollowing);
    // Increment or decrement the number of followers in frontend based on the current
    // following status
    isCurrentUserFollowing
      ? setNumOfFollowers(numOfFollowers - 1)
      : setNumOfFollowers(numOfFollowers + 1);

    fetch("/users/follow", {
      method: "PUT",

      body: JSON.stringify({ currentUser, targetUser: targetedUser }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <Wrapper>
      {isCurrentUserFollowing ? (
        <Button
          onClick={() => handleFollowing()}
          style={{ background: "#EE6C4D" }}
        >
          Unfollow
        </Button>
      ) : (
        <Button
          onClick={() => handleFollowing()}
          style={{ background: "#98C1D9" }}
        >
          Follow
        </Button>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

const Button = styled.button`
  margin: 10px;
  color: white;
  border: 2px solid white;
  height: 40px;
  width: 100px;
  padding: 5px 0px;
  text-align: center;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

export default FollowButton;
