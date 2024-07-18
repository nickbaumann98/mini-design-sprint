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

const Thursday = ({ onComplete, updateSidebar }) => {
  const [prototypePlan, setPrototypePlan] = useState('');
  const [prototypeDescription, setPrototypeDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState(1);
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [prototypePlan, prototypeDescription]);

  const handleSubmit = () => {
    if (step === 1) {
      setFeedback(`Great prototype plan! Now let's describe the actual prototype.`);
      updateSidebar('Prototype Plan', prototypePlan);
      setStep(2);
    } else {
      setFeedback(`Excellent prototype description! You're ready to move on to Friday's tasks.`);
      updateSidebar('Prototype Description', prototypeDescription);
      setTimeout(() => {
        onComplete({ prototypePlan, prototypeDescription });
      }, 2000);
    }
  };

  return (
    <Container>
      <Header>Thursday: Prototype</Header>
      {step === 1 ? (
        <>
          <Question>Describe your plan for building the prototype</Question>
          <TextArea 
            ref={textAreaRef}
            value={prototypePlan}
            onChange={(e) => setPrototypePlan(e.target.value)}
            placeholder="Outline the key features and user flow of your prototype..."
          />
        </>
      ) : (
        <>
          <Question>Describe your completed prototype</Question>
          <TextArea 
            ref={textAreaRef}
            value={prototypeDescription}
            onChange={(e) => setPrototypeDescription(e.target.value)}
            placeholder="Describe the final prototype, including its key features and how it addresses the long-term goal..."
          />
        </>
      )}
      <Button onClick={handleSubmit}>Submit</Button>
      {feedback && <FeedbackArea>{feedback}</FeedbackArea>}
    </Container>
  );
};

export default Thursday;