import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #1e1e1e;
    color: #ffffff;
  }

  * {
    box-sizing: border-box;
  }

  button {
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
  }

  input, textarea {
    background-color: #f8f9fa;
    color: #1e1e1e;
    border: none;
    border-radius: 25px;
    padding: 15px;
    font-size: 1rem;
  }
`;