import React from 'react';
import styled from 'styled-components';

const Sidebar = styled.div`
  width: 300px;
  background-color: #2a2a2a;
  padding: 1rem;
  overflow-y: auto;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Content = styled.p`
  font-size: 0.9rem;
  white-space: pre-wrap;
`;

const OutputSidebar = ({ sprintSummary, currentDay }) => {
  return (
    <Sidebar>
      <Title>Sprint Summary</Title>
      <Content>{sprintSummary[currentDay] || "Not defined yet."}</Content>
    </Sidebar>
  );
};

export default OutputSidebar;