import { Mastra, createLogger } from '@mastra/core';

// Initialize Mastra instance
export const mastra = new Mastra({
  agents: {},
  workflows: {},
  logger: createLogger({
    name: 'Mastra Dynamic Workflow',
    level: 'info',
  }),
});
