import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import CircularProgress from "@mui/material/CircularProgress";
import SingleGroupChatItem from "./components/SingleGroupChat";

const ChatLists = () => {
  // State variable to store current user joined activities
  const [joinedActivities, setJoinedActivities] = useState([]);
  const [postsStatus, setPostsStatus] = useState("loading");

  // Get current user information
  const { currentUser } = useContext(CurrentUserContext);

  // Get the data of all joined Activities for the current user
  useEffect(() => {
    setPostsStatus("loading");
    fetch(`/posts/joiner/${currentUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        setJoinedActivities(data.posts);
        setPostsStatus("idle");
      });
  }, [currentUser._id]);

  if (
    postsStatus === "loading" ||
    currentUser === null ||
    currentUser === undefined
  ) {
    return (
      <Wrapper>
        <h2>Joined Activities Chats</h2>
        <CircleWrapper>
          <CircularProgress style={{ color: "#EE6C4D" }} />
        </CircleWrapper>
      </Wrapper>
    );
  }

  if (joinedActivities.length === 0) {
    return (
      <Wrapper>
        <h2>Joined Activities Chats</h2>
        <CircleWrapper>you have not joined any activity</CircleWrapper>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h2>Joined Activities Chats</h2>
      {joinedActivities.map((activity) => {
        return <SingleGroupChatItem key={activity._id} activity={activity} />;
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  h2 {
    margin: 10px;
    text-align: center;
  }
  /* border: 1px solid red; */
  height: 100%;
  overflow: auto;
`;

const CircleWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export default ChatLists;
