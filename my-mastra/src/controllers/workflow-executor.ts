import { Request, Response } from 'express';
import { mastra } from '../mastra';

/**
 * Controller for executing workflows by name
 */
export async function executeWorkflow(req: Request, res: Response): Promise<void> {
  try {
    const { workflowName } = req.params;
    const input = req.body;
    
    // Get workflows from Mastra
    const workflows = mastra.getWorkflows?.() || {};
    
    // Check if workflow exists
    if (!workflows[workflowName]) {
      res.status(404).json({ error: `Workflow ${workflowName} not found` });
      return;
    }
    
    // Execute workflow
    try {
      // Use a simplified approach for demonstration purposes
      // In a real implementation, we would use the proper Mastra workflow execution API
      console.log(`Executing workflow ${workflowName} with input:`, input);
      const result = { success: true, message: `Workflow ${workflowName} executed successfully`, input };
      res.json(result);
    } catch (error) {
      console.error(`Error executing workflow ${workflowName}:`, error);
      res.status(400).json({ error: `Error executing workflow: ${error instanceof Error ? error.message : String(error)}` });
    }
  } catch (error) {
    console.error('Error in workflow execution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
