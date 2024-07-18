import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';  // Add keyframes here
import { getGPTResponse } from '../utils/gptService';
import { sprintGuidance } from '../utils/sprintResources';
import OutputSidebar from './OutputSidebar';
import FinalSummary from './FinalSummary';
import { FaPaperPlane } from 'react-icons/fa';

// Styling for the container, conversation box, and input box
const SprintContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #121212;
  color: #e0e0e0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.h1`
  color: #3c8ce7;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const ConversationBox = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  border: 1px solid #3c8ce7;
  padding: 10px;
  background-color: #2a2a2a;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  height: 60vh;
  min-height: 300px;
`;


const Input = styled.textarea`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #3a3a3a;
  color: #e0e0e0;
  resize: none; /* Prevent resize by user */
  overflow: hidden; /* Hide scroll bar */
`;

const SendButton = styled.button`
  background-color: #3c8ce7;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`;

const InputBox = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #3c8ce7;
  background-color: #2a2a2a;
  align-items: center;
`;

const Message = styled.div`
  background-color: ${props => props.isUser ? '#3c8ce7' : '#3a3a3a'};
  color: #e0e0e0;
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 10px;
  max-width: 70%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  word-wrap: break-word; /* Ensure long words break */
  ${props => !props.isUser && `
    &::before {
      content: 'Relay: ';
      color: #3c8ce7;
      font-weight: bold;
    }
  `}
`;


const typing = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

const TypingIndicator = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 30px;
  margin-bottom: 20px;

  span {
    height: 10px;
    width: 10px;
    margin: 0 2px;
    background-color: #3c8ce7;
    border-radius: 50%;
    display: inline-block;
    animation: ${typing} 1s infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

const NextDayButton = styled.button`
  background-color: #3c8ce7;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;
  align-self: flex-start;
`;

const CopyButton = styled.button`
  background-color: #3c8ce7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const Timer = styled.div`
  font-size: 2rem;
  text-align: center;
  margin: 1rem 0;
`;

const CrazyEightContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 5px;
`;

const CrazyEightInstructions = styled.p`
  margin-bottom: 1rem;
  color: #e0e0e0;
`;

const CrazyEightInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #3c8ce7;
  border-radius: 5px;
`;

const StoryboardContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 5px;
`;

const StoryboardInstructions = styled.p`
  margin-bottom: 1rem;
  color: #e0e0e0;
`;

const StoryboardSection = styled.textarea`
  width: 100%;
  height: 150px;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 5px;
`;

const PrototypeSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 5px;
`;

const InteractionSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border-radius: 5px;
`;

const ToggleSidebarButton = styled.button`
  position: fixed;
  top: 10px;
  right: ${props => props.isSidebarOpen ? '310px' : '10px'};
  background-color: transparent;
  color: #3c8ce7;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
`;

const SubmitButton = styled(SendButton)`
  margin-top: 10px;
  width: 100%;
  justify-content: center;
`;

const DaySprint = () => {
    const [currentDay, setCurrentDay] = useState(1);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sprintData, setSprintData] = useState({});
    const [isTyping, setIsTyping] = useState(false);
    const [isReadyForNextDay, setIsReadyForNextDay] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(480);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [crazyEightIdeas, setCrazyEightIdeas] = useState(Array(8).fill(''));
    const [storyboardSections, setStoryboardSections] = useState(['', '', '']);
    const [prototypeData, setPrototypeData] = useState({ coreElements: '', structureFlow: '', interactionsProcesses: '' });
    const [testingScenario, setTestingScenario] = useState('');
    const [userInteraction, setUserInteraction] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSprintComplete, setIsSprintComplete] = useState(false);

    const conversationEndRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const getCurrentPrompt = useCallback(() => sprintGuidance[currentDay].prompt, [currentDay]);

    const moveToNextDay = useCallback(() => {
        if (currentDay < 5) {
            setCurrentDay(prev => {
                const nextDay = prev + 1;
                setIsReadyForNextDay(false);
                // Reset day-specific states
                if (prev === 2) {
                    setCrazyEightIdeas(Array(8).fill(''));
                } else if (prev === 3) {
                    setStoryboardSections(['', '', '']);
                }
                setIsTimerRunning(false);
                setTimerSeconds(480);
                return nextDay;
            });
        } else {
            setIsSprintComplete(true);
        }
    }, [currentDay]);

    const formatRelayMessage = (text) => {
        return text.replace(/Relay:/g, '<RelayName>Relay:</RelayName>')
            .replace(/(\d+\.)/g, '<IndentedList>$1</IndentedList>');
    };


    const checkDayCompletion = useCallback(async () => {
        let isComplete = false;

        switch (currentDay) {
            case 1:
                isComplete = sprintData[1]?.Problem && sprintData[1]?.["Long-term Goal"] && sprintData[1]?.["Critical Questions"];
                break;
            case 2:
                isComplete = sprintData[2]?.["Crazy 8s"] && sprintData[2]?.["Crazy 8s"].length === 8;
                break;
            case 3:
                isComplete = sprintData[3]?.["Solution Sketch"] && sprintData[3]?.["Solution Sketch"].length === 3;
                break;
            case 4:
                isComplete = Object.values(prototypeData).every(value => value.trim() !== '');
                if (isComplete) {
                    setSprintData(prev => ({
                        ...prev,
                        4: {
                            coreElements: prototypeData.coreElements,
                            structureFlow: prototypeData.structureFlow,
                            interactionsProcesses: prototypeData.interactionsProcesses
                        },
                    }));
                }
                break;
            case 5:
                if (testingScenario.trim() !== '' && userInteraction.trim() !== '') {
                    const whoSummary = await summarizeInput(testingScenario);
                    const howSummary = await summarizeInput(userInteraction);
                    console.log("Summarized Who Will Test:", whoSummary);
                    console.log("Summarized How They Will Test:", howSummary);
                    setSprintData(prev => ({
                        ...prev,
                        5: {
                            "Who Will Test": whoSummary,
                            "How They Will Test": howSummary,
                        },
                    }));
                    isComplete = true;
                }
                break;
            default:
                isComplete = false;
        }

        setIsReadyForNextDay(isComplete);
        return isComplete;
    }, [currentDay, prototypeData, sprintData, testingScenario, userInteraction]);

    useEffect(() => {
        let interval;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => {
                setTimerSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (timerSeconds === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);


    const getInitialPrompt = useCallback(() => {
        switch (currentDay) {
            case 1:
                return `Welcome to our AI-powered Mini Design Sprint! I'm Relay, your guide through this condensed version of Jake Knapp and John Zeratsky's methodology. Over the next five short sessions, we'll rapidly innovate and prototype your idea. You can ask me questions at any time during the sprint.

    Let's begin Day 1 by addressing three key points:
    1. What problem are you trying to solve?
    2. What's your long-term goal for this project?
    3. What are the critical questions we need to answer?

    First, tell me about the problem you're addressing. What challenges are you facing?`;
            case 2:
                return `Welcome to Day 2! Today, we'll generate ideas using the Crazy 8s method. Are you ready to start the timer and brainstorm 8 ideas in 8 minutes?`;
            case 3:
                return `It's Day 3! Let's create a three-panel storyboard for your chosen solution. Start by describing the problem or starting point in the first panel.`;
            case 4:
                return `Welcome to Day 4. Today, we'll design a conceptual prototype. Begin by describing the core elements of your solution.`;
            case 5:
                return `It's the final day! We'll conduct simulated user testing. Start by describing a testing scenario for your prototype.`;
            default:
                return `Welcome to Day ${currentDay} of the Design Sprint.`;
        }
    }, [currentDay]);

    useEffect(() => {
        console.log("Sprint Data: ", sprintData); // Debugging line to verify structure
    }, [sprintData]);


    useEffect(() => {
        const loadInitialPrompt = async () => {
            setIsTyping(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsTyping(false);
            const initialPrompt = getInitialPrompt();
            setMessages([{ isUser: false, text: initialPrompt }]);
        };

        loadInitialPrompt();
    }, [currentDay, getInitialPrompt]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { isUser: true, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            await updateSprintData(input);

            const context = messages.map(m => `${m.isUser ? 'User' : 'Relay'}: ${m.text}`).join('\n');
            const prompt = `Day ${currentDay} of Design Sprint. Context: ${context}\nUser: ${input}\n${getCurrentPrompt()}`;
            const response = await getGPTResponse(prompt, currentDay, sprintGuidance[currentDay].objectives);

            const aiMessage = { isUser: false, text: response };
            setMessages(prev => [...prev, aiMessage]);

            if (response.toLowerCase().includes("move to the next day")) {
                setIsReadyForNextDay(true);
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setMessages(prev => [...prev, { isUser: false, text: "I'm having trouble right now. Please try again." }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    const summarizeInput = async (input) => {
        if (!input || !input.trim()) return "Not yet defined";

        const prompt = `Summarize the following in one concise sentence, maintaining key points: "${input}"`;
        try {
            const summary = await getGPTResponse(prompt, currentDay, sprintGuidance[currentDay].objectives || []);
            return summary.trim() || input.trim();
        } catch (error) {
            console.error('Error summarizing input:', error);
            return input.trim();
        }
    };


    const summarizeCrazy8s = async (ideas) => {
        if (ideas.length === 0) return ["Not yet defined"];
        const prompt = `Here are 8 ideas from a Crazy 8s exercise:\n${ideas.join('\n')}\nPlease select and summarize the 3 most intriguing ideas in one sentence each.`;
        try {
            const summary = await getGPTResponse(prompt, currentDay, sprintGuidance[currentDay].objectives || []);
            const summaries = summary.split('\n').filter(s => s.trim());
            return summaries.length > 0 ? summaries : ideas.slice(0, 3);
        } catch (error) {
            console.error('Error summarizing Crazy 8s:', error);
            return ideas.slice(0, 3);
        }
    };

    const updateSprintData = async (input) => {
        const updatedData = { ...sprintData };
        if (!updatedData[currentDay]) {
            updatedData[currentDay] = {};
        }

        console.log(`Updating data for Day ${currentDay} with input:`, input); // Log the input

        switch (currentDay) {
            case 1:
                if (!updatedData[1].Problem) {
                    const summary = await summarizeInput(input);
                    console.log("Summarized Problem:", summary); // Log the summary
                    updatedData[1].Problem = summary;
                } else if (!updatedData[1]["Long-term Goal"]) {
                    const summary = await summarizeInput(input);
                    console.log("Summarized Long-term Goal:", summary); // Log the summary
                    updatedData[1]["Long-term Goal"] = summary;
                } else if (!updatedData[1]["Critical Questions"]) {
                    const questions = input.split(/\d+\./)
                        .filter(q => q.trim())
                        .map(q => q.trim());
                    const summarizedQuestions = await Promise.all(questions.map(summarizeInput));
                    console.log("Summarized Critical Questions:", summarizedQuestions); // Log the summaries
                    updatedData[1]["Critical Questions"] = summarizedQuestions;
                }
                break;
            case 2:
                if (crazyEightIdeas.every(idea => idea.trim() !== '')) {
                    const summarizedIdeas = await summarizeCrazy8s(crazyEightIdeas);
                    console.log("Summarized Crazy 8s Ideas:", summarizedIdeas); // Log the summaries
                    updatedData[2] = {
                        "Crazy 8s": summarizedIdeas,
                    };
                }
                break;
            case 3:
                if (storyboardSections.every(section => section.trim() !== '')) {
                    const summarizedSections = await Promise.all(storyboardSections.map(summarizeInput));
                    console.log("Summarized Solution Sketch:", summarizedSections); // Log the summaries
                    updatedData[3] = {
                        "Solution Sketch": summarizedSections,
                    };
                }
                break;
            case 4:
                if (Object.values(prototypeData).every(value => value.trim() !== '')) {
                    updatedData[4] = {
                        coreElements: prototypeData.coreElements,
                        structureFlow: prototypeData.structureFlow,
                        interactionsProcesses: prototypeData.interactionsProcesses
                    };
                }
                break;
            case 5:
                if (!updatedData[5]) {
                    updatedData[5] = {};
                }
                if (testingScenario.trim() !== '') {
                    const summary = await summarizeInput(testingScenario);
                    console.log("Summarized Who Will Test:", summary);
                    updatedData[5]["Who Will Test"] = summary;
                }
                if (userInteraction.trim() !== '') {
                    const summary = await summarizeInput(userInteraction);
                    console.log("Summarized How They Will Test:", summary);
                    updatedData[5]["How They Will Test"] = summary;
                }
                break;
            default:
                break;
        }

        setSprintData(updatedData);
        console.log("Updated Sprint Data:", updatedData); // Log the updated state
        checkDayCompletion();
    };




    const submitCrazyEight = async () => {
        if (crazyEightIdeas.every(idea => idea.trim() !== '')) {
            setIsTyping(true);
            try {
                const summarizedIdeas = await Promise.all(crazyEightIdeas.map(async (idea) => {
                    return await summarizeInput(idea);
                }));

                setSprintData(prev => ({
                    ...prev,
                    2: {
                        "Crazy 8s": summarizedIdeas
                    }
                }));

                const responseMessage = "Great job completing your Crazy 8s! I've summarized your ideas for the sprint progress. Would you like to move on to the next day?";
                setMessages(prev => [...prev, { isUser: false, text: responseMessage }]);
                setIsReadyForNextDay(true);
            } catch (error) {
                console.error('Error processing Crazy 8 ideas:', error);
                setMessages(prev => [...prev, { isUser: false, text: "I'm having trouble processing your Crazy 8 ideas. Please try submitting again." }]);
            } finally {
                setIsTyping(false);
            }
        } else {
            alert("Please complete all 8 ideas before submitting.");
        }
    };

    const updateCrazyEightIdea = (index, value) => {
        const newIdeas = [...crazyEightIdeas];
        newIdeas[index] = value;
        setCrazyEightIdeas(newIdeas);
    };

    const updateStoryboardSection = (index, value) => {
        const newSections = [...storyboardSections];
        newSections[index] = value;
        setStoryboardSections(newSections);
        checkDayCompletion();
    };

    const updatePrototypeData = (key, value) => {
        setPrototypeData(prev => ({ ...prev, [key]: value }));
        checkDayCompletion();
    };

    const startTimer = () => {
        setIsTimerRunning(true);
        setTimerSeconds(480);
    };

    const submitSolutionSketch = async () => {
        if (storyboardSections.every(section => section.trim() !== '')) {
            setIsTyping(true);
            const sketchString = storyboardSections.map((section, index) => `Panel ${index + 1}: ${section}`).join('\n');
            const prompt = `The user has completed their solution sketch with the following three panels:\n${sketchString}\nPlease provide a brief analysis and feedback on this solution sketch, highlighting strengths and areas for improvement.`;

            try {
                const response = await getGPTResponse(prompt, currentDay, sprintGuidance[currentDay].objectives);
                setMessages(prev => [...prev, { isUser: false, text: response }]);
                const summarizedSections = await Promise.all(storyboardSections.map(summarizeInput));
                setSprintData(prev => ({
                    ...prev,
                    3: {
                        "Solution Sketch": summarizedSections
                    }
                }));
                setIsReadyForNextDay(true);
            } catch (error) {
                console.error('Error in submitSolutionSketch:', error);
                setMessages(prev => [...prev, { isUser: false, text: "I'm having trouble providing feedback on your solution sketch. Please try submitting again." }]);
            } finally {
                setIsTyping(false);
            }
        } else {
            alert("Please complete all three panels of the solution sketch before submitting.");
        }
    };

    const submitPrototype = async () => {
        if (Object.values(prototypeData).every(value => value.trim() !== '')) {
            setIsTyping(true);
            const prototypeString = Object.entries(prototypeData).map(([key, value]) => `${key}: ${value}`).join('\n');
            const prompt = `The user has completed their prototype design with the following details:\n${prototypeString}\nPlease provide a brief analysis and feedback on this prototype, highlighting strengths and suggesting potential improvements.`;

            try {
                // Log day and objectives before calling getGPTResponse
                console.log('Day:', currentDay);
                console.log('Objectives:', sprintGuidance[currentDay].objectives || []);

                const response = await getGPTResponse(prompt, currentDay, sprintGuidance[currentDay].objectives || []);
                setMessages(prev => [...prev, { isUser: false, text: response }]);

                // Ensure correct structure for Day 4
                setSprintData(prev => ({
                    ...prev,
                    4: {
                        ...prototypeData,
                        "Feedback": response
                    }
                }));

                console.log("Updated Sprint Data for Day 4:", {
                    ...prototypeData,
                    "Feedback": response
                }); // Log the updated data

                setIsReadyForNextDay(true);
            } catch (error) {
                setMessages(prev => [...prev, { isUser: false, text: "I'm having trouble providing feedback on your prototype. Please try submitting again." }]);
            } finally {
                setIsTyping(false);
            }
        } else {
            alert("Please complete all sections of the prototype design before submitting.");
        }
    };



    const suggestTestingPlan = async () => {
        setIsTyping(true);
        const prompt = `Based on the prototype described: ${JSON.stringify(prototypeData)}, suggest a user testing plan. Include who should test the prototype (target users) and how they should test it (specific tasks and questions).`;

        try {
            // Log day and objectives before calling getGPTResponse
            console.log('Day:', currentDay);
            console.log('Objectives:', sprintGuidance[currentDay].objectives || []);

            const response = await getGPTResponse(prompt, currentDay, sprintGuidance[currentDay].objectives || []);
            const [who, how] = response.split('\n\n');
            setTestingScenario(who);
            setUserInteraction(how);
            setMessages(prev => [...prev, { isUser: false, text: `Here's a suggested user testing plan:\n\n${response}\n\nFeel free to modify this plan as needed.` }]);
        } catch (error) {
            setMessages(prev => [...prev, { isUser: false, text: "I'm having trouble suggesting a testing plan. Please try creating one yourself." }]);
        } finally {
            setIsTyping(false);
        }
    };


    const submitTestingPlan = async () => {
        if (testingScenario.trim() !== '' && userInteraction.trim() !== '') {
            setIsTyping(true);
            const prompt = `Create a formal and comprehensive user testing plan for a mini design sprint tool. Format the response as follows:
    
    **Who Will Test:**
    [Provide a formal description of the target users, their roles, and why they're suitable for testing]
    
    **How They Will Test:**
    [Provide a detailed testing plan including number of participants, tasks, questions, and any other relevant details. Use numbered lists and bullet points.]
    
    Ensure the response is detailed, formal, and at least 300 words long.`;

            try {
                const response = await getGPTResponse(prompt, currentDay, sprintGuidance[currentDay].objectives || []);

                const sections = response.split('**');
                const whoWillTest = sections[2] ? sections[2].replace('Who Will Test:', '').trim() : "Error generating who will test";
                const howTheyWillTest = sections[4] ? sections[4].replace('How They Will Test:', '').trim() : "Error generating how they will test";

                setSprintData(prev => ({
                    ...prev,
                    5: {
                        "Who Will Test": whoWillTest,
                        "How They Will Test": howTheyWillTest
                    }
                }));

                setMessages(prev => [...prev, { isUser: false, text: "Great! I've created a comprehensive testing plan. You can view the details in the sprint progress sidebar and in the final summary." }]);
                setIsReadyForNextDay(true);
            } catch (error) {
                console.error('Error in submitTestingPlan:', error);
                setMessages(prev => [...prev, { isUser: false, text: "I'm having trouble processing your testing plan. Please try submitting again or provide more details." }]);
            } finally {
                setIsTyping(false);
            }
        } else {
            alert("Please complete both 'Who will test' and 'How they will test' sections before submitting.");
        }
    };

    return (
        <SprintContainer>
            <MainContent>
                {!isSprintComplete ? (
                    <>
                        <Header>{`Day ${currentDay}: ${sprintGuidance[currentDay].goal}`}</Header>
                        <ConversationBox>
                            {messages.map((message, index) => (
                                <Message key={index} isUser={message.isUser}>
                                    {message.isUser ? message.text : <div dangerouslySetInnerHTML={{ __html: formatRelayMessage(message.text) }} />}
                                </Message>
                            ))}
                            {isTyping && <TypingIndicator><span></span><span></span><span></span></TypingIndicator>}
                            <div ref={conversationEndRef} />
                        </ConversationBox>
                        <InputBox>
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message here..."
                                rows={1}
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                            />
                            <SendButton onClick={handleSubmit}>
                                <FaPaperPlane />
                            </SendButton>
                        </InputBox>

                        {/* Day-specific components */}
                        {currentDay === 2 && (
                            <CrazyEightContainer>
                                <CrazyEightInstructions>
                                    Crazy 8s is a fast sketching exercise where you'll create 8 distinct ideas in 8 minutes.
                                    The goal is to push beyond your first idea and generate a wide range of possibilities.
                                    Don't worry about quality or feasibility at this stage - focus on quantity and variety!
                                </CrazyEightInstructions>
                                {!isTimerRunning && <button onClick={startTimer}>Start 8-Minute Timer</button>}
                                {isTimerRunning && <Timer>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</Timer>}
                                {crazyEightIdeas.map((idea, index) => (
                                    <CrazyEightInput
                                        key={index}
                                        value={idea}
                                        onChange={(e) => updateCrazyEightIdea(index, e.target.value)}
                                        placeholder={`Crazy 8s Idea ${index + 1}`}
                                    />
                                ))}
                                <SubmitButton onClick={submitCrazyEight}>
                                    Submit Crazy 8s Ideas for Feedback
                                </SubmitButton>
                            </CrazyEightContainer>
                        )}

                        {currentDay === 3 && (
                            <StoryboardContainer>
                                <StoryboardInstructions>
                                    Create a three-panel storyboard that outlines your chosen solution. Each panel should represent a key step or moment in your solution:
                                    1. The problem or starting point
                                    2. The main action or change
                                    3. The result or outcome
                                    Describe each panel in detail, focusing on what the user sees and does.
                                </StoryboardInstructions>
                                {storyboardSections.map((section, index) => (
                                    <StoryboardSection
                                        key={index}
                                        value={section}
                                        onChange={(e) => updateStoryboardSection(index, e.target.value)}
                                        placeholder={`Panel ${index + 1}: ${index === 0 ? "Describe the problem or starting point" : index === 1 ? "Detail the main action or change" : "Illustrate the result or outcome"}`}
                                    />
                                ))}
                                <SubmitButton onClick={submitSolutionSketch}>
                                    Submit Solution Sketch for Feedback
                                </SubmitButton>
                            </StoryboardContainer>
                        )}

                        {currentDay === 4 && (
                            <PrototypeSection>
                                <h3>Design Your Conceptual Prototype</h3>
                                <p>Create a detailed description of your prototype, focusing on core elements, structure, and key interactions.</p>
                                <StoryboardSection
                                    value={prototypeData.coreElements}
                                    onChange={(e) => updatePrototypeData('coreElements', e.target.value)}
                                    placeholder="Describe core elements..."
                                />
                                <StoryboardSection
                                    value={prototypeData.structureFlow}
                                    onChange={(e) => updatePrototypeData('structureFlow', e.target.value)}
                                    placeholder="Outline structure or flow..."
                                />
                                <StoryboardSection
                                    value={prototypeData.interactionsProcesses}
                                    onChange={(e) => updatePrototypeData('interactionsProcesses', e.target.value)}
                                    placeholder="Detail interactions or processes..."
                                />
                                <SubmitButton onClick={submitPrototype}>
                                    Submit Prototype for Feedback
                                </SubmitButton>
                            </PrototypeSection>
                        )}

                        {currentDay === 5 && (
                            <InteractionSection>
                                <h3>User Testing Plan</h3>
                                <p>Create a plan for testing your prototype with real users. Define who will test and how they will test.</p>
                                <StoryboardSection
                                    value={testingScenario}
                                    onChange={(e) => setTestingScenario(e.target.value)}
                                    placeholder="Describe who your test users will be (e.g., demographics, experience level)..."
                                />
                                <StoryboardSection
                                    value={userInteraction}
                                    onChange={(e) => setUserInteraction(e.target.value)}
                                    placeholder="Outline how users will test your prototype (e.g., specific tasks, questions to ask)..."
                                />
                                <ButtonGroup>
                                    <CopyButton onClick={suggestTestingPlan}>Suggest Testing Plan</CopyButton>
                                </ButtonGroup>
                                <SubmitButton onClick={submitTestingPlan}>
                                    Submit Testing Plan
                                </SubmitButton>
                            </InteractionSection>
                        )}

                        {isReadyForNextDay && currentDay < 5 && (
                            <NextDayButton onClick={moveToNextDay}>
                                Move to Day {currentDay + 1}
                            </NextDayButton>
                        )}

                        {isReadyForNextDay && currentDay === 5 && (
                            <NextDayButton onClick={() => setIsSprintComplete(true)}>
                                Finish Sprint and Review Summary
                            </NextDayButton>
                        )}
                    </>
                ) : (
                    <FinalSummary sprintData={sprintData} />
                )}
            </MainContent>
            {isSidebarOpen && (
                <OutputSidebar
                    sprintData={sprintData}
                    currentDay={currentDay}
                />
            )}
            <ToggleSidebarButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen}>
                {isSidebarOpen ? '×' : '☰'}
            </ToggleSidebarButton>
        </SprintContainer>
    );
};

export default DaySprint;