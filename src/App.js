import React, { useState } from 'react';
import styled from 'styled-components';
import HomePage from './components/HomePage';
import DaySprint from './components/DaySprint';
import './styles/DarkMode.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #121212;
  color: #e0e0e0;
`;

const App = () => {
  const [isSprintStarted, setIsSprintStarted] = useState(false);

  const startSprint = () => {
    setIsSprintStarted(true);
  };

  return (
    <AppContainer>
      {!isSprintStarted ? (
        <HomePage onStartSprint={startSprint} />
      ) : (
        <DaySprint />
      )}
    </AppContainer>
  );
};

export default App;