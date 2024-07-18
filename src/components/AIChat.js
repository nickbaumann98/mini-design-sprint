import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import SimpleMarkdown from 'simple-markdown';
import { getGPTResponse } from '../utils/gptService';
import { sprintGuidance, getSprintTip } from '../utils/sprintResources';
import { createSprintDay, states } from './sprintStateMachine';

// Styled components remain the same
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 1.5rem;
  font-family: 'Roboto', sans-serif;
  height: 60vh;
  overflow-y: auto;
`;

const Message = styled.div`
  background-color: ${props => props.isUser ? '#3c8ce7' : '#2a2a2a'};
  color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 80%;
`;

const RelayIcon = styled.span`
  color: #3c8ce7;
  margin-right: 0.5rem;
`;

const InputContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  align-items: flex-end;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #2a2a2a;
  color: #ffffff;
  resize: none;
  min-height: 40px;
  overflow-y: hidden;
`;

const SendButton = styled.button`
  background-color: #3c8ce7;
  color: #ffffff;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 0.5rem;
  height: 40px;
`;

const NextDayButton = styled.button`
  background-color: #3c8ce7;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 1rem;
`;

const parseMarkdown = (markdown) => {
  const rawBuiltParser = SimpleMarkdown.parserFor(SimpleMarkdown.defaultRules);
  const parser = (source) => {
    const blockSource = source + "\n\n";
    return rawBuiltParser(blockSource);
  };
  const reactOutput = SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(SimpleMarkdown.defaultRules, 'react'));
  return reactOutput(parser(markdown));
};

const AIChat = ({ day, onUpdateDeliverable, onNextDay }) => {
  const sprintDay = createSprintDay(day);
  const [currentState, setCurrentState] = useState(sprintDay.initialState);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dayData, setDayData] = useState({});
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      const initialPrompt = `Welcome to Day ${day} of the mini design sprint! Our goal today is to ${sprintGuidance[day].goal}. Let's start by ${sprintDay.prompts[sprintDay.initialState]}`;
      setMessages([{ text: initialPrompt, isUser: false }]);
      isInitialMount.current = false;
    }
  }, [day, sprintDay.initialState, sprintDay.prompts]);

  const getAIResponse = useCallback(async (prompt) => {
    setIsLoading(true);
    try {
      const aiResponse = await getGPTResponse(getAIPrompt(prompt, day, currentState, dayData));
      setMessages(prevMessages => [...prevMessages, { text: aiResponse, isUser: false }]);

      const nextState = determineNextState(currentState, dayData);
      if (nextState !== currentState) {
        console.log(`Transitioning from ${currentState} to ${nextState}`);
        setCurrentState(nextState);
        if (nextState === states.COMPLETED) {
          const deliverable = summarizeDay(dayData);
          onUpdateDeliverable(day, deliverable);
        } else {
          const newPrompt = sprintDay.prompts[nextState];
          setMessages(prevMessages => [...prevMessages, { text: newPrompt, isUser: false }]);
        }
      } else {
        console.log(`Staying in state: ${currentState}`);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prevMessages => [...prevMessages, { 
        text: "I'm having trouble processing that. Let's try a different approach. " + getSprintTip(day), 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [currentState, day, dayData, onUpdateDeliverable, sprintDay.prompts]);

  const handleSend = useCallback(() => {
    if (input.trim() && !isLoading) {
      const userMessage = { text: input, isUser: true };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setDayData(prevData => ({...prevData, [currentState]: input}));
      const currentInput = input;
      setInput('');
      getAIResponse(currentInput);
    }
  }, [input, isLoading, currentState, getAIResponse]);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatContainer>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {!message.isUser && <RelayIcon>:-) Relay</RelayIcon>}
            {parseMarkdown(message.text)}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </ChatContainer>
      <InputContainer>
        <Input
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
          rows={1}
        />
        <SendButton onClick={handleSend} disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </SendButton>
      </InputContainer>
      {currentState === states.COMPLETED && (
        <NextDayButton onClick={onNextDay}>
          Move to Day {day + 1}
        </NextDayButton>
      )}
    </>
  );
};

const getAIPrompt = (userInput, day, currentState, dayData) => {
  const { goal } = sprintGuidance[day];
  
  return `Day ${day}, state: ${currentState}. Goal: ${goal}. 
  Current data: ${JSON.stringify(dayData)}. 
  User input: "${userInput}".
  If a long-term goal has been provided, do not ask for it again.
  If challenges have been mentioned, do not ask for the long-term goal again.
  If the current state is LONG_TERM_GOAL and a goal is present, ask for challenges.
  If the current state is KEY_CHALLENGES and challenges are present, ask for opportunities.
  If the current state is OPPORTUNITIES and opportunities are present, summarize and conclude.
  Assume user input lists challenges if it follows a request for challenges. Be concise and direct. Respond in 1-2 sentences max. Interpret any user response following a request for challenges as a list of challenges.`;
};

const determineNextState = (currentState, dayData) => {
  if (currentState === states.LONG_TERM_GOAL && dayData[states.LONG_TERM_GOAL]) {
    return states.KEY_CHALLENGES;
  } else if (currentState === states.KEY_CHALLENGES && dayData[states.KEY_CHALLENGES]) {
    return states.OPPORTUNITIES;
  } else if (currentState === states.OPPORTUNITIES && dayData[states.OPPORTUNITIES]) {
    return states.COMPLETED;
  }
  return currentState;
};

const summarizeDay = (dayData) => {
  return Object.entries(dayData)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
};

export default AIChat;
