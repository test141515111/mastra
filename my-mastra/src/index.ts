import express from 'express';
import { config } from 'dotenv';
import { z } from 'zod';
import { mastra } from './mastra';

// Load environment variables
config();

// Create Express app
const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;

// Root endpoint
app.get('/', (req, res) => {
  res.send('Mastra API is running');
});

// Import controllers
import { createDynamicWorkflow } from './controllers/dynamic-workflow';
import { executeWorkflow } from './controllers/workflow-executor';

// API route for creating dynamic workflows
app.post('/api/dynamic-workflow', (req, res) => createDynamicWorkflow(req, res));

// API route for executing dynamically created workflows
app.post('/api/workflows/:workflowName', (req, res) => executeWorkflow(req, res));

// Create API endpoints for workflows
// Note: We're not using event listeners since they're not available in this version
// Instead, we'll create endpoints when workflows are registered through our API

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app };
