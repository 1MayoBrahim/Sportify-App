import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import socketIoClient from "socket.io-client";
import SendMessage from "./SendMessage";
import moment from "moment";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router";
import CircularProgress from "@mui/material/CircularProgress";

const Chat = ({ currentUser, activityId }) => {
  let navigate = useNavigate();

  const scroll = useRef();
  const [messages, setMessages] = useState([]);
  const [chatStatus, setChatStatus] = useState("loading");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(
      socketIoClient(
        "http://localhost:8000",
        // { query: `activityId=activityId_${activityId}` })
        { query: `activityId=${activityId}` }
      )
    );
  }, [activityId]);

  useEffect(() => {
    if (socket === null) {
      return null;
    }
    setChatStatus("loading");

    socket.on("connect", () => console.log("New client with id: ", socket.id));

    socket.on("get-messages", (messages) => {
      // expect server to send us the latest messages
      setMessages(messages);
      setChatStatus("idle");
    });

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
  }, [socket, activityId]);

  if (chatStatus === "loading") {
    return (
      <LoadingContainer>
        <CircularProgress style={{ color: "#EE6C4D" }} />
      </LoadingContainer>
    );
  }

  return (
    <Wrapper>
      <ReturnBar>
        <ReturnButton onClick={() => navigate()}>
          <FiChevronLeft size={30} />
        </ReturnButton>
      </ReturnBar>
      <MessagesContainer ref={scroll}>
        {messages.map(({ text, photoURL, uid, displayName, createdAt }) => (
          <div key={createdAt}>
            {uid === currentUser._id ? (
              <MessageContainerSent key={createdAt}>
                <MessageInfoSent>
                  <MessageSent key={createdAt}>
                    <Text>{text}</Text>
                  </MessageSent>
                  <Time>{moment(createdAt).calendar()}</Time>
                </MessageInfoSent>
              </MessageContainerSent>
            ) : (
              <MessageContainerReceived key={createdAt}>
                <UserImg
                  style={{ backgroundImage: `url(${photoURL})` }}
                  alt="user image"
                  key={createdAt}
                ></UserImg>
                <MessageInfo>
                  <Sender>{displayName}</Sender>
                  <MessageReceived key={createdAt}>
                    <Text>{text}</Text>
                  </MessageReceived>
                  <Time>{moment(createdAt).calendar()}</Time>
                </MessageInfo>
              </MessageContainerReceived>
            )}
          </div>
        ))}
      </MessagesContainer>
      <SendMessage
        scroll={scroll}
        currentUser={currentUser}
        activityId={activityId}
        socket={socket}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100%;
`;

const LoadingContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const MessagesContainer = styled.div`
  display: flex;
  height: calc(100% - 60px - 40px);
  flex-direction: column;
  overflow: auto;
`;

const MessageContainer = styled.div`
  display: flex;
  /* border:1px solid red; */
  padding: 5px;
`;

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
`;

const MessageInfoSent = styled(MessageInfo)`
  align-items: flex-end;
`;

const Sender = styled.div`
  font-size: 0.7em;
  margin-left: 9px;
  margin-bottom: 3px;
`;
const MessageContainerSent = styled(MessageContainer)`
  flex-direction: row-reverse;
`;

const Time = styled.div`
  font-size: 0.7em;
  margin: 3px 20px;
  color: grey;
`;

const MessageContainerReceived = styled(MessageContainer)``;

const Message = styled.div`
  display: flex;
  border-radius: 30px;
  align-items: center;
  color: black;
  padding: 5px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 350px;
`;

const MessageSent = styled(Message)`
  margin-right: 10px;
  background-color: #3c4552;
  color: white;
  border-top-right-radius: 0px;
  flex-direction: row-reverse;
  text-align: end;
  float: right;
`;

const MessageReceived = styled(Message)`
  margin-left: 10px;
  border: 1px solid lightgray;
  background-color: #fafafa;
  border-top-left-radius: 0px;
  float: left;
`;

const UserImg = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: grey;
  border: 2px solid white;
`;

const Text = styled.p`
  padding: 0px 5px;
  font-size: 1em;
  margin-left: 10px;
  margin-right: 10px;
  overflow-wrap: break-word;
`;

const ReturnBar = styled.div`
  /* border: 1px solid red; */
  display: flex;
  align-items: center;
  height: 40px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
    rgba(0, 0, 0, 0.22) 0px 15px 12px;
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

export default Chat;
