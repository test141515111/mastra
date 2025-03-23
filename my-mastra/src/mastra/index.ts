
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent, articleAgent } from './agents';

export const mastra = new Mastra({
  agents: { 
    weatherAgent,
    articleAgent 
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
