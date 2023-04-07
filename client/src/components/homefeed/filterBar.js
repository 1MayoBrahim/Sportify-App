import React from "react";
import styled from "styled-components";
import { sports, levels } from "../create-activity-page/FormConstants";

const FilterBar = ({ sportType, setSportType, sportLevel, setSportLevel }) => {
  //Replace the first element in sports const array with 'All' instead of 'Select for the first element
  const updateSports = sports;
  updateSports[0] = "All";

  return (
    <Wrapper>
      <Container>
        <SubContainer>
          <span>Sport: </span>
          <SelectContainer>
            <Select
              name="sports"
              value={sportType}
              onChange={(ev) => setSportType(ev.target.value)}
            >
              {updateSports.map((sport) => {
                return (
                  <Option key={sport} value={sport}>
                    {sport}
                  </Option>
                );
              })}
            </Select>
          </SelectContainer>
        </SubContainer>

        <SubContainer>
          <span>Level: </span>
          <SelectContainer>
            <Select
              name="levels"
              value={sportLevel}
              onChange={(ev) => setSportLevel(ev.target.value)}
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
        </SubContainer>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  margin: 3px 5px;
  align-items: center;
  font-size: 1.2em;
  justify-content: space-between;
`;

const SubContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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
  // Hack for IE 11+
  &::-ms-expand {
    display: none;
  }
`;

const Option = styled.option`
  background: rgba(255, 255, 255, 0.1);
  color: black;
`;

const SelectContainer = styled.div`
  display: flex;
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

export default FilterBar;
