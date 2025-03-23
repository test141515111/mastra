import { createTool } from '@mastra/core';
import { z } from 'zod';
import { createZodSchema } from './schema';
import { ToolDefinitionInput } from '../types';

/**
 * Generate a Mastra tool from a tool definition input
 */
export function generateTool(toolInput: ToolDefinitionInput) {
  // Convert schema objects to Zod schemas
  const inputSchema = createZodSchema(toolInput.inputSchema);
  const outputSchema = createZodSchema(toolInput.outputSchema);
  
  // Create the execution function using Function constructor
  // Note: This approach has security implications and should be used with caution
  const executeFunction = new Function('{ context }', toolInput.executeLogic);
  
  // Create and return the tool
  return createTool({
    id: toolInput.id,
    description: toolInput.description,
    inputSchema,
    outputSchema,
    execute: async ({ context }) => {
      try {
        return await executeFunction({ context });
      } catch (error) {
        console.error(`Error executing tool ${toolInput.id}:`, error);
        throw error;
      }
    },
  });
}
