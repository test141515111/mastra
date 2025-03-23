import './api';
import { mastra } from './mastra';

console.log('mastra_クローン立ち上げ server started');
console.log('Mastra instance initialized:', {
  agentCount: Object.keys(mastra.getAgents()).length,
  workflowCount: Object.keys(mastra.getWorkflows()).length,
});
