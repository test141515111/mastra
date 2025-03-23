import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import { z } from 'zod';

import { mastra, registerAgent, registerWorkflow } from '../mastra';
import { parseUserInput } from '../mastra/utils/parser';
import { generateAgentFromUserInput } from '../mastra/utils/agent-generator';
import { generateWorkflowFromUserInput } from '../mastra/utils/workflow-generator';

config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3001;

// API endpoint to create an agent from user input
app.post('/api/create-agent', async (req: Request, res: Response) => {
  try {
    const inputText = req.body?.input;
    
    if (!inputText) {
      return res.status(400).json({ error: 'Input text is required' });
    }
    
    // Parse the user input
    const userInput = await parseUserInput(inputText);
    
    // Generate the agent
    const { agent, tools } = generateAgentFromUserInput(userInput);
    
    // Register the agent with Mastra
    const agentId = agent.name;
    registerAgent(agentId, agent);
    
    return res.status(201).json({
      agentId,
      message: 'Agent created successfully',
      tools: tools.map(t => t.id),
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return res.status(500).json({ error: `Failed to create agent: ${error.message}` });
  }
});

// API endpoint to create a workflow from user input
app.post('/api/create-workflow', async (req: Request, res: Response) => {
  try {
    const inputText = req.body?.input;
    
    if (!inputText) {
      return res.status(400).json({ error: 'Input text is required' });
    }
    
    // Parse the user input
    const userInput = await parseUserInput(inputText);
    
    // Generate the workflow
    const workflow = generateWorkflowFromUserInput(userInput);
    
    // Register the workflow with Mastra
    const workflowId = workflow.name;
    registerWorkflow(workflowId, workflow);
    
    return res.status(201).json({
      workflowId,
      message: 'Workflow created successfully',
    });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return res.status(500).json({ error: `Failed to create workflow: ${error.message}` });
  }
});

// API endpoint to execute a workflow
app.post('/api/execute-workflow/:workflowId', async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.params;
    const triggerData = req.body;
    
    // Get the workflow
    const workflow = mastra.getWorkflow(workflowId);
    
    // Execute the workflow
    const { start } = workflow.createRun();
    const result = await start({ triggerData });
    
    return res.json(result);
  } catch (error) {
    console.error('Error executing workflow:', error);
    return res.status(500).json({ error: `Failed to execute workflow: ${error.message}` });
  }
});

// API endpoint to use an agent
app.post('/api/use-agent/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const { messages, outputSchema } = req.body;
    
    if (!messages) {
      return res.status(400).json({ error: 'Messages are required' });
    }
    
    // Get the agent
    const agent = mastra.getAgent(agentId);
    
    // Execute the agent
    const result = await agent.generate(messages, {
      output: outputSchema ? z.any() : undefined,
    });
    
    return res.json(result);
  } catch (error) {
    console.error('Error using agent:', error);
    return res.status(500).json({ error: `Failed to use agent: ${error.message}` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
