import { z } from 'zod';

// Define the schema for user input
export const userInputSchema = z.object({
  intention: z.string().describe('The general purpose of the workflow or agent'),
  requirements: z.array(z.string()).describe('Specific requirements or capabilities needed'),
  inputSchema: z.string().optional().describe('JSON schema for input data'),
  outputSchema: z.string().optional().describe('JSON schema for output data'),
});

export type UserInput = z.infer<typeof userInputSchema>;

// Parse user text input to extract structured information
export async function parseUserInput(inputText: string): Promise<UserInput> {
  try {
    // For now, we're assuming the input is already in JSON format
    // In a real implementation, this might use an LLM to parse unstructured text
    const parsedInput = JSON.parse(inputText);
    return userInputSchema.parse(parsedInput);
  } catch (error) {
    throw new Error(`Failed to parse user input: ${error}`);
  }
}

// Generate a unique ID based on timestamp and random string
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
