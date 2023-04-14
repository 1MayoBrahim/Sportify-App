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

  // user commnets
  const [comment, setComment] = useState("");
  // is there a new comment
  const [isComment, setIsComment] = useState(false);
  // all comments related to this activity
  const [allComments, setAllComments] = useState([]);
  // id for the comment to be modified
  const [isEditId, setIsEditId] = useState(null);

  // updatedComment
  const [updatedComment, setUpdatedComment] = useState("");

  // A state variable store single post data after fetching
  const [postData, setPostData] = useState(null);

  // A state variable to handle the loading screen until data is fetched
  const [postStatus, setPostStatus] = useState("loading");

  // A state variable to handle the update of remaining sports in the activity
  // The State variable is for user interaction to show a realtime update in the number
  // of remaining sports in the activity. The backend already is built to update the remaining spots for an activity
  const [numOfRemainingSpots, setNumOfRemainingSpots] = useState(0);

  // Create an endpoint to fetch specific post information
  useEffect(() => {
    setPostStatus("loading");
    fetch(`/posts/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setPostData(data.post);
        setPostStatus("idle");
        setNumOfRemainingSpots(data.post.limit - data.post.joining.length);
      });
  }, [_id]);

  useEffect(() => {
    fetch(`/get-comments?activityId=${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setAllComments(data.data);
      });
  }, [_id, isComment]);

  if (postStatus === "loading") {
    return (
      <CircleWrapper>
        <CircularProgress style={{ color: "#EE6C4D" }} />
      </CircleWrapper>
    );
  }

  // Add null check before accessing the properties of postData
  const creator_id = postData?.creator_id;
  const activityType = postData?.activityType;
  if (!creator_id || !activityType) {
    return <div>Error: The requested activity does not exist.</div>;
  }

  const submitHanlder = (e) => {
    e.preventDefault();
    fetch("/add-comment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser._id,
        comment,
        activityId: _id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setComment("");
          setIsComment(!isComment);
        }
      });
  };
  const updateHandler = (e) => {
    e.preventDefault();
    fetch(`/update-comment/${isEditId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: updatedComment,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setUpdatedComment("");
          setIsEditId(null);
          setIsComment(!isComment);
        }
      });
  };

  const handleDelete = (id) => {
    fetch(`/delete-comment/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setIsEditId(null);
          setIsComment(!isComment);
        }
      });
  };

  return (
    <Wrapper>
      <ReturnBar>
        <ReturnButton onClick={() => navigate(-1)}>
          <FaArrowLeft size={30} />
        </ReturnButton>
      </ReturnBar>
      <Summary>
        <FaShieldAlt size={100} color={"#EE6C4D"} />
        {creator_id !== currentUser._id && (
          <JoinButton
            postData={postData}
            setNumOfRemainingSpots={setNumOfRemainingSpots}
          />
        )}
        <Type>
          <span>{activityType}</span>
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
        <form onSubmit={submitHanlder}>
          <input
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <button>Comment</button>
        </form>
      </Container>
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
      <Container>
        <Description>
          <h2>Comments</h2>
          <CommentsContainer>
            {allComments.map((comment) => {
              return (
                <div>
                  <p>{comment.comment}</p>
                  {comment.userId === currentUser._id && (
                    <>
                      <button
                        onClick={() => {
                          if (isEditId) {
                            setIsEditId(null);
                          } else {
                            setIsEditId(comment._id);
                          }
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(comment._id);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {comment._id === isEditId && (
                    <form onSubmit={updateHandler}>
                      <input
                        value={updatedComment}
                        onChange={(e) => {
                          setUpdatedComment(e.target.value);
                        }}
                      />
                      <button>Update</button>
                    </form>
                  )}
                </div>
              );
            })}
          </CommentsContainer>
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
  color: white;
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
  background-color: #081b45;
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
    color: white;
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
    color: white;
  }
`;

const Date = styled.div`
  margin-top: 5px;
  font-size: 1.2em;
  color: white;
`;
const Time = styled.div`
  margin-top: 5px;
  font-size: 1.2em;
  color: white;
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
  color: white;
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
const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 10px;
`;

export default ActivityDetails;
