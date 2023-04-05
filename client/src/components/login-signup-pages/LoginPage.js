import React, { useState, useContext } from "react";
import styled from "styled-components";
import { hitOutlineMail, HiOutlineKey } from "react-icons/fi";
import {
  FiAtSign,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import LoadingCircle from "../loading-components/loadingCircle";
import { addLoginSession } from "../helpers/express-session-helpers";
import SportsBackground from "../assets/wave-haikei.svg";

// This is the login page. Its will asks for the user email and password.
//it will calls updateCurrentUser function from CurrentUserContext,
// updateCurrentUser handlers singing in and returns response if signing in fails

const LoginPage = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [errorStatus, setErrorStatus] = useState({
    status: "idle",
    error: "no error",
  });
  const [fetchStatus, setFetchStatus] = useState("idle");

  const navigate = useNavigate();
  const iconSize = 35;
  const { setCurrentUser, setIsUserLoggedIN } = useContext(CurrentUserContext);

  const handleEmailInput = (value) => {
    setUserEmail(value);
    setErrorStatus({ status: "idle", error: "no error" });
  };

  const handlePasswordInput = (value) => {
    setUserPassword(value);
    setErrorStatus({ status: "idle", error: "no error" });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setFetchStatus("loading");

    fetch(`/loggedin?email=${userEmail}&password=${userPassword}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setCurrentUser(data.result);
          setIsUserLoggedIN(true);
          addLoginSession(data.result);
          navigate(`/profile/${data.result.id}`);
        } else {
          setErrorStatus({ status: "error", error: data.message });
        }
        setFetchStatus("idle");
      });
  };
  return (
    <Wrapper>
      <h1>Welcome Back !</h1>
      <BackgroundImg src={SportsBackground} />
      <Form onSubmit={(ev) => handleSubmit(ev)}>
        <InputContainer>
          <FiAtSign size={iconSize} />
          <Input
            placeholder="Email Address"
            type="email"
            onChange={(ev) => {
              handleEmailInput(ev.target.value);
            }}
          />
          <EyeIcon>
            <FiEye size={30} color={"transparent"} />
          </EyeIcon>
        </InputContainer>
        <InputContainer>
          <FiLock size={iconSize} />
          <Input
            placeholder="Password"
            type={isPasswordShown ? "text" : "password"}
            onChange={(ev) => {
              handlePasswordInput(ev.target.value);
            }}
          />
          <EyeIcon onClick={() => setIsPasswordShown(!isPasswordShown)}>
            {isPasswordShown ? <FiEye size={30} /> : <FiEyeOff size={30} />}
          </EyeIcon>
        </InputContainer>
        <Error>
          {errorStatus.status === "err" ? `* ${errorStatus.error} *` : ""}
        </Error>
        <ButtonContainer>
          <LoginButton>
            {fetchStatus === "loading" ? <LoadingCircle /> : "Log In"}
          </LoginButton>
        </ButtonContainer>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #293241;
  background: -webkit-linear-gradient(to bottom, #141e30, #243b55);
  background: linear-gradient(to bottom, #141e30, #243b55);
  align-items: center;
  font-weight: 400;
  color: white;
  overflow: hidden;
`;

const Form = styled.form`
  position: relative;
  width: 100%;
  height: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
`;

const BackgroundImg = styled.img`
  position: absolute;
  height: 100%;
  top: 0;
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
`;

const InputContainer = styled.div`
  display: flex;
  width: 90%;
  margin-top: 20px;
  justify-content: space-between;
  padding: 0px 5px;
  border-bottom: 1px solid grey;
`;

const Input = styled.input`
  width: 100%;
  margin: 0px 10px;
  font-size: 1.3em;
  outline: none;
  border: none;
  /* border-bottom: 1px solid grey; */
  color: white;
  background-image: none;
  background-color: transparent;
  box-shadow: none;
`;

const EyeIcon = styled.div`
  float: right;
  display: flex;
  align-items: center;
  margin: 0px 5px;
`;

const Error = styled.div`
  padding: 0px 5px;
  height: 30px;
  margin: 15px 0px;
  color: red;
  font-size: 1.1em;
  text-align: center;
`;
export default LoginPage;
