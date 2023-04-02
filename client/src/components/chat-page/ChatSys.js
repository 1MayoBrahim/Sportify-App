import React, { useContext } from "react";
import Styled, { keyframes } from "styled-components";
import Chat from "./components/Chat";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import { UseParams } from "react-router";

const ChatSys = () => {
  const { _id } = UseParams();

  const { currentUser } = useContext(CurrentUserContext);

  if (currentUser == null) {
    return <div> ...Loading </div>;
  }

  return (
    <Wrapper>
      <Chat currentUser={currentUser} activityId={_id} />
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

const Wrapper = styled.div`
  height: 100%;
  animation: ${slideIn} 0.4s ease-out both;
`;

export default ChatSys;
