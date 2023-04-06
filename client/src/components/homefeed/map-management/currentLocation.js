import React, { useContext } from "react";
import styled from "styled-components";
import { FiNavigation } from "react-icons/fi";
import { CurrentUserLocation } from "../../all-contexts/currentLocationContext";

const CurrentLocationButton = ({panTo}) => {

    const { currentLocation } = useContext(CurrentUserLocation);

    const handleClick = () => {
            panTo(currentLocation);
    }

    return(
        <Wrapper>
            <Button onClick = { ()=> handleClick() }>
                <FiNavigation size={30} style={{fill:'#EE6C4D', color:'#293241'}}/>
            </Button>
        </Wrapper>
    )
}

const Wrapper = styled.div`
  position: absolute;
  margin: 20px;
  z-index: 5;
  color: black;
  right: 0px;
  border-radius: 10px;
`;

const Button = styled.button`
margin:0px;
color: inherit;
background: none;
border: none;
text-align: center;
font: inherit;
cursor: pointer;
outline: inherit;
`;
export default CurrentLocationButton