import React, { useContext } from "react";
import GlobalStyles from "./components/GlobalStyles";
import LoginSignupPage from "./components/login-signup-pages/LoginSignupPage";
import LoginPage from "./components/login-signup-pages/LoginPage";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import SignupPage from "./components/login-signup-pages/SignupPage";
import styled from "styled-components";
import ChatLists from "./components/chat-page/AllJoinedChatsLists";
import { CurrentUserContext } from "./components/all-contexts/currentUserContext";
import NavBar from "./components/nav-bar/NavBar";
import Profile from "./components/profile-page/Profile";
import Home from "./components/homefeed/Home";
import ActivityForm from "./components/create-activity-page/ActivityForm";
import ActivityDetails from "./components/activity-components/ActivityDetails";
import ChatSys from "./components/chat-page/ChatSys";
import Notifications from "./components/notifications-page/Notifications";

function App() {
  const { isUserLoggedIn, currentUser } = useContext(CurrentUserContext);
  console.log(currentUser);
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Wrapper>
        <Container>
          <Routes>
            <Route
              path="/"
              element={
                isUserLoggedIn ? (
                  <navigate to={`/profile/${currentUser._id}`} />
                ) : (
                  <LoginSignupPage />
                )
              }
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            {isUserLoggedIn && (
              <>
                <Route path="/profile/:_id" element={<Profile />} />
                <Route path="/group-chats" element={<ChatLists />} />
                <Route path="/chats/:_id" element={<ChatSys />} />
                <Route path="/create-activity" element={<ActivityForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/activity/:_id" element={<ActivityDetails />} />
                <Route path="/notifications" element={<Notifications />} />
              </>
            )}
          </Routes>
          {isUserLoggedIn && <NavBar />}
        </Container>
      </Wrapper>
    </BrowserRouter>
  );
}

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c2c2c;
`;

const Container = styled.div`
  width: 414px;
  height: 736px;

  @media (max-width: 414px) {
    width: 100%;
  }

  @media (max-height: 736px) {
    height: 100%;
  }
`;

const MainAppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SubContainer = styled.div`
  height: calc(100% - 60px);
  background: #293241;
  background: -webkit-linear-gradient(to bottom, #141e30, #243b55);
  background: linear-gradient(to bottom, #141e30, #243b55);
  color: white;
  overflow: hidden;
`;
export default App;
