import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { AgentDefinitionInput } from '../types';

/**
 * Generate a Mastra agent from an agent definition input
 */
export function generateAgent(agentInput: AgentDefinitionInput, tools: Record<string, any>) {
  // Filter tools based on the specified tool IDs
  const agentTools = {};
  agentInput.tools.forEach(toolId => {
    if (tools[toolId]) {
      agentTools[toolId] = tools[toolId];
    }
  });
  
  // Determine the model to use
  let model;
  if (agentInput.model.startsWith('gpt')) {
    model = openai(agentInput.model);
  } else {
    // Default to OpenAI if model type is not specified
    model = openai('gpt-4');
  }
  
  // Create and return the agent
  return new Agent({
    name: agentInput.name,
    instructions: agentInput.instructions,
    model,
    tools: agentTools,
  });
}
