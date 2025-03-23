import { Workflow } from '@mastra/core';
import { z } from 'zod';
import { createZodSchema } from './schema';
import { generateStep } from './step-generator';
import { WorkflowDefinitionInput } from '../types';

/**
 * Generate a Mastra workflow from a workflow definition input
 */
export function generateWorkflow(workflowInput: WorkflowDefinitionInput) {
  // Create steps from step definitions
  const steps: Record<string, any> = {};
  workflowInput.steps.forEach(stepDef => {
    steps[stepDef.id] = generateStep(stepDef);
  });
  
  // Convert trigger schema to Zod schema
  const triggerSchema = createZodSchema(workflowInput.triggerSchema);
  
  // Create workflow
  const workflow = new Workflow({
    name: workflowInput.name,
    triggerSchema: triggerSchema as z.ZodObject<any>,
  });
  
  // Build a graph of step connections
  const connectionMap: Record<string, string[]> = {};
  workflowInput.connections.forEach(conn => {
    if (!connectionMap[conn.from]) {
      connectionMap[conn.from] = [];
    }
    connectionMap[conn.from].push(conn.to);
  });
  
  // Add steps to workflow based on connections
  const rootSteps = workflowInput.steps.filter(step => 
    !workflowInput.connections.some(conn => conn.to === step.id)
  );
  
  // Add root steps first
  rootSteps.forEach(rootStep => {
    workflow.step(steps[rootStep.id]);
    addConnectedSteps(workflow, rootStep.id, steps, connectionMap);
  });
  
  // Commit the workflow to finalize it
  workflow.commit();
  
  return workflow;
}

/**
 * Recursively add connected steps to a workflow
 */
function addConnectedSteps(
  workflow: any, 
  currentStepId: string, 
  steps: Record<string, any>, 
  connectionMap: Record<string, string[]>
) {
  if (connectionMap[currentStepId]) {
    connectionMap[currentStepId].forEach(nextStepId => {
      workflow.then(steps[nextStepId]);
      addConnectedSteps(workflow, nextStepId, steps, connectionMap);
    });
  }
}
