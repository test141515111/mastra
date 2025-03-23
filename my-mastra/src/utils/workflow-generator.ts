import { Workflow, Step } from '@mastra/core';
import { z } from 'zod';
import { createZodSchema } from './schema';
import { WorkflowDefinitionInput, StepDefinitionInput } from '../types';

/**
 * Generate a step from a step definition input
 */
function generateStep(stepInput: StepDefinitionInput) {
  // Create input schema using Zod
  const inputSchema = createZodSchema(stepInput.inputSchema);
  
  // Create dynamic execute function
  let executeFn;
  try {
    // Use Function constructor to create dynamic function
    // Note: This has security implications and should be used with caution
    executeFn = new Function('context', 'mastra', stepInput.executeCode);
  } catch (error) {
    throw new Error(`Error creating execute function for step ${stepInput.id}: ${error.message}`);
  }
  
  // Create and return the step
  return new Step({
    id: stepInput.id,
    description: stepInput.description,
    inputSchema,
    execute: async (context) => {
      try {
        // Pass the context to the execute function
        return await executeFn(context.context, context.mastra);
      } catch (error) {
        console.error(`Error executing step ${stepInput.id}:`, error);
        throw error;
      }
    },
  });
}

/**
 * Generate a workflow from a workflow definition input
 */
export function generateWorkflow(workflowInput: WorkflowDefinitionInput, tools: Record<string, any> = {}) {
  // Create trigger schema using Zod
  const triggerSchema = createZodSchema(workflowInput.triggerSchema);
  
  // Create workflow
  const workflow = new Workflow({
    name: workflowInput.name,
    // Note: description is passed separately in newer Mastra versions
    triggerSchema,
  });
  
  // Set description if provided
  if (workflowInput.description) {
    // @ts-ignore - Handle description separately if needed
    workflow.description = workflowInput.description;
  }
  
  // Add steps to workflow
  for (const stepInput of workflowInput.steps) {
    const step = generateStep(stepInput);
    workflow.step(step);
  }
  
  // Commit workflow
  workflow.commit();
  
  return workflow;
}
