
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent, articleAgent, imageGenerationAgent } from './agents';

export const mastra = new Mastra({
  agents: { 
    weatherAgent,
    articleAgent,
    imageGenerationAgent
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
