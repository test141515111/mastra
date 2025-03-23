import { z } from 'zod';

// Tool definition input
export interface ToolDefinitionInput {
  id: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  executeLogic: string;
}

// Agent definition input
export interface AgentDefinitionInput {
  name: string;
  instructions: string;
  model: string;
  tools: string[];
}

// Step definition input
export interface StepDefinitionInput {
  id: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  executeLogic: string;
}

// Workflow definition input
export interface WorkflowDefinitionInput {
  name: string;
  triggerSchema: Record<string, any>;
  steps: StepDefinitionInput[];
  connections: Array<{
    from: string;
    to: string;
  }>;
}

// Complete API input schema
export interface DynamicWorkflowInput {
  tools: ToolDefinitionInput[];
  agents: AgentDefinitionInput[];
  workflows: WorkflowDefinitionInput[];
}

// User input schema
export interface UserInputSchema {
  userInput: string;
}

// Workflow execution input
export interface WorkflowExecutionInput {
  workflowId: string;
  input: Record<string, any>;
}
