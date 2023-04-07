import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { HiOutlineMail } from "react-icons/hi";
import {
  FiMessageSquare,
  FiUser,
  FiMapPin,
  FiImage,
  FiCalendar,
  FiKey,
} from "react-icons/fi";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import { useNavigate } from "react-router-dom";
import LoadingCircule from "../loading-components/loadingCircle";
import { addLogginSession } from "../helpers/uploadImgtoCloudinary";
import SportsBackground from "../assets/wave-haikei.svg";

// This is the signup page, its contains the signup form

const SignupPage = () => {
  const navigate = useNavigate();

  // Set initial values for the form
  const initialUserInfo = {
    displayName: "",
    imgSrc: "",
    bio: "",
    email: "",
    DOB: "",
    gender: "",
    location: "",
    password: "",
    confirmPassword: "",
  };

  // Update current user info when a user sign up, its will make sure that the user gets logged in after signup in
  const { setCurrentUser, setIsUserLoggedIn } = useContext(CurrentUserContext);

  const IconSize = 35;

  // A user ref to display a placeholder when the date input is on blur
  const ref = useRef();

  // State variable for user information in the form
  const [newUserInfo, setNewUserInfo] = useState(initialUserInfo);
  // State variable for the loading button after submission
  const [fetchStatus, setFetchStatus] = useState("idle");
  // Setting the error received from backend endpoint
  const [errorStatus, setErrorStatus] = useState({
    status: "idle",
    error: "no error",
  });

  // Function to handle the change in all form inputs
  const handleInputChange = (name, value) => {
    setNewUserInfo({ ...newUserInfo, [name]: value });
    setErrorStatus({ status: "idle", error: "no error" });
  };

  // handle the form submission by sending the mew form data to /users/add endpoint
  // The endpoint handles the new user info, and returns an error if there is any error
  // while filling up the form
  const handleSubmit = (ev) => {
    setFetchStatus("loading");
    ev.preventDefault();
    fetch("/users/add", {
      method: "POST",
      body: JSON.stringify(newUserInfo),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { data, status, message } = json;
        if (status === 200) {
          setCurrentUser(data);
          setIsUserLoggedIn(true);
          addLogginSession(data);
          console.log(data);
          history.push(`/profile/${data._id}`);
        } else {
          setErrorStatus({ status: "error", error: message });
        }
        setFetchStatus("idle");
      });
  };

  return (
    <Wrapper>
      <h2>Create an account</h2>
      <BackgroundImg src={SportsBackground} />
      <Form
        onSubmit={(ev) => {
          handleSubmit(ev);
        }}
      >
        <InputContainer>
          <HiOutlineMail size={IconSize} />
          <Input
            placeholder="Email Address"
            type="email"
            onChange={(ev) => {
              handleInputChange("email", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <FiKey size={IconSize} />
          <Input
            placeholder="Password"
            type="password"
            onChange={(ev) => {
              handleInputChange("password", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <Input
            placeholder="Confirm Password"
            type="password"
            onChange={(ev) => {
              handleInputChange("confirmPassword", ev.target.value);
            }}
            style={{ marginLeft: "40px" }}
          />
        </InputContainer>
        <InputContainer>
          <FiUser size={IconSize} />
          <Input
            placeholder="Full Name"
            type="text"
            onChange={(ev) => {
              handleInputChange("displayName", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <FiCalendar size={IconSize} />
          <Input
            placeholder="Date of birth"
            type="text"
            ref={ref}
            onFocus={() => (ref.current.type = "date")}
            onBlur={() => (ref.current.type = "text")}
            onChange={(ev) => {
              handleInputChange("DOB", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainer style={{ height: "120px" }}>
          <FiMessageSquare size={IconSize} />
          <Textfield
            placeholder="Tell us a little about about yourself"
            type="text"
            onChange={(ev) => {
              handleInputChange("bio", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainerImage>
          <FiImage size={IconSize} />
          <InputImg
            type="file"
            accept="image/*"
            onChange={(ev) => {
              uploadImageToCloudinary(ev.target.files[0], handleInputChange);
            }}
          />
        </InputContainerImage>

        <InputContainer>
          <FiMapPin size={IconSize} />
          <Input
            placeholder="City"
            type="text"
            onChange={(ev) => {
              handleInputChange("location", ev.target.value);
            }}
          />
        </InputContainer>
        {errorStatus.status === "error" && (
          <Error>* {errorStatus.error} *</Error>
        )}
        <ButtonContainer>
          <SignUpButton type="submit">
            {fetchStatus === "loading" ? <LoadingCircule /> : "Sign Up"}
          </SignUpButton>
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
`;

const BackgroundImg = styled.img`
  position: absolute;
  height: 100%;
  top: 0;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: space-between;
  padding: 0px 5px;
`;
const InputContainerImage = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: center;
  padding: 0px 5px;
`;

const InputImg = styled.input`
  margin-left: 10px;
  color: grey;
  padding: 20px 0px;
  font-size: 1.1em;

  &::-webkit-file-upload-button {
    visibility: hidden;
    width: 0px;
  }

  &::before {
    content: "Choose Profile Img";
    color: white;
    background: #3d5a80;
    border: 2px solid white;
    cursor: pointer;
    border-radius: 5px;
    padding: 5px 10px;
    font-family: "Roboto Slab", serif;
  }
`;

const Input = styled.input`
  width: 100%;
  margin: 0px 10px;
  font-size: 1.3em;
  outline: none;
  border: none;
  border-bottom: 1px solid grey;
  color: white;
  background-image: none;
  background-color: transparent;
  box-shadow: none;

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

const Textfield = styled.textarea`
  padding: 5px;
  width: 100%;
  height: 100%;
  font-size: 1.3em;
  box-sizing: border-box;
  border: none;
  color: white;
  border-bottom: 1px solid grey;
  background-color: transparent;
  box-shadow: none;
  resize: none;
  margin: 0px 10px;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
`;

const SignUpButton = styled.button`
  background: #ee6c4d;
  font-size: 1.3em;
  font-weight: bold;
  margin: 8px 20px;
  margin-bottom: 20px;
  height: 50px;
  color: white;
  border: 2px solid white;
  padding: 0;
  cursor: pointer;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const Error = styled.div`
  margin-top: 30px;
  color: red;
  font-size: 1em;
  text-align: center;
`;

export default SignupPage;
