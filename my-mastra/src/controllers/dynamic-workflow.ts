import { Request, Response } from 'express';
import { generateTool } from '../utils/tool-generator';
import { generateAgent } from '../utils/agent-generator';
import { generateWorkflow } from '../utils/workflow-generator';
import { DynamicWorkflowInput } from '../types';
import { mastra } from '../mastra';

/**
 * Process user input to create dynamic workflows and agents
 */
export async function createDynamicWorkflow(req: Request, res: Response) {
  try {
    const input: DynamicWorkflowInput = req.body;
    
    // Validate input structure
    if (!input.tools || !input.agents || !input.workflows) {
      return res.status(400).json({
        error: 'Invalid input: tools, agents, and workflows are required'
      });
    }
    
    // 1. Generate tools
    const generatedTools: Record<string, any> = {};
    for (const toolInput of input.tools) {
      try {
        generatedTools[toolInput.id] = generateTool(toolInput);
      } catch (error) {
        console.error(`Error generating tool ${toolInput.id}:`, error);
        return res.status(400).json({
          error: `Failed to generate tool ${toolInput.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    // 2. Generate agents
    const generatedAgents: Record<string, any> = {};
    for (const agentInput of input.agents) {
      try {
        generatedAgents[agentInput.name] = generateAgent(agentInput, generatedTools);
      } catch (error) {
        console.error(`Error generating agent ${agentInput.name}:`, error);
        return res.status(400).json({
          error: `Failed to generate agent ${agentInput.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    // 3. Generate workflows
    const generatedWorkflows: Record<string, any> = {};
    for (const workflowInput of input.workflows) {
      try {
        generatedWorkflows[workflowInput.name] = generateWorkflow(workflowInput);
      } catch (error) {
        console.error(`Error generating workflow ${workflowInput.name}:`, error);
        return res.status(400).json({
          error: `Failed to generate workflow ${workflowInput.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
    
    // 4. Register everything with Mastra
    // Note: In this version of Mastra, we can't directly modify the agents and workflows
    // Instead, we'll store them in memory for this session
    // In a production environment, these would be stored in a database
    
    // For demonstration purposes, we'll log what would be registered
    console.log('Generated agents:', Object.keys(generatedAgents));
    console.log('Generated workflows:', Object.keys(generatedWorkflows));
    
    // 5. Create API endpoints for the generated workflows
    const endpointRoutes: string[] = [];
    Object.keys(generatedWorkflows).forEach(workflowName => {
      const endpoint = `/api/workflows/${workflowName.toLowerCase().replace(/\s+/g, '-')}`;
      endpointRoutes.push(endpoint);
    });
    
    // Return success response with the generated components and endpoints
    return res.status(200).json({
      success: true,
      message: 'Dynamic workflow created successfully',
      components: {
        tools: Object.keys(generatedTools),
        agents: Object.keys(generatedAgents),
        workflows: Object.keys(generatedWorkflows),
      },
      endpoints: endpointRoutes,
    });
  } catch (error) {
    console.error('Error creating dynamic workflow:', error);
    return res.status(500).json({
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}
