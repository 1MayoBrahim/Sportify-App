import React, { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import { sports, levels } from "./FormConstants";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AddressSearchBox from "./AddressSearchBox";
import LoadingCircule from "../loading-components/loadingCircle";

const ActivityForm = () => {
  // Get the current user info from the currentUserContext
  const { currentUser } = useContext(CurrentUserContext);

  // An alert for the form status after a submission
  const Alert = React.forwardRef(
    (Alert = (props, ref) => {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    })
  );

  // Initial values for the activity post form
  const initialFormValues = {
    limit: "",
    activityDate: {
      date: "",
      from: "",
      to: "",
    },
    activityAddress: {
      street: "",
      city: "",
      province: "",
    },
    activityType: "Select",
    description: "",
    level: "All",
    creator_id: currentUser._id,
  };

  // Set a state variable for post form data
  const [postForm, setPostForm] = useState(initialFormValues);

  // State variables to monitor the form submission and form errors
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [formError, setFormError] = useState({
    status: false,
    message: "no error",
  });

  // Function that handles the snackbar alert
  const handleCloseBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsFormSubmitted(false);
    setFormError({ status: false, message: "no error" });
  };

  // A function that handles the change in the activityDate and updates the state variable 'postForm'
  const handleDateChange = (name, value) => {
    setPostForm({
      ...postForm,
      activityDate: { ...postForm.activityDate, [name]: value },
    });
    handleCloseBar();
  };

  // All other changes in the form's inputs are handled in this function
  const handleOtherChanges = (name, value) => {
    setPostForm({ ...postForm, [name]: value });
    handleCloseBar();
  };

  // handle resetting the form
  const handleFormRest = () => {
    setPostForm(initialFormValues);
  };
  // The function handles the submission of the form by calling the endpoint handler in charge of adding a new post
  const handleSubmit = (ev) => {
    setFormStatus("loading");
    ev.preventDefault();
    fetch("/posts/add", {
      method: "POST",
      body: JSON.stringify({ ...postForm }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        const { status, message } = json;
        if (status === 200) {
          setFormError({ status: false, message: "no error" });
          setPostForm(initialFormValues);
          setIsFormSubmitted(true);
          setFormStatus("idle");
        } else {
          setFormError({ status: true, message: message });
          setFormStatus("idle");
        }
      });
  };

  return (
    <Wrapper>
      <h2>Post a new activity</h2>
      <Form onSubmit={(ev) => handleSubmit(ev)}>
        <Container>
          <Title>{"Activity Date & Time"}</Title>
          <DateContainer>
            <span>Date: </span>
            <Input
              type="date"
              value={postForm.activityDate.date}
              onChange={(ev) => handleDateChange("date", ev.target.value)}
            />
          </DateContainer>
          <TimeContainer>
            <span>From: </span>
            <Input
              type="time"
              value={postForm.activityDate.from}
              onChange={(ev) => handleDateChange("from", ev.target.value)}
            />
            <span>To: </span>
            <Input
              type="time"
              value={postForm.activityDate.to}
              onChange={(ev) => handleDateChange("to", ev.target.value)}
            />
          </TimeContainer>
        </Container>

        <Container>
          <Title>Sport Type</Title>
          <TypeContainer>
            <SubContainer>
              <SubSubContainer>
                <span>Sport: </span>
                <SelectContainer>
                  <Select
                    name="sports"
                    value={postForm.activityType}
                    onChange={(ev) =>
                      handleOtherChanges("activityType", ev.target.value)
                    }
                  >
                    {sports.map((sport) => {
                      return (
                        <Option key={sport} value={sport}>
                          {sport}
                        </Option>
                      );
                    })}
                  </Select>
                </SelectContainer>
              </SubSubContainer>

              <SubSubContainer>
                <span>Level: </span>
                <SelectContainer>
                  <Select
                    name="levels"
                    value={postForm.level}
                    onChange={(ev) =>
                      handleOtherChanges("level", ev.target.value)
                    }
                  >
                    {levels.map((level) => {
                      return (
                        <Option key={level} value={level}>
                          {level}
                        </Option>
                      );
                    })}
                  </Select>
                </SelectContainer>
              </SubSubContainer>
            </SubContainer>
            <DateContainer>
              <span>Limit: </span>
              <LimitInput
                type="number"
                value={postForm.limit}
                onChange={(ev) => handleOtherChanges("limit", ev.target.value)}
              />
            </DateContainer>
          </TypeContainer>
        </Container>

        <Container>
          <Title>{"Activity Address"}</Title>
          <br />
          <AddressSearchBox postForm={postForm} setPostForm={setPostForm} />
        </Container>
        <Container>
          <Title>{"Description & Instructions"}</Title>
          <DateContainer>
            <Textfield
              placeholder="Anything participants need to know before joining ?"
              type="text"
              onChange={(ev) =>
                handleOtherChanges("description", ev.target.value)
              }
            />
          </DateContainer>
        </Container>

        <ButtonContainer>
          <SubmitButton type="submit">
            {formStatus === "loading" ? <LoadingCircule /> : "Post"}
          </SubmitButton>
          <RestButton type="reset" onClick={() => handleFormRest()}>
            Clear
          </RestButton>
        </ButtonContainer>
      </Form>
      <Snackbar
        open={isFormSubmitted}
        autoHideDuration={6000}
        onClose={handleCloseBar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseBar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Your activity has been created successfully !
        </Alert>
      </Snackbar>
      <Snackbar
        open={formError.status}
        autoHideDuration={6000}
        onClose={handleCloseBar}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Alert onClose={handleCloseBar} severity="error" sx={{ width: "100%" }}>
          {formError.message}
        </Alert>
      </Snackbar>
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
  overflow: auto;
  animation: ${PuffInCenter} 0.4s both;
`;

const Form = styled.form`
  position: relative;
  width: 100%;
  height: 100%;
  margin-top: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* border: 1px solid red; */
  padding: 10px 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  /* border: 1px solid red; */
  padding: 10px 15px;
`;

const Title = styled.h2`
  font-size: 1.4em;
  padding-bottom: 6px;
  color: #ee6c4d;
  border-bottom: 2px solid #e0fbfc;
`;

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 7px 0px;
  font-size: 1.2em;
  width: 100%;
`;

const TimeContainer = styled.div`
  display: flex;
  margin: 7px 0px;
  align-items: center;
  font-size: 1.2em;

  @media (max-width: 400px) {
    flex-direction: column;
    align-items: baseline;
  }
`;

const TypeContainer = styled.div``;

const SubContainer = styled.div`
  display: flex;
  margin: 7px 0px;
  /* align-items: center; */
  font-size: 1.2em;
  /* justify-content: space-between; */

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

const SubSubContainer = styled.div`
  /* flex:1; */
  display: flex;
  /* justify-content: center; */
  align-items: center;
`;

const Input = styled.input`
  margin: 0px 10px;
  padding: 5px 10px;
  border-radius: 5px;
  outline: none;
  border: none;
  border-bottom: 1px solid grey;
  color: white;
  background-image: none;
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
  font-size: 0.9em;

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

const LimitInput = styled(Input)`
  width: 40px;
`;

const Select = styled.select`
  width: 130px;
  -moz-appearance: none;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 0.9em;
  color: white;
  &:focus {
    color: white;
  }

  &::-ms-expand {
    display: none;
  }
`;

const Option = styled.option`
  background: rgba(255, 255, 255, 0.1);
  color: black;
`;

const SelectContainer = styled.div`
  position: relative;
  width: 130px;
  margin: 5px;
  // Dropdown icon
  &::after {
    color: white;
    content: "▾";
    margin-right: 10px;
    pointer-events: none;
    position: absolute;
    right: -5px;
    top: 5px;
    font-size: 20px;
  }
`;

const Textfield = styled.textarea`
  padding: 5px;
  width: 100%;
  height: 100%;
  font-size: 1em;
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

const SubmitButton = styled.button`
  flex: 1;
  font-size: 1.3em;
  font-weight: bold;
  margin: 8px 20px;
  height: 50px;
  border: 2px solid white;
  padding: 0;
  cursor: pointer;
  border-radius: 5px;
  background: #ee6c4d;
  color: white;
`;

const RestButton = styled(SubmitButton)`
  background: #3d5a80;
  color: white;
`;

export default ActivityForm;
