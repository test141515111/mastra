import { z } from 'zod';
import { createTool } from '@mastra/core/tools';
import { parseUserInput, UserInput, generateId } from './parser';

// Convert a string to a zod schema
export function stringToZodSchema(schemaStr: string): z.ZodType<any> {
  try {
    // Basic implementation - in production, this would be more sophisticated
    const schemaObj = JSON.parse(schemaStr);
    return z.object(
      Object.entries(schemaObj).reduce((acc, [key, type]) => {
        if (type === 'string') acc[key] = z.string();
        else if (type === 'number') acc[key] = z.number();
        else if (type === 'boolean') acc[key] = z.boolean();
        else acc[key] = z.any();
        return acc;
      }, {})
    );
  } catch (error) {
    console.error('Failed to parse schema string:', error);
    return z.any();
  }
}

// Generate a tool based on user requirements
export function generateTool(toolSpec: {
  id: string;
  description: string;
  inputSchemaStr?: string;
  outputSchemaStr?: string;
}) {
  const { id, description, inputSchemaStr, outputSchemaStr } = toolSpec;
  
  const inputSchema = inputSchemaStr ? stringToZodSchema(inputSchemaStr) : undefined;
  const outputSchema = outputSchemaStr ? stringToZodSchema(outputSchemaStr) : undefined;
  
  return createTool({
    id,
    description,
    inputSchema,
    outputSchema,
    execute: async ({ context }) => {
      // This is a placeholder implementation
      // In a real scenario, this would contain actual business logic
      console.log(`Executing tool ${id} with context:`, context);
      return { result: `Executed ${id} successfully` };
    },
  });
}

// Generate tools from user input
export function generateToolsFromUserInput(
  userInput: UserInput
): Array<ReturnType<typeof createTool>> {
  // Extract tool requirements from user input
  const toolRequirements = userInput.requirements.filter(req => 
    req.toLowerCase().includes('tool') || 
    req.toLowerCase().includes('function')
  );
  
  return toolRequirements.map((requirement, index) => {
    return generateTool({
      id: generateId(`tool-${index}`),
      description: requirement,
      inputSchemaStr: userInput.inputSchema,
      outputSchemaStr: userInput.outputSchema,
    });
  });
}
