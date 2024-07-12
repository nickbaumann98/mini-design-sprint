import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 0 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  max-width: 600px;
  margin-bottom: 2rem;
`;

const StartButton = styled.button`
  background-color: #3c8ce7;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2a6cb0;
  }
`;

const HomePage = ({ onStartSprint }) => {
  return (
    <HomeContainer>
      <Title>AI-Powered Mini Design Sprint</Title>
      <Description>
        Experience a condensed version of Jake Knapp and John Zeratsky's Design Sprint methodology. 
        Complete a sprint in just 20 minutes with AI guidance!
      </Description>
      <StartButton onClick={onStartSprint}>Start Mini Sprint</StartButton>
    </HomeContainer>
  );
};

export default HomePage;