import { Step, Workflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { UserInput, generateId } from './parser';
import { stringToZodSchema } from './tool-generator';

// Generate a workflow from user input
export function generateWorkflowFromUserInput(userInput: UserInput) {
  // Create a trigger schema from the input schema
  const triggerSchema = userInput.inputSchema 
    ? stringToZodSchema(userInput.inputSchema) 
    : z.object({});
  
  // Create a workflow
  const workflow = new Workflow({
    name: generateId('workflow'),
    triggerSchema,
  });
  
  // Create a simple step based on user requirements
  const step = new Step({
    id: 'processInput',
    execute: async ({ context, mastra }) => {
      // Use an agent to process the input if available
      const agent = mastra.getAgent('dynamicAgent');
      if (agent) {
        const result = await agent.generate(
          [`Process this input: ${JSON.stringify(context.triggerData)}`],
          {
            output: userInput.outputSchema 
              ? stringToZodSchema(userInput.outputSchema) 
              : z.any(),
          }
        );
        return { result: result.object };
      }
      return { result: context.triggerData };
    },
  });
  
  // Add the step to the workflow
  workflow.step(step).commit();
  
  return workflow;
}
