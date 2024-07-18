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

const Tuesday = ({ onComplete, updateSidebar }) => {
  const [crazyEights, setCrazyEights] = useState('');
  const [solutionSketch, setSolutionSketch] = useState('');
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState(1);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [crazyEights, solutionSketch]);

  const handleSubmit = () => {
    if (step === 1) {
      setFeedback(`Great job on the Crazy 8s! Now let's create a detailed solution sketch.`);
      updateSidebar('Crazy 8s Ideas', crazyEights);
      setStep(2);
    } else {
      setFeedback(`Excellent solution sketch! You're ready to move on to Wednesday's tasks.`);
      updateSidebar('Solution Sketch', solutionSketch);
      setTimeout(() => {
        onComplete({ crazyEights, solutionSketch });
      }, 2000);
    }
  };

  return (
    <Container>
      <Header>Tuesday: Sketch Solutions</Header>
      {step === 1 ? (
        <>
          <Question>Describe your eight rapid ideas (Crazy 8s)</Question>
          <TextArea 
            ref={textAreaRef}
            value={crazyEights}
            onChange={(e) => setCrazyEights(e.target.value)}
            placeholder="Briefly describe each of your eight ideas..."
          />
        </>
      ) : (
        <>
          <Question>Describe your detailed solution sketch</Question>
          <TextArea 
            ref={textAreaRef}
            value={solutionSketch}
            onChange={(e) => setSolutionSketch(e.target.value)}
            placeholder="Describe your three-panel storyboard solution..."
          />
        </>
      )}
      <Button onClick={handleSubmit}>Submit</Button>
      {feedback && <FeedbackArea>{feedback}</FeedbackArea>}
    </Container>
  );
};

export default Tuesday;