import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SportsBackground from "../assets/wave-haikei.svg";
import bgImg from "../assets/bgImg.png";

// This is page to give users options  for the sign in or log in page
const LoginSignupPage = () => {
  let navigate = useNavigate();

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Wrapper>
      <BackgroundImg src={SportsBackground} />
      <ButtonContainer>
        <Logo>
          <span>SPORTIFY</span>
          <span>APP</span>
          Get Together with One Click
        </Logo>
        <Quotes>
          <p>
            “Unleash Your Inner Athlete with Sportify - The Ultimate Social
            Platform for Sports!.”
          </p>
          <span>-AI</span>
        </Quotes>
        <LoginButton
          onClick={() => {
            handleLogin();
          }}
        >
          Log In
        </LoginButton>

        <HorizontalLineContainer>
          <hr style={{ marginRight: "5px", width: "145px" }} />
          or
          <hr style={{ marginLeft: "5px", width: "145px" }} />
        </HorizontalLineContainer>
        <SignInButton
          onClick={() => {
            handleSignup();
          }}
        >
          Sign Up
        </SignInButton>
      </ButtonContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 824px;
  height: 734px;
  background: #293241;
  background: -webkit-linear-gradient(to bottom, #141e30, #243b55);
  background: linear-gradient(to bottom, #141e30, #243b55);
  align-items: center;
  font-weight: 400;
  padding: 10px;
  color: white;
  overflow: hidden;
`;

const BackgroundImg = styled.img`
  position: absolute;
  height: 100%;
  top: 0;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 350px;
  height: 350px;
  font-size: 1em;
  color: grey;

  span {
    font-size: 4em;
    margin-bottom: 2px;
    font-family: "Bebas Neue", cursive;
    color: #ee6c4d;
  }
`;

const Quotes = styled.div`
  margin: 20px;
  font-size: 1.2em;
  span {
    margin-top: 5px;
    font-size: 0.8em;
    float: right;
    font-style: italic;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const LoginButton = styled.button`
  font-size: 1.3em;
  font-weight: bold;
  margin: 8px 20px;
  height: 50px;
  background: #3d5a80;
  color: white;
  border: 2px solid white;
  padding: 0;
  cursor: pointer;
  border-radius: 5px;
  width: 90%;
`;

const SignInButton = styled(LoginButton)`
  background: #ee6c4d;
  color: white;
  margin-bottom: 20px;
`;

const HorizontalLineContainer = styled.div`
  display: flex;
  font-size: 1.1em;
`;

export default LoginSignupPage;
