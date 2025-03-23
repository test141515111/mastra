import express from 'express';
import { createDynamicWorkflow } from './dynamic-workflow';
import { executeWorkflow } from './workflow-executor';

// Create router
const router = express.Router();

// API route for creating dynamic workflows
router.post('/dynamic-workflow', createDynamicWorkflow);

// API route for executing workflows by name
router.post('/workflows/:workflowName', executeWorkflow);

export const dynamicWorkflowRoutes = router;
