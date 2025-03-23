import { Request, Response } from 'express';
import { mastra } from '../mastra';

/**
 * Execute a workflow by name with the provided trigger data
 */
export async function executeWorkflow(req: Request, res: Response) {
  try {
    const { workflowName } = req.params;
    const triggerData = req.body;
    
    // Normalize workflow name from URL format
    const normalizedName = workflowName.replace(/-/g, ' ').split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Get the workflow from the Mastra instance
    const workflow = mastra.workflows[normalizedName];
    
    if (!workflow) {
      return res.status(404).json({
        error: `Workflow '${normalizedName}' not found`
      });
    }
    
    // Execute the workflow
    try {
      const { start } = workflow.createRun();
      const result = await start(triggerData);
      
      // Return the workflow execution result
      return res.status(200).json({
        success: true,
        workflowName: normalizedName,
        result,
      });
    } catch (error) {
      console.error(`Error during workflow execution:`, error);
      return res.status(400).json({
        error: `Workflow execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  } catch (error) {
    console.error(`Error executing workflow:`, error);
    return res.status(500).json({
      error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}
