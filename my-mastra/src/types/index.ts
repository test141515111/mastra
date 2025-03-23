import { z } from 'zod';

/**
 * Schema definition for dynamic tool creation
 */
export interface SchemaDefinition {
  type: string;
  properties?: Record<string, SchemaDefinition>;
  items?: SchemaDefinition;
  required?: string[];
  description?: string;
}

/**
 * Input for tool definition
 */
export interface ToolDefinitionInput {
  id: string;
  description: string;
  inputSchema: SchemaDefinition;
  outputSchema: SchemaDefinition;
  executeCode?: string;
}

/**
 * Input for agent definition
 */
export interface AgentDefinitionInput {
  name: string;
  instructions: string;
  modelProvider: 'openai' | 'anthropic';
  modelName: string;
  tools?: string[];
}

/**
 * Input for step definition
 */
export interface StepDefinitionInput {
  id: string;
  description: string;
  inputSchema: SchemaDefinition;
  executeCode: string;
}

/**
 * Input for workflow definition
 */
export interface WorkflowDefinitionInput {
  name: string;
  description?: string;
  triggerSchema: SchemaDefinition;
  steps: StepDefinitionInput[];
}

/**
 * Complete input for dynamic workflow creation
 */
export interface DynamicWorkflowInput {
  tools: ToolDefinitionInput[];
  agents: AgentDefinitionInput[];
  workflows: WorkflowDefinitionInput[];
}
