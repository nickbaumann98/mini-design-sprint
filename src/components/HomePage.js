import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #121212;
  color: #e0e0e0;
  animation: ${fadeIn} 1s ease-out;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #3c8ce7;
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #ffffff;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.2rem;
  max-width: 800px;
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.6;
`;

const SprintStages = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const Stage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.9rem;
  text-align: center;
  width: 18%;
`;

const StageIcon = styled.div`
  background-color: #3c8ce7;
  color: #ffffff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const BetaBadge = styled.span`
  background-color: #3c8ce7;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  vertical-align: super;
`;

const StartButton = styled.button`
  background-color: #3c8ce7;
  color: #ffffff;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(60, 140, 231, 0.2);

  &:hover {
    background-color: #2a6cb0;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(60, 140, 231, 0.3);
  }
`;

const HomePage = ({ onStartSprint }) => {
    return (
        <HomeContainer>
            <Title>Mini Design Sprint <BetaBadge>Beta</BetaBadge></Title>
            <Subtitle>Innovate in 20 Minutes</Subtitle>
            <SprintStages>
                <Stage>
                    <StageIcon>1</StageIcon>
                    <span>Define Goals</span>
                </Stage>
                <Stage>
                    <StageIcon>2</StageIcon>
                    <span>Brainstorm</span>
                </Stage>
                <Stage>
                    <StageIcon>3</StageIcon>
                    <span>Solution Sketch</span>
                </Stage>
                <Stage>
                    <StageIcon>4</StageIcon>
                    <span>Prototype</span>
                </Stage>
                <Stage>
                    <StageIcon>5</StageIcon>
                    <span>Test</span>
                </Stage>
            </SprintStages>
            <Description>
                Experience a condensed version of Jake Knapp and John Zeratsky's Design Sprint methodology.
                In just 20 minutes, you'll define goals, sketch solutions, decide on the best approach, prototype, and plan user testing.
                Our AI guide, Relay, will assist you through each step, providing insights and keeping you on track.
            </Description>
            <Description>
                Perfect for quick ideation, team alignment, or getting a taste of the full Design Sprint process.
                Use this tool to rapidly prototype ideas, solve complex problems, or kickstart your innovation process.
                No prior experience necessary - just bring your creativity and an open mind!
            </Description>
            <Description>
                Powered by GPT-4o
            </Description>
            <StartButton onClick={onStartSprint}>Start Mini Sprint</StartButton>
        </HomeContainer>
    );
};

export default HomePage;