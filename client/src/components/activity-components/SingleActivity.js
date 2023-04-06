import React from "react";
import styled from "styled-components";
import { keyframes } from "styled-components";
import {
  FiCalendar,
  FiMapPin,
  FiFlag,
  FiAnchor,
  FiClipboard,
} from "react-icons/fi";
import moment from "moment";
import ActivityItemBackground from "../assets/low-poly-grid-haikei.svg";
import { useNavigate } from "react-router";

// Here I should be passing the data of the activity I want to show.. no fetch here
const SingleActivity = ({ post }) => {
  let navigate = useNavigate();

  const iconSize = 25;

  const handleClick = () => {
    navigate(`/activity/${post._id}`);
  };

  return (
    <Wrapper onClick={() => handleClick()}>
      <Container>
        {/* <BackgroundImg></BackgroundImg> */}
        <FiCalendar size={45} />
        <SubContainer1>
          <ActivityDate>
            {moment(post.activityDate.date, "YYYY-MM-DD").format(
              "ddd MMMM Do YYYY"
            )}
          </ActivityDate>

          <ActivityTime>
            {moment(post.activityDate.from, "HH:mm").format("hh:mm A")} -{" "}
            {moment(post.activityDate.to, "HH:mm").format("hh:mm A")}
          </ActivityTime>
        </SubContainer1>
      </Container>
      <Text style={{ marginTop: "6px" }}>
        <FiMapPin size={iconSize} />
        {post.distance !== undefined && <span>{post.distance} km -</span>}
        <span>
          {post.activityAddress.city}, {post.activityAddress.province}, Canada
        </span>
      </Text>

      <SubContainer2 style={{ marginTop: "6px" }}>
        <Text>
          <FiFlag size={iconSize} />
          <span>{post.activityType}</span>
        </Text>

        <Text>
          <FiAnchor size={iconSize} />
          <span>{post.level}</span>
        </Text>
      </SubContainer2>
      <Text style={{ marginTop: "6px", paddingBottom: "15px" }}>
        <FiClipboard size={iconSize} />
        <span>{post.limit - post.joining.length} remaining spots</span>
      </Text>
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
  /* border: 1px solid red; */
  margin: 15px;
  border-radius: 10px;
  background: #293241;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  animation: ${slideIn} 0.5s ease-in-out;
  cursor: pointer;
`;
const Container = styled.div`
  font-weight: bold;
  font-size: 1.2em;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  /* border: 1px solid green; */
  border-radius: 10px 10px 0px 0px;
  padding: 20px 10px;
  z-index: 1;
  color: white;
  text-shadow: 2px 8px 6px rgba(0, 0, 0, 0.2),
    0px -5px 35px rgba(255, 255, 255, 0.3);
  background-image: url(${ActivityItemBackground});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

// const BackgroundImg = styled.div`
// position: absolute;
// right:-50%;
// /* top:-100%; */
// z-index: -1;
// opacity: 1;
// background-image: url(${ActivityItemBackground});
// background-repeat: no-repeat;
// background-position: center;
// background-size: cover;
// height: 30px;
// border: 1px solid red;
// `;

const SubContainer1 = styled.div`
  margin-left: 10px;
`;

const SubContainer2 = styled.div`
  display: flex;
`;

const ActivityDate = styled.div``;

const ActivityTime = styled.div``;

const Text = styled.div`
  /* border: 1px solid red; */
  padding-left: 6px;
  display: flex;
  align-items: center;
  color: darkgrey;
  span {
    margin: 0px 5px;
  }
`;

export default SingleActivity;
