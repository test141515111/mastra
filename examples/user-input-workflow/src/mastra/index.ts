import { Mastra } from '@mastra/core';
import { createLogger } from '@mastra/core/logger';

// Create an initially empty Mastra instance that will be populated dynamically
export const mastra = new Mastra({
  agents: {},
  workflows: {},
  logger: createLogger({
    name: 'mastra_クローン立ち上げ',
    level: 'info',
  }),
});

// Function to register a dynamically created agent
export function registerAgent(name: string, agent: any) {
  mastra.getAgents()[name] = agent;
  agent.__registerMastra(mastra);
}

// Function to register a dynamically created workflow
export function registerWorkflow(name: string, workflow: any) {
  mastra.getWorkflows()[name] = workflow;
  workflow.__registerMastra(mastra);
}
