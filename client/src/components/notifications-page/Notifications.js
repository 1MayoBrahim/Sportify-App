import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import SingleNotification from "./SingleNotification";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import CircularProgress from "@mui/material/CircularProgress";

//*****************************
// This the notifications page
//*****************************

const Notifications = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [notifications, setNotifications] = useState([]);
  const [notificationsStatus, setNotificationsStatus] = useState("loading");

  // This is not a practical way to fetch notifications, but I am only doing it now because
  // it will require a lot of refactoring to put current user profile in context instead of
  // fetching it everytime the notification page is mounted
  useEffect(() => {
    setNotificationsStatus("loading");
    fetch(`/users/${currentUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        // Check if data.user.notifications exists before calling reverse method
        const reversedNotifications = data.user.notifications?.reverse() || [];
        setNotifications(reversedNotifications);
        setNotificationsStatus("idle");
      });
  }, [currentUser._id]);
  if (notificationsStatus === "loading") {
    return (
      <Wrapper>
        <h2>Notifications</h2>
        <CircleWrapper>
          <CircularProgress style={{ color: "#EE6C4D" }} />
        </CircleWrapper>
      </Wrapper>
    );
  } else if (notifications.length === 0) {
    return (
      <Wrapper>
        <h2>Notifications</h2>
        <CircleWrapper>You have not received any notifications</CircleWrapper>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h2>Notifications</h2>
      <Container>
        {notifications.map((notification) => (
          <SingleNotification
            key={notification._id}
            notification={notification}
          />
        ))}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
  h2 {
    height: 40px;
    text-align: center;
    color: white;
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

const CircleWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  color: white;
`;

const Container = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  animation: ${slideIn} 0.4s ease-out both;
`;

export default Notifications;
