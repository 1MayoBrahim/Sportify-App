import React, { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import { FiLogOut } from "react-icons/fi";
import { deleteLoginSession } from "../helpers/express-session-helpers";

// A log out button in the current use profile. it will calls the endpoint
// that clears all currentUser data info in the database collection
// "currentUserContext"

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setIsUserLoggedIn, setCurrentUser } = useContext(CurrentUserContext);

  const handleLogout = () => {
    deleteLoginSession();
    setIsUserLoggedIn(false);
    setCurrentUser(null);
    navigate("/");
  };
  return (
    <Button onClick={() => handleLogout()}>
      <span>FiLogOut</span> <FiLogOut />
    </Button>
  );
};

const Button = styled.div`
  padding: 5px 20px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ee6c4d;
  color: white;
  border: 2px solid white;
  border-radius: 6px;
  cursor: pointer;
  span {
    margin-right: 4px;
  }
  @media (max-height: 736px) {
    font-size: 0.75em;
  }
`;

export default LogoutButton;
