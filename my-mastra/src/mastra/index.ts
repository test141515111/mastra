
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';

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
  deployer: new CloudflareDeployer({
    scope: 'mastra-account',
    projectName: 'mastra-playground',
    auth: {
      apiToken: process.env.CLOUDFLARE_API_TOKEN || 'dummy-token'
    }
  }),
});
