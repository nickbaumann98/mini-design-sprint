import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.div`
  padding: 2rem;
  background-color: #2a2a2a;
  border-radius: 8px;
  color: #e0e0e0;
`;

const SummaryTitle = styled.h2`
  color: #3c8ce7;
  margin-bottom: 1rem;
`;

const SummarySection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const FinalSummary = ({ sprintData }) => {
    return (
        <SummaryContainer>
            <SummaryTitle>Sprint Summary</SummaryTitle>

            <SummarySection>
                <SectionTitle>Day 1: Define the long-term goal</SectionTitle>
                <p><strong>Problem:</strong> {sprintData[1]?.problem || 'Not defined'}</p>
                <p><strong>Long-term Goal:</strong> {sprintData[1]?.["Long-term Goal"] || 'Not defined'}</p>
                <p><strong>Critical Questions:</strong></p>
                <ul>
                    {sprintData[1]?.["Critical Questions"]?.map((question, index) => (
                        <li key={index}>{question}</li>
                    )) || <li>Not defined</li>}
                </ul>
            </SummarySection>

            <SummarySection>
                <SectionTitle>Day 2: Crazy 8s Ideation</SectionTitle>
                <p><strong>Top Ideas:</strong></p>
                <ul>
                    {sprintData[2]?.["Crazy 8s"]?.slice(0, 3).map((idea, index) => (
                        <li key={index}>{idea}</li>
                    )) || <li>Not defined</li>}
                </ul>
            </SummarySection>

            <SummarySection>
                <SectionTitle>Day 3: Solution Sketch</SectionTitle>
                {sprintData[3]?.["Solution Sketch"]?.map((panel, index) => (
                    <p key={index}><strong>Panel {index + 1}:</strong> {panel}</p>
                )) || <p>Not defined</p>}
            </SummarySection>

            <SummarySection>
                <SectionTitle>Day 4: Design Conceptual Prototype</SectionTitle>
                <p><strong>Core Elements:</strong> {sprintData[4]?.coreElements || 'Not defined'}</p>
                <p><strong>Structure/Flow:</strong> {sprintData[4]?.structureFlow || 'Not defined'}</p>
                <p><strong>Interactions/Processes:</strong> {sprintData[4]?.interactionsProcesses || 'Not defined'}</p>
            </SummarySection>

            <SummarySection>
                <SectionTitle>Day 5: User Testing Plan</SectionTitle>
                <p><strong>Who Will Test:</strong> {sprintData[5]?.["Who Will Test"] || 'Not defined'}</p>
                <p><strong>How They Will Test:</strong> {sprintData[5]?.["How They Will Test"] || 'Not defined'}</p>
            </SummarySection>

            <SummarySection>
                <SectionTitle>Next Steps</SectionTitle>
                <p>Based on the sprint results, consider the following next steps:</p>
                <ul>
                    <li>Refine the prototype based on testing feedback</li>
                    <li>Conduct additional user testing with a broader group</li>
                    <li>Develop a roadmap for implementing the solution</li>
                    <li>Identify any technical or resource constraints to address</li>
                </ul>
            </SummarySection>
        </SummaryContainer>
    );
};

export default FinalSummary;