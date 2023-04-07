import React from "react";
import styled from "styled-components";
import SingleActivity from "../activity-components/SingleActivity";
import CircularProgress from "@mui/material/CircularProgress";

// This component renders the home feed. It displayed all posts with
// the chosen filter

const Search = ({ postsData, postDataStatus }) => {
  if (postDataStatus === "loading") {
    return (
      <CircleWrapper>
        <CircularProgress style={{ color: "#EE6C4D" }} />
      </CircleWrapper>
    );
  }

  if (postsData.length === 0) {
    return (
      <CircleWrapper>
        <span>There are no activities with the provided specifications </span>
      </CircleWrapper>
    );
  }

  return (
    <Wrapper>
      {postsData.map((post) => {
        return <SingleActivity key={post._id} post={post} />;
      })}
      <br />
      <br />
      <br />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  overflow: auto;
  height: calc(100% - 50px - 40px);
  z-index: -100;
`;

const CircleWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;

  span {
    text-align: center;
  }
`;

export default Search;
