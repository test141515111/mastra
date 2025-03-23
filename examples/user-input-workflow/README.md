# mastra_クローン立ち上げ

Dynamic workflow and agent creation API for Mastra.

## Overview

This example demonstrates how to build an API that can:
1. Parse user input to extract intent and requirements
2. Dynamically generate tools based on requirements
3. Create agents with appropriate instructions and tools
4. Build workflows with defined steps
5. Register all components with Mastra
6. Expose API endpoints for using the generated components

## API Endpoints

- `POST /api/create-agent` - Create a new agent from user input
- `POST /api/create-workflow` - Create a new workflow from user input
- `POST /api/execute-workflow/:workflowId` - Execute a workflow
- `POST /api/use-agent/:agentId` - Use an agent

## Example Usage

### Creating an Agent

```bash
curl -X POST http://localhost:3001/api/create-agent \
  -H "Content-Type: application/json" \
  -d '{
    "input": "{\"intention\":\"Search and summarize information\",\"requirements\":[\"Search the web\",\"Summarize text\"],\"inputSchema\":\"{\\\"query\\\":\\\"string\\\",\\\"maxResults\\\":\\\"number\\\"}\"}"
  }'
```

### Creating a Workflow

```bash
curl -X POST http://localhost:3001/api/create-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "input": "{\"intention\":\"Process data and generate report\",\"requirements\":[\"Parse data\",\"Generate summary\"],\"inputSchema\":\"{\\\"data\\\":\\\"string\\\"}\"}"
  }'
```
