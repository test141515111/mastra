import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';
import { generateTool } from '../utils/tool-generator';
import { generateAgent } from '../utils/agent-generator';
import { generateWorkflow } from '../utils/workflow-generator';
import { generateAllIndexFiles } from '../utils/index-generator';
import { updateMastraConfig } from '../utils/mastra-integrator';
import { mastra } from '../mastra';
import { DynamicWorkflowInput } from '../types';

/**
 * Controller for creating dynamic workflows from user input
 */
export async function createDynamicWorkflow(req: Request, res: Response): Promise<void> {
  try {
    const input: DynamicWorkflowInput = req.body;
    
    // Validate input
    if (!input.tools || !input.agents || !input.workflows) {
      res.status(400).json({ error: 'Invalid input: tools, agents, and workflows are required' });
      return;
    }
    
    // Generate tools, agents, and workflows
    const generatedTools: Record<string, any> = {};
    const generatedAgents: Record<string, any> = {};
    const generatedWorkflows: Record<string, any> = {};
    
    // Generate tools
    for (const toolInput of input.tools) {
      try {
        generatedTools[toolInput.id] = generateTool(toolInput);
      } catch (error: any) {
        console.error(`Error generating tool ${toolInput.id}:`, error);
        res.status(400).json({ error: `Error generating tool ${toolInput.id}: ${error.message}` });
        return;
      }
    }
    
    // Generate agents
    for (const agentInput of input.agents) {
      try {
        generatedAgents[agentInput.name] = generateAgent(agentInput, generatedTools);
      } catch (error: any) {
        console.error(`Error generating agent ${agentInput.name}:`, error);
        res.status(400).json({ error: `Error generating agent ${agentInput.name}: ${error.message}` });
        return;
      }
    }
    
    // Generate workflows
    for (const workflowInput of input.workflows) {
      try {
        generatedWorkflows[workflowInput.name] = generateWorkflow(workflowInput, generatedTools);
      } catch (error: any) {
        console.error(`Error generating workflow ${workflowInput.name}:`, error);
        res.status(400).json({ error: `Error generating workflow ${workflowInput.name}: ${error.message}` });
        return;
      }
    }
    
    // Create directories if they don't exist
    const basePath = path.resolve(process.cwd(), 'src/mastra');
    const toolsDir = path.join(basePath, 'tools');
    const agentsDir = path.join(basePath, 'agents');
    const workflowsDir = path.join(basePath, 'workflows');
    
    // Ensure directories exist
    [basePath, toolsDir, agentsDir, workflowsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // Write generated components to files
    for (const [id, tool] of Object.entries(generatedTools)) {
      const filePath = path.join(toolsDir, `${id}.ts`);
      const fileContent = `
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const ${id} = ${JSON.stringify(tool, null, 2)};
`;
      fs.writeFileSync(filePath, fileContent);
    }
    
    for (const [name, agent] of Object.entries(generatedAgents)) {
      const filePath = path.join(agentsDir, `${name.replace(/\s+/g, '-')}.ts`);
      const fileContent = `
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export const ${name.replace(/\s+/g, '_')} = ${JSON.stringify(agent, null, 2)};
`;
      fs.writeFileSync(filePath, fileContent);
    }
    
    for (const [name, workflow] of Object.entries(generatedWorkflows)) {
      const filePath = path.join(workflowsDir, `${name.replace(/\s+/g, '-')}.ts`);
      const fileContent = `
import { Workflow, Step } from '@mastra/core/workflows';
import { z } from 'zod';

export const ${name.replace(/\s+/g, '_')} = ${JSON.stringify(workflow, null, 2)};
`;
      fs.writeFileSync(filePath, fileContent);
    }
    
    // Generate index files for each directory and master index
    generateAllIndexFiles(basePath);
    
    // Register everything with Mastra
    updateMastraConfig(mastra, generatedWorkflows, generatedAgents);
    
    // Return success response with generated components
    res.status(201).json({
      message: 'Dynamic workflow created successfully',
      components: {
        tools: Object.keys(generatedTools),
        agents: Object.keys(generatedAgents),
        workflows: Object.keys(generatedWorkflows)
      }
    });
  } catch (error: any) {
    console.error('Error creating dynamic workflow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
