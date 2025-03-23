import { Step } from '@mastra/core';
import { z } from 'zod';
import { createZodSchema } from './schema';
import { StepDefinitionInput } from '../types';

/**
 * Generate a Mastra step from a step definition input
 */
export function generateStep(stepInput: StepDefinitionInput) {
  // Convert schema objects to Zod schemas
  const inputSchema = createZodSchema(stepInput.inputSchema);
  const outputSchema = createZodSchema(stepInput.outputSchema);
  
  // Create the execution function using Function constructor
  // Note: This approach has security implications and should be used with caution
  const executeFunction = new Function('{ context, mastra }', stepInput.executeLogic);
  
  // Create and return the step
  return new Step({
    id: stepInput.id,
    description: stepInput.description,
    inputSchema,
    outputSchema,
    execute: async ({ context, mastra }) => {
      try {
        return await executeFunction({ context, mastra });
      } catch (error) {
        console.error(`Error executing step ${stepInput.id}:`, error);
        throw error;
      }
    },
  });
}
