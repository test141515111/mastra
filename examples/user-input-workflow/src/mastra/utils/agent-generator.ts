import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { UserInput, generateId } from './parser';
import { generateToolsFromUserInput } from './tool-generator';

// Generate an agent from user input
export function generateAgentFromUserInput(userInput: UserInput) {
  // Generate tools for the agent
  const tools = generateToolsFromUserInput(userInput);
  
  // Create instructions based on user input
  const instructions = `You are an AI assistant designed to help with: ${userInput.intention}
Requirements:
${userInput.requirements.join('\n')}

Use the provided tools to accomplish these tasks.`;

  // Create the agent
  const agent = new Agent({
    name: generateId('agent'),
    instructions,
    model: anthropic('claude-3-haiku-20240307'), // Using a default model
    tools: tools.reduce((acc, tool) => {
      acc[tool.id] = tool;
      return acc;
    }, {}),
  });

  return { agent, tools };
}
