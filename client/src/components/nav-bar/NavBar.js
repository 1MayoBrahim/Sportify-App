import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../all-contexts/currentUserContext";
import {
  FiBell,
  FiUser,
  FiMessageCircle,
  FiHome,
  FiPlusCircle,
} from "react-icons/fi";

// This NavBar is the main app. It navigate between profile, chat, posting an activity, notification and home feed.

const NavBar = () => {
  const [active, setActive] = useState(1);
  const { currentUser } = useContext(CurrentUserContext);
  const Navigate = useNavigate();

  // From th navbar you can navigate to the proper page

  const handleClick = (tabId, path) => {
    console.log("click");
    setActive(tabId);
    Navigate(`/${path}`);
  };

  const iconSize = 37;
  return (
    <Wrapper>
      <Button
        active={active === 1}
        onClick={() => handleClick(1, `profile/${currentUser._id}`)}
      >
        <FiUser size={iconSize} color={"EE6C4D"} />
      </Button>
      <Button
        active={active === 2}
        onClick={() => handleClick(2, "group-chats")}
      >
        <FiMessageCircle size={iconSize} color={"EE6C4D"} />
      </Button>
      <Button
        active={active === 3}
        onClick={() => handleClick(3, "create-activity")}
      >
        <FiPlusCircle size={iconSize} color={"EE6C4D"} />
      </Button>
      <Button
        active={active === 4}
        onClick={() => handleClick(4, "notifications")}
      >
        <FiBell size={iconSize} color={"EE6C4D"} />
      </Button>
      <Button active={active === 5} onClick={() => handleClick(5, "home")}>
        <FiHome size={iconSize} color={"EE6C4D"} />
      </Button>
    </Wrapper>
  );
};

const Button = styled.button`
  padding: 10px;
  background-color: #3c4552;
  border-bottom: 7px solid rgba(255, 255, 255, 0.1);
  width: 25%;
  cursor: pointer;
  z-index: 10;
  ${({ active }) => active && ` border-bottom: 7px solid #EE6C4D; `};
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row-reverse;
  background-color: #3c4552;
  height: 60px;
  z-index: 5;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

export default NavBar;
