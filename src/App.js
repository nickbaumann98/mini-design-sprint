import React, { useState } from 'react';
import styled from 'styled-components';
import HomePage from './components/HomePage';
import DaySprint from './components/DaySprint';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #ffffff;
`;

const App = () => {
  const [currentDay, setCurrentDay] = useState(0);
  const [sprintOutput, setSprintOutput] = useState({});

  const startSprint = () => {
    setCurrentDay(1);
  };

  const nextDay = () => {
    if (currentDay < 5) {
      setCurrentDay(currentDay + 1);
    }
  };

  const updateOutput = (day, output) => {
    setSprintOutput(prev => ({ ...prev, [day]: output }));
  };

  return (
    <AppContainer>
      {currentDay === 0 ? (
        <HomePage onStartSprint={startSprint} />
      ) : (
        <DaySprint 
          day={currentDay} 
          onNextDay={nextDay} 
          onUpdateOutput={updateOutput}
          sprintOutput={sprintOutput}
        />
      )}
    </AppContainer>
  );
};

export default App;