import React, { useEffect, useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import noImg from "../assets/noImg.png";
import LogoutButton from "../login-signup-pages/LogoutButton";
import Posts from "../profile-page/AllPosts/Posts";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import { FiChevronLeft } from "react-icons/fi";
import FollowButton from "./AllPosts/FollowButton";
import moment from "moment";
import BannerBackground from "../../components/assets/circle-scatter-haikei.svg";

// This component is to render the profile page
// for both the current user and others

const Profile = () => {
  let navigate = useNavigate();
  const { _id } = useParams();

  // Get current user information from the currentUser Context
  const { currentUser } = useContext(CurrentUserContext);
  // A state variable to store the data for the user profile
  const [profileData, setProfileData] = useState();
  const [profileDataStatus, setProfileDataStatus] = useState("idle");

  // A state variable to update the number of followers in profile in
  // frontend only since the backend takes sometimes to update the
  //frontend,
  // this state variable is just for user interaction to see update in frontend
  // the backend already knows if its' asked to follow or unfollow
  const [numOfFollowers, setNumOfFollowers] = useState(undefined);

  // When the profile component is mounted , fetch the profile data of the
  // user with the provided _id in useParams();
  useEffect(() => {
    setProfileDataStatus("loading");
    fetch(`/users/${_id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data.user);
        setProfileDataStatus(data.user.followers.length);
      });
  }, [_id]);

  if (
    profileDataStatus === "loading" ||
    profileData == null ||
    profileData === undefined ||
    Object.keys(profileData).length === 0 // add this check
  ) {
    return (
      <CircleWrapper>
        <CircularProgress style={{ color: "#EE6C4D" }} />
      </CircleWrapper>
    );
  }

  return (
    <Wrapper>
      <Banner>
        {currentUser._id !== profileData._id && (
          <ReturnBar>
            <ReturnButton onClick={() => navigate()}>
              <FiChevronLeft size={30} />
            </ReturnButton>
          </ReturnBar>
        )}
      </Banner>
      <UserInfoContainer>
        <ProfileImgSquared
          style={{
            backgroundImage: `url(${
              profileData.imgSrc !== "" ? profileData.imgSrc : noImg
            })`,
          }}
        ></ProfileImgSquared>
        <SubContainer>
          <DisplayName>
            <span>{profileData.displayName}</span>
            <div>
              Joined on {moment(profileData.joined).format("MMM Do, YYYY")}
            </div>
          </DisplayName>
          {currentUser._id !== profileData._id && (
            <FollowButton
              currentUser={currentUser}
              targetedUser={profileData}
              numOfFollowers={numOfFollowers}
              setNumOfFollowers={setNumOfFollowers}
            />
          )}
          {currentUser._id === profileData._id && <LogoutButton />}
        </SubContainer>
        <Bio>{profileData.bio}</Bio>
        <AccountStats>
          <Stat>
            {profileData.postedActivities.length}
            <span>posts</span>
          </Stat>
          <Stat>
            {numOfFollowers}
            <span>followers</span>
          </Stat>
          <Stat>
            {profileData.following.length}
            <span>following</span>
          </Stat>
        </AccountStats>
      </UserInfoContainer>
      <Posts profileData={profileData} />
    </Wrapper>
  );
};

const CircleWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
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
  animation: ${slideIn} 0.4s ease-out both;
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 30%;
  background: #293241;
  padding-bottom: 10px;
`;

const Banner = styled.div`
  width: 100%;
  height: 20%;
  background-image: url(${BannerBackground});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

// This has an issue when image is not squared
// const ProfileImg = styled.img`
// position: absolute;
// width: 150px;
// height: 150px;
// border-radius: 50%;
// background-color: grey;
// border: 5px solid #293241;
// top: 28px;
// left: 13px;
// `
// This fixes the issue when the image is not squared
const ProfileImgSquared = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: grey;
  border: 5px solid #293241;
  top: 28px;
  left: 13px;

  @media (max-height: 736px) {
    height: 15vh;
    width: 15vh;
  }
`;
const SubContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const DisplayName = styled.div`
  margin: 10px;
  font-size: large;
  div {
    padding: 2px 0px;
    font-size: 0.8em;
    color: grey;
  }

  @media (max-height: 736px) {
    font-size: 0.75em;
  }
`;

const Bio = styled.div`
  margin: 10px;
  font-size: 0.9em;

  @media (max-height: 736px) {
    font-size: 0.75em;
  }
`;

const AccountStats = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-height: 736px) {
    font-size: 0.75em;
  }
`;

const Stat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ReturnBar = styled.div`
  padding: 5px 5px;
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
export default Profile;
