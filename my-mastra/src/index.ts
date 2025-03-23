import { config } from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createDynamicWorkflow } from './controllers/dynamic-workflow';
import { executeWorkflow } from './controllers/workflow-executor';
import { serveOAS, serveMastraPlayground, initializeJapanesePlayground } from './controllers/playground';

// Load environment variables
config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Set port
const port = process.env.PORT || 3001;

// Routes
app.get('/', (req, res) => {
  res.send('Mastra Dynamic Workflow API');
});

// Dynamic workflow creation endpoint
app.post('/api/dynamic-workflow', createDynamicWorkflow);

// Workflow execution endpoint
app.post('/api/workflows/:workflowName', executeWorkflow);

// API route for accessing OpenAPI Specification
app.get('/api/oas', serveOAS);

// Serve the playground UI
app.get('/playground', serveMastraPlayground);

// Initialize Japanese playground
app.post('/api/playground/initialize', initializeJapanesePlayground);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
