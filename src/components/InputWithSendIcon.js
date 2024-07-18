import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 15px;
  padding-right: 50px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  background-color: #f8f9fa;
  color: #1e1e1e;
  resize: none;
  overflow: hidden;
  min-height: 50px;
`;

const SendButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
`;

const SendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="#3c8ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#3c8ce7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InputWithSendIcon = ({ value, onChange, onSubmit, onKeyPress }) => {
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!value) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <InputContainer>
      <TextArea
        ref={textAreaRef}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={isFocused ? '' : "Enter your response here..."}
      />
      <SendButton onClick={onSubmit}>
        <SendIcon />
      </SendButton>
    </InputContainer>
  );
};

export default InputWithSendIcon;