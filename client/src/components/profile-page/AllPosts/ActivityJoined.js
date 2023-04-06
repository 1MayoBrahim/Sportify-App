import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import SingleActivity from "../../activity-components/SingleActivity";
import { CurrentUserContext } from "../../all-contexts/currentUserContext";
import CircularProgress from "@mui/material/CircularProgress";

// This component is rendered inside the user profile page
// its shows the activities the user of the profile page has joined

const ActivityJoined = ({ profileData }) => {
  const { currentUser } = useContext(CurrentUserContext);
  const [postData, setPostData] = useState([]);
  const [postDataStatus, setPostDataStatus] = useState("loading");

  useEffect(() => {
    // Get the data of all posts in the system
    fetch(`/posts/joiner/${profileData._id}`)
      .then((res) => res.json())
      .then((data) => {
        setPostData(data.posts); // Store all posts data in the postData state variable
        setPostDataStatus("idle");
      });

    //  Clean up when this component is unmounted
    return () => {
      setPostData([]); // Clear
      setPostDataStatus("idle");
    };
  }, []);

  if (postDataStatus === "loading") {
    return (
      <CircleWrapper>
        <CircularProgress style={{ color: "#EE6C4D" }} />
      </CircleWrapper>
    );
  }
  return (
    <>
      {postData.length === 0 ? (
        <CircleWrapper>
          {currentUser._id === profileData._id
            ? "You have not joined any activity"
            : "This user has not joined any activity"}
        </CircleWrapper>
      ) : (
        <Wrapper>
          {postData.map((post) => {
            return <SingleActivity key={post._id} post={post} />;
          })}
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.div`
  overflow: auto;
  height: calc(100% - 35px);
  z-index: 0;
`;

const CircleWrapper = styled.div`
  display: flex;
  height: calc(100% - 35px);
  justify-content: center;
  align-items: center;
`;

export default ActivityJoined;
