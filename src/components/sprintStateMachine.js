export const states = {
    LONG_TERM_GOAL: 'LONG_TERM_GOAL',
    KEY_CHALLENGES: 'KEY_CHALLENGES',
    OPPORTUNITIES: 'OPPORTUNITIES',
    COMPLETED: 'COMPLETED'
  };
  
  export const createSprintDay = (day) => {
    switch(day) {
      case 1:
        return {
          initialState: states.LONG_TERM_GOAL,
          transitions: {
            [states.LONG_TERM_GOAL]: states.KEY_CHALLENGES,
            [states.KEY_CHALLENGES]: states.OPPORTUNITIES,
            [states.OPPORTUNITIES]: states.COMPLETED
          },
          prompts: {
            [states.LONG_TERM_GOAL]: "What is the long-term goal for your project?",
            [states.KEY_CHALLENGES]: "What are the key challenges you anticipate?",
            [states.OPPORTUNITIES]: "What opportunities do you see to address these challenges?",
            [states.COMPLETED]: "Great job! You've completed Day 1. [SHOW_NEXT_DAY_BUTTON]"
          },
          requiredFields: ['LONG_TERM_GOAL', 'KEY_CHALLENGES', 'OPPORTUNITIES']
        };
      // ... (cases for other days)
      default:
        return {
          initialState: states.COMPLETED,
          transitions: {},
          prompts: {
            [states.COMPLETED]: "The sprint is complete. Great job!"
          },
          requiredFields: []
        };
    }
  };