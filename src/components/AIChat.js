import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import SimpleMarkdown from 'simple-markdown';
import { getGPTResponse } from '../utils/gptService';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  overflow-y: auto;
  background-color: #2a2a2a;
  border-radius: 8px;
  padding: 1rem;
`;

const Message = styled.div`
  background-color: ${props => props.isUser ? '#3c8ce7' : '#4a4a4a'};
  color: #ffffff;
  padding: 0.8rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  line-height: 1.5;

  p {
    margin-bottom: 0.5rem;
  }

  ul, ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }

  li {
    margin-bottom: 0.25rem;
  }

  strong {
    font-weight: bold;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const InputContainer = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #3a3a3a;
  color: #ffffff;
  resize: none;
  min-height: 40px;
  max-height: 200px;
  overflow-y: auto;
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

const AIChat = ({ day, onUpdateDeliverable }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const inputRef = useRef(null);

  const getAIResponse = useCallback(async (prompt, currentDay, shouldUpdateDeliverable = false) => {
    setIsLoading(true);
    try {
      const aiResponse = await getGPTResponse(getAIPrompt(prompt, currentDay));
      const aiMessage = { text: aiResponse, isUser: false };
      setMessages(prev => [...prev, aiMessage]);
      if (shouldUpdateDeliverable) {
        const deliverable = await getGPTResponse(getDeliverablePrompt(prompt, currentDay));
        onUpdateDeliverable(currentDay, deliverable);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { text: "I'm sorry, there was an error processing your request. Could you please try again?", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  }, [onUpdateDeliverable]);

  useEffect(() => {
    if (!hasInitialized) {
      const initialPrompt = getInitialPrompt(day);
      setMessages([{ text: initialPrompt, isUser: false }]);
      setHasInitialized(true);
    }
  }, [day, hasInitialized]);

  const debouncedHandleSend = useCallback(
    debounce(async () => {
      if (input.trim() && !isLoading) {
        const userMessage = { text: input, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        await getAIResponse(currentInput, day, true);
      }
    }, 300),
    [input, isLoading, day, getAIResponse]
  );

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      debouncedHandleSend();
    }
  };

  return (
    <>
      <ChatContainer>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {parseMarkdown(message.text)}
          </Message>
        ))}
      </ChatContainer>
      <InputContainer>
        <Input
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <SendButton onClick={debouncedHandleSend} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </SendButton>
      </InputContainer>
    </>
  );
};

const getInitialPrompt = (day) => {
  const prompts = {
    1: "Let's start by defining your long-term goal for this project. What are you aiming to achieve?",
    2: "Great! Now let's sketch out some potential solutions. What ideas do you have?",
    3: "It's time to decide on the best solutions. Which ideas stand out to you?",
    4: "Now we'll build a prototype. What key features should we include?",
    5: "Finally, let's test and learn. What aspects of the prototype do you want to focus on?"
  };
  return prompts[day] || "Let's continue with the sprint. What's on your mind?";
};

const getAIPrompt = (userInput, day) => {
  return `You are Jake and John, creators of the Design Sprint. You're helping create a mini sprint tool. Keep your responses short, friendly, and conversational. Ask one follow-up question at a time. It's Day ${day} of the sprint. The user said: "${userInput}". Respond briefly and ask a relevant follow-up question.`;
};

const getDeliverablePrompt = (userInput, day) => {
  const deliverables = {
    1: "Create a concise, polished long-term goal statement based on the user's input.",
    2: "List the top 3-5 potential solutions discussed, in bullet point format.",
    3: "Identify and briefly describe the best solution chosen.",
    4: "Outline 3-5 key features of the prototype in bullet point format.",
    5: "List 3-5 main insights or action items from the testing phase."
  };
  return `Based on this user input: "${userInput}", ${deliverables[day]} Keep it brief and professional.`;
};

export default AIChat;