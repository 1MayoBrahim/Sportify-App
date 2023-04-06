import React, { useState } from "react";
import styled from "styled-components";

// A simple toggle bar for the profile page

const ToggleBar = ({ setDisplayedPage }) => {
  // State variable to control what option is underlined or highlighted
  const [active, setActive] = useState(1);

  const handleClick = (page) => {
    setActive(page);
    setDisplayedPage(page);
  };

  return (
    <Wrapper>
      <Button active={active === 2} onClick={() => handleClick(2)}>
        Joined Activities
      </Button>
      <Button active={active === 1} onClick={() => handleClick(1)}>
        Posted Activities
      </Button>
    </Wrapper>
  );
};

const Button = styled.button`
  background-color: #3c4552;
  border-bottom: 7px solid #3c4552;
  width: 50%;
  color: #ee6c4d;
  font-size: 1.02em;
  cursor: pointer;

  ${({ active }) => active && ` border-bottom: 7px solid #EE6C4D; `}
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row-reverse;
  background-color: #3c4552;
  height: 35px;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
`;

export default ToggleBar;
