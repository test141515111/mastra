import { Agent } from '@mastra/core';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { AgentDefinitionInput } from '../types';

/**
 * Generate an agent from an agent definition input
 */
export function generateAgent(agentInput: AgentDefinitionInput, tools: Record<string, any> = {}) {
  // Select model based on provider and name
  let model;
  if (agentInput.modelProvider === 'openai') {
    model = openai(agentInput.modelName);
  } else if (agentInput.modelProvider === 'anthropic') {
    model = anthropic(agentInput.modelName);
  } else {
    throw new Error(`Unsupported model provider: ${agentInput.modelProvider}`);
  }
  
  // Filter tools based on tool IDs provided in agent input
  const agentTools: Record<string, any> = {};
  if (agentInput.tools && agentInput.tools.length > 0) {
    for (const toolId of agentInput.tools) {
      if (tools[toolId]) {
        agentTools[toolId] = tools[toolId];
      } else {
        console.warn(`Tool ${toolId} not found for agent ${agentInput.name}`);
      }
    }
  }
  
  // Create and return the agent
  return new Agent({
    name: agentInput.name,
    instructions: agentInput.instructions,
    model,
    tools: Object.keys(agentTools).length > 0 ? agentTools : undefined,
  });
}
