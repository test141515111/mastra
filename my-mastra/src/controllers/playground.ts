import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { mastra } from '../mastra';
import { createJapanesePlayground } from '../utils/mastra-integrator';

/**
 * Generate OpenAPI Specification for the dynamic workflow API
 */
export function generateOAS(): Record<string, any> {
  // Get agents and workflows from Mastra instance
  const agents = Object.keys(mastra.getAgents?.() || {}).map(name => ({
    name,
    description: 'AIエージェント'
  }));
  
  const workflows = Object.keys(mastra.getWorkflows?.() || {}).map(name => ({
    name,
    description: 'ワークフロー'
  }));
  
  return {
    openapi: '3.0.0',
    info: {
      title: 'Mastra 動的ワークフローAPI',
      version: '1.0.0',
      description: 'ユーザー入力から動的ワークフローとエージェントを作成するためのAPI',
    },
    paths: {
      '/api/dynamic-workflow': {
        post: {
          summary: '動的ワークフローの作成',
          description: 'ユーザー入力から動的にワークフローとエージェントを作成します',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DynamicWorkflowInput',
                },
              },
            },
          },
          responses: {
            '201': {
              description: '動的ワークフローが正常に作成されました',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Dynamic workflow created successfully'
                      },
                      components: {
                        type: 'object',
                        properties: {
                          tools: {
                            type: 'array',
                            items: {
                              type: 'string',
                            },
                          },
                          agents: {
                            type: 'array',
                            items: {
                              type: 'string',
                            },
                          },
                          workflows: {
                            type: 'array',
                            items: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: '無効な入力',
            },
            '500': {
              description: '内部サーバーエラー',
            },
          },
        },
      },
      '/api/workflows/{workflowName}': {
        post: {
          summary: 'ワークフローの実行',
          description: '指定されたワークフローを実行します',
          parameters: [
            {
              name: 'workflowName',
              in: 'path',
              required: true,
              schema: {
                type: 'string'
              },
              description: '実行するワークフローの名前'
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'ワークフローの入力パラメータ'
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'ワークフローが正常に実行されました',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    description: 'ワークフローの実行結果'
                  },
                },
              },
            },
            '404': {
              description: '指定されたワークフローが見つかりません',
            },
            '500': {
              description: '内部サーバーエラー',
            },
          },
        },
      },
    },
    components: {
      schemas: {
        DynamicWorkflowInput: {
          type: 'object',
          required: ['tools', 'agents', 'workflows'],
          properties: {
            tools: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ToolDefinitionInput',
              },
            },
            agents: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/AgentDefinitionInput',
              },
            },
            workflows: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/WorkflowDefinitionInput',
              },
            },
          },
        },
        ToolDefinitionInput: {
          type: 'object',
          required: ['id', 'description', 'inputSchema', 'outputSchema'],
          properties: {
            id: {
              type: 'string',
              description: 'ツールのID'
            },
            description: {
              type: 'string',
              description: 'ツールの説明'
            },
            inputSchema: {
              type: 'object',
              description: '入力スキーマ'
            },
            outputSchema: {
              type: 'object',
              description: '出力スキーマ'
            },
            executeCode: {
              type: 'string',
              description: '実行コード（オプション）'
            },
          },
        },
        AgentDefinitionInput: {
          type: 'object',
          required: ['name', 'instructions', 'modelProvider', 'modelName'],
          properties: {
            name: {
              type: 'string',
              description: 'エージェント名'
            },
            instructions: {
              type: 'string',
              description: 'エージェントの指示'
            },
            modelProvider: {
              type: 'string',
              enum: ['openai', 'anthropic'],
              description: 'モデルプロバイダー'
            },
            modelName: {
              type: 'string',
              description: 'モデル名'
            },
            tools: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'エージェントが使用するツールのID'
            },
          },
        },
        WorkflowDefinitionInput: {
          type: 'object',
          required: ['name', 'triggerSchema', 'steps'],
          properties: {
            name: {
              type: 'string',
              description: 'ワークフロー名'
            },
            description: {
              type: 'string',
              description: 'ワークフローの説明'
            },
            triggerSchema: {
              type: 'object',
              description: 'トリガースキーマ'
            },
            steps: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/StepDefinitionInput',
              },
              description: 'ワークフローのステップ'
            },
          },
        },
        StepDefinitionInput: {
          type: 'object',
          required: ['id', 'description', 'inputSchema', 'executeCode'],
          properties: {
            id: {
              type: 'string',
              description: 'ステップID'
            },
            description: {
              type: 'string',
              description: 'ステップの説明'
            },
            inputSchema: {
              type: 'object',
              description: '入力スキーマ'
            },
            executeCode: {
              type: 'string',
              description: '実行コード'
            },
          },
        },
      },
    },
  };
}

/**
 * Serve the OpenAPI Specification
 */
export function serveOAS(req: Request, res: Response): void {
  const oas = generateOAS();
  
  // CORSヘッダーを手動で設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  res.json(oas);
}

/**
 * Serve the Playground UI
 */
export function serveMastraPlayground(req: Request, res: Response): void {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Mastra 動的ワークフロー プレイグラウンド</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", Meiryo, "メイリオ", "MS PGothic", "ＭＳ Ｐゴシック", sans-serif;
          background-color: #f8f9fa;
          color: #333;
        }
        .header {
          background-color: #212529;
          color: white;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .content {
          flex: 1;
          padding: 1.5rem;
          background-color: #fff;
          border-radius: 8px;
          margin: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .footer {
          background-color: #212529;
          color: #f8f9fa;
          padding: 1rem;
          text-align: center;
        }
        .swagger-ui .opblock-tag {
          font-family: "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", Meiryo, "メイリオ", sans-serif;
        }
        .swagger-ui .opblock .opblock-summary-operation-id, 
        .swagger-ui .opblock .opblock-summary-path, 
        .swagger-ui .opblock .opblock-summary-description {
          font-family: "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", Meiryo, "メイリオ", sans-serif;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Mastra 動的ワークフロー プレイグラウンド</h1>
          <p>動的ワークフローとエージェントの作成と管理</p>
        </div>
        <div class="content">
          <div id="swagger-ui"></div>
        </div>
        <div class="footer">
          <p>Mastra フレームワーク - 動的ワークフローとエージェント作成API</p>
        </div>
      </div>
      <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
      <script>
        window.onload = function() {
          // 認証情報を抽出するためのURLパース
          const url = new URL(window.location.href);
          const username = url.username;
          const password = url.password;
          
          // 認証情報なしでOASを取得するためのURLを構築
          const oasUrl = window.location.origin + '/api/oas';
          
          const ui = SwaggerUIBundle({
            url: oasUrl,
            dom_id: "#swagger-ui",
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout",
            defaultModelsExpandDepth: 3,
            docExpansion: "list",
            requestInterceptor: (req) => {
              // 必要に応じて認証情報をヘッダーに追加
              if (username && password) {
                const auth = btoa(username + ':' + password);
                req.headers.Authorization = 'Basic ' + auth;
              }
              return req;
            }
          });
          window.ui = ui;
        };
      </script>
    </body>
    </html>
  `;
  
  res.send(html);
}

/**
 * Initialize the Japanese playground
 */
export function initializeJapanesePlayground(req: Request, res: Response): void {
  try {
    const basePath = path.resolve(process.cwd(), 'src/mastra');
    createJapanesePlayground(basePath);
    res.json({ success: true, message: 'プレイグラウンドが初期化されました' });
  } catch (error: any) {
    console.error('プレイグラウンド初期化エラー:', error);
    res.status(500).json({ error: `プレイグラウンド初期化エラー: ${error.message}` });
  }
}
