import React, { useState } from 'react';
import styled from 'styled-components';
import AIChat from './AIChat';
import OutputSidebar from './OutputSidebar';

const SprintContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const DayTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const NextButton = styled.button`
  background-color: #3c8ce7;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 1rem;
`;

const DaySprint = ({ day, onNextDay }) => {
  const [sprintSummary, setSprintSummary] = useState({});

  const handleUpdateSummary = (day, summary) => {
    setSprintSummary(prev => ({ ...prev, [day]: summary }));
  };

  return (
    <SprintContainer>
      <MainContent>
        <DayTitle>{`Day ${day}: ${getDayTitle(day)}`}</DayTitle>
        <AIChat day={day} onUpdateSummary={handleUpdateSummary} />
        {day < 5 && <NextButton onClick={onNextDay}>Next Day</NextButton>}
      </MainContent>
      <OutputSidebar sprintSummary={sprintSummary} currentDay={day} />
    </SprintContainer>
  );
};

const getDayTitle = (day) => {
  const titles = {
    1: 'Define Long-Term Goal',
    2: 'Sketch Solutions',
    3: 'Decide on Best Solutions',
    4: 'Build Prototype',
    5: 'Test and Learn'
  };
  return titles[day] || '';
};

export default DaySprint;
