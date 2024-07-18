import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #1e1e1e;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Futura', 'Avenir', 'Proxima Nova', 'Helvetica', sans-serif;
`;

const Header = styled.h1`
  color: #3c8ce7;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Question = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
`;

const TextArea = styled.textarea`
  width: 80%;
  padding: 15px;
  margin-bottom: 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  background-color: #f8f9fa;
  color: #1e1e1e;
  resize: none;
  overflow: hidden;
  min-height: 50px;
`;

const Button = styled.button`
  background-color: #3c8ce7;
  color: #ffffff;
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2a6cb0;
  }
`;

const FeedbackArea = styled.div`
  background-color: #f8f9fa;
  color: #1e1e1e;
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
  width: 80%;
`;

const Wednesday = ({ onComplete, updateSidebar }) => {
  const [heatMapVoting, setHeatMapVoting] = useState('');
  const [supervote, setSupervote] = useState('');
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState(1);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [heatMapVoting, supervote]);

  const handleSubmit = () => {
    if (step === 1) {
      setFeedback(`Great job on the Heat Map Voting! Now let's decide on the final solution.`);
      updateSidebar('Heat Map Voting Results', heatMapVoting);
      setStep(2);
    } else {
      setFeedback(`Excellent decision! You're ready to move on to Thursday's tasks.`);
      updateSidebar('Final Solution', supervote);
      setTimeout(() => {
        onComplete({ heatMapVoting, supervote });
      }, 2000);
    }
  };

  return (
    <Container>
      <Header>Wednesday: Decide</Header>
      {step === 1 ? (
        <>
          <Question>Describe the results of your Heat Map Voting</Question>
          <TextArea 
            ref={textAreaRef}
            value={heatMapVoting}
            onChange={(e) => setHeatMapVoting(e.target.value)}
            placeholder="Describe which parts of the solutions received the most votes..."
          />
        </>
      ) : (
        <>
          <Question>What is the final solution you've decided on?</Question>
          <TextArea 
            ref={textAreaRef}
            value={supervote}
            onChange={(e) => setSupervote(e.target.value)}
            placeholder="Describe the final solution chosen for prototyping..."
          />
        </>
      )}
      <Button onClick={handleSubmit}>Submit</Button>
      {feedback && <FeedbackArea>{feedback}</FeedbackArea>}
    </Container>
  );
};

export default Wednesday;