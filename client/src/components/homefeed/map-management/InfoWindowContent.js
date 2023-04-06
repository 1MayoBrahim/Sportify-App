import React from "react";
import styled from "styled-components";
import SingleActivityInfoWindow from "../../activity-components/ActivityInfoWindow";
const InfoWindowContent = ({ selected }) => {
  return (
    <Wrapper>
      <SingleActivityInfoWindow post={selected} />
    </Wrapper>
  );
};

const Wrapper = styled.div``;

export default InfoWindowContent;
