// OutputSidebar.js
import React from 'react';
import styled from 'styled-components';
import { sprintGuidance } from '../utils/sprintResources';

const Sidebar = styled.div`
  width: 300px;
  background-color: #1a1a1a;
  padding: 1.5rem;
  overflow-y: auto;
  color: #e0e0e0;
  font-family: 'Futura', 'Avenir', 'Proxima Nova', 'Helvetica', sans-serif;
  border-left: 1px solid #2a2a2a;
  height: 100vh;
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-300px'};
  transition: right 0.3s ease-in-out;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 100%;
    right: ${props => props.isOpen ? '0' : '-100%'};
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
`;

const DaySection = styled.div`
  margin-bottom: 1.5rem;
`;

const DayTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: ${props => props.isCurrent ? '#3c8ce7' : '#ffffff'};
`;

const ObjectiveTitle = styled.h4`
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  color: #b0b0b0;
`;

const ObjectiveContent = styled.div`
  font-size: 0.9rem;
  white-space: pre-wrap;
  color: #e0e0e0;
  margin-left: 0.5rem;
`;

const OutputSidebar = ({ sprintData, currentDay, isOpen }) => {
    const renderObjectiveContent = (day, objective, content) => {
        if (Array.isArray(content)) {
            return (
                <ul>
                    {content.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            );
        } else if (typeof content === 'object' && content !== null) {
            return (
                <div>
                    {Object.entries(content).map(([key, value], index) => (
                        <p key={index}><strong>{key}:</strong> {value}</p>
                    ))}
                </div>
            );
        } else if (typeof content === 'string') {
            return <p>{content}</p>;
        } else {
            return <p>Not yet defined</p>;
        }
    };

    console.log("Rendering Sidebar with Data:", sprintData);

    return (
        <Sidebar isOpen={isOpen}>
            <Title>Sprint Progress</Title>
            {Object.entries(sprintGuidance).map(([day, { goal, objectives }]) => {
                const dayNum = parseInt(day);
                if (dayNum <= currentDay) {
                    return (
                        <DaySection key={day}>
                            <DayTitle isCurrent={dayNum === currentDay}>Day {day}: {goal}</DayTitle>
                            {dayNum === 4 ? (
                                // Special handling for Day 4
                                <>
                                    <ObjectiveTitle>Core Elements</ObjectiveTitle>
                                    <ObjectiveContent>{sprintData[4]?.coreElements || "Not yet defined"}</ObjectiveContent>
                                    <ObjectiveTitle>Structure/Flow</ObjectiveTitle>
                                    <ObjectiveContent>{sprintData[4]?.structureFlow || "Not yet defined"}</ObjectiveContent>
                                    <ObjectiveTitle>Interactions/Processes</ObjectiveTitle>
                                    <ObjectiveContent>{sprintData[4]?.interactionsProcesses || "Not yet defined"}</ObjectiveContent>
                                </>
                            ) : dayNum === 5 ? (
                                // Special handling for Day 5
                                <>
                                    <ObjectiveTitle>Who Will Test</ObjectiveTitle>
                                    <ObjectiveContent>{sprintData[5]?.["Who Will Test"] || "Not yet defined"}</ObjectiveContent>
                                    <ObjectiveTitle>How They Will Test</ObjectiveTitle>
                                    <ObjectiveContent>{sprintData[5]?.["How They Will Test"] || "Not yet defined"}</ObjectiveContent>
                                </>
                            ) : (
                                // Handling for Days 1-3
                                objectives.map((objective, index) => (
                                    <div key={index}>
                                        <ObjectiveTitle>{objective}</ObjectiveTitle>
                                        <ObjectiveContent>
                                            {sprintData[day] && sprintData[day][objective] 
                                                ? renderObjectiveContent(day, objective, sprintData[day][objective])
                                                : "Not yet defined"}
                                        </ObjectiveContent>
                                    </div>
                                ))
                            )}
                        </DaySection>
                    );
                }
                return null;
            })}
        </Sidebar>
    );
};

export default OutputSidebar;