import { createTool } from '@mastra/core';
import { z } from 'zod';
import { createZodSchema } from './schema';
import { ToolDefinitionInput } from '../types';

/**
 * Generate a tool from a tool definition input
 */
export function generateTool(toolInput: ToolDefinitionInput) {
  // Create input and output schemas using Zod
  const inputSchema = createZodSchema(toolInput.inputSchema);
  const outputSchema = createZodSchema(toolInput.outputSchema);
  
  // Create dynamic execute function if provided
  let executeFn;
  if (toolInput.executeCode) {
    try {
      // Use Function constructor to create dynamic function
      // Note: This has security implications and should be used with caution
      executeFn = new Function('context', toolInput.executeCode);
    } catch (error) {
      throw new Error(`Error creating execute function for tool ${toolInput.id}: ${error.message}`);
    }
  } else {
    // Default execute function
    executeFn = async ({ context }: { context: any }) => {
      console.log(`Executing tool ${toolInput.id} with context:`, context);
      return { result: 'Tool execution successful' };
    };
  }
  
  // Create and return the tool
  return createTool({
    id: toolInput.id,
    description: toolInput.description,
    inputSchema,
    outputSchema,
    execute: async ({ context }: { context: any }) => {
      try {
        return await executeFn({ context });
      } catch (error) {
        console.error(`Error executing tool ${toolInput.id}:`, error);
        throw error;
      }
    },
  });
}
