import { Mastra } from '@mastra/core';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Update Mastra instance with dynamically generated components
 * @param mastra - Mastra instance to update
 * @param workflows - Record of workflows to register
 * @param agents - Record of agents to register
 */
export function updateMastraConfig(
  mastra: Mastra, 
  workflows: Record<string, any>, 
  agents: Record<string, any>
): void {
  // Generate configuration file instead of directly modifying Mastra instance
  // In a real implementation, we would need to use the proper Mastra API
  // This is a simplified version for demonstration purposes
  console.log(`Registering ${Object.keys(workflows).length} workflows and ${Object.keys(agents).length} agents`);
  
  // Note: In a real implementation, we would use mastra.registerWorkflow() and mastra.registerAgent()
  // or similar methods if they exist in the Mastra API
  
  // Generate configuration file
  const configPath = path.resolve(process.cwd(), 'src/mastra/config.ts');
  
  const workflowsStr = Object.keys(workflows)
    .map(name => `  ${name.replace(/\s+/g, '_')},`)
    .join('\n');
    
  const agentsStr = Object.keys(agents)
    .map(name => `  ${name.replace(/\s+/g, '_')},`)
    .join('\n');
  
  const content = `
import { Mastra } from '@mastra/core';
import { createLogger } from '@mastra/core/logger';

// Import generated components
import * as workflows from './workflows';
import * as agents from './agents';

/**
 * Mastra設定ファイル
 * 動的に生成されたエージェントとワークフローを含む
 */
export const dynamicMastra = new Mastra({
  workflows: {
${workflowsStr}
  },
  agents: {
${agentsStr}
  },
  logger: createLogger({
    name: 'DynamicMastra',
    level: 'info',
  }),
});
`;
  
  fs.writeFileSync(configPath, content);
  console.log(`Generated Mastra configuration file at ${configPath}`);
}

/**
 * Create a Japanese playground controller for Mastra
 * @param basePath - Base path to the Mastra project
 */
export function createJapanesePlayground(basePath: string): void {
  const playgroundDir = path.join(basePath, 'playground');
  
  // Create playground directory if it doesn't exist
  if (!fs.existsSync(playgroundDir)) {
    fs.mkdirSync(playgroundDir, { recursive: true });
  }
  
  // Create playground page
  const pagePath = path.join(playgroundDir, 'page.tsx');
  const pageContent = `
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PlaygroundPage() {
  const [selectedAgent, setSelectedAgent] = useState('openai');
  const [agentInfo, setAgentInfo] = useState({
    name: 'OpenAI Chat Agent',
    model: 'gpt-3.5-turbo',
    description: '日本語でユーザーの質問に回答するAIアシスタント'
  });

  const handleAgentChange = (agent: string) => {
    setSelectedAgent(agent);
    if (agent === 'openai') {
      setAgentInfo({
        name: 'OpenAI Chat Agent',
        model: 'gpt-3.5-turbo',
        description: '日本語でユーザーの質問に回答するAIアシスタント'
      });
    } else if (agent === 'claude') {
      setAgentInfo({
        name: 'Claude Chat Agent',
        model: 'claude-3-5-sonnet-20241022',
        description: 'Claude 3.5 Sonnetを使用した日本語対応AIアシスタント'
      });
    } else {
      setAgentInfo({
        name: 'ユーザー定義エージェント',
        model: 'claude-3-5-sonnet-20241022',
        description: 'ユーザー入力から動的に生成されたAIアシスタント'
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <header className="mb-8 w-full max-w-5xl">
        <h1 className="mb-2 text-3xl font-bold">Mastraプレイグラウンド</h1>
        <p className="text-gray-600">エージェントとワークフローの管理インターフェース</p>
      </header>

      <main className="w-full max-w-5xl">
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* エージェント選択パネル */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">エージェント</h2>
            <div className="space-y-2">
              <button
                className={\`w-full rounded-md p-2 text-left \${
                  selectedAgent === 'openai' ? 'bg-blue-100' : 'hover:bg-gray-100'
                }\`}
                onClick={() => handleAgentChange('openai')}
              >
                OpenAI Chat Agent
              </button>
              <button
                className={\`w-full rounded-md p-2 text-left \${
                  selectedAgent === 'claude' ? 'bg-blue-100' : 'hover:bg-gray-100'
                }\`}
                onClick={() => handleAgentChange('claude')}
              >
                Claude Chat Agent
              </button>
              <button
                className={\`w-full rounded-md p-2 text-left \${
                  selectedAgent === 'dynamic' ? 'bg-blue-100' : 'hover:bg-gray-100'
                }\`}
                onClick={() => handleAgentChange('dynamic')}
              >
                ユーザー定義エージェント
              </button>
            </div>
          </div>

          {/* エージェント詳細パネル */}
          <div className="col-span-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">{agentInfo.name}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">モデル</p>
                <p>{agentInfo.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">説明</p>
                <p>{agentInfo.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">ステータス</p>
                <p className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800">
                  アクティブ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ワークフローパネル */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">ワークフロー</h2>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="bg-gray-50 p-3">
              <h3 className="font-medium">チャットワークフロー</h3>
              <p className="text-sm text-gray-500">ユーザーのメッセージを処理し、AIアシスタントからの応答を生成します</p>
            </div>
            <div className="p-3">
              <div className="mb-2 flex items-center">
                <div className="mr-2 h-6 w-6 rounded-full bg-blue-100 text-center text-sm font-medium text-blue-800">1</div>
                <div>
                  <p className="font-medium">メッセージ処理</p>
                  <p className="text-sm text-gray-500">ユーザーメッセージを処理します</p>
                </div>
              </div>
              <div className="mb-2 ml-3 border-l-2 border-gray-200 pl-5">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-6 w-6 rounded-full bg-blue-100 text-center text-sm font-medium text-blue-800">2</div>
                <div>
                  <p className="font-medium">レスポンス生成</p>
                  <p className="text-sm text-gray-500">AIアシスタントからの応答を生成します</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* APIエンドポイントパネル */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">APIエンドポイント</h2>
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm font-medium text-gray-500">チャットエンドポイント</p>
              <div className="flex items-center rounded-md bg-gray-50 p-2">
                <code className="flex-1 text-sm">POST /api/chat</code>
                <button className="ml-2 rounded-md bg-gray-200 px-2 py-1 text-xs">コピー</button>
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-gray-500">ワークフローエンドポイント</p>
              <div className="flex items-center rounded-md bg-gray-50 p-2">
                <code className="flex-1 text-sm">POST /api/workflow</code>
                <button className="ml-2 rounded-md bg-gray-200 px-2 py-1 text-xs">コピー</button>
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-gray-500">動的ワークフロー作成エンドポイント</p>
              <div className="flex items-center rounded-md bg-gray-50 p-2">
                <code className="flex-1 text-sm">POST /api/dynamic-workflow</code>
                <button className="ml-2 rounded-md bg-gray-200 px-2 py-1 text-xs">コピー</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8">
        <Link href="/" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          チャットインターフェースに戻る
        </Link>
      </footer>
    </div>
  );
}
`;
  
  fs.writeFileSync(pagePath, pageContent);
  console.log(`Generated Japanese playground page at ${pagePath}`);
  
  // Create API route for OAS
  const apiDir = path.join(basePath, 'api');
  const oasDir = path.join(apiDir, 'oas');
  
  // Create API directories if they don't exist
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  if (!fs.existsSync(oasDir)) {
    fs.mkdirSync(oasDir, { recursive: true });
  }
  
  // Create OAS route
  const oasRoutePath = path.join(oasDir, 'route.ts');
  const oasRouteContent = `
import { NextResponse } from 'next/server';
import { mastra } from '../../mastra';

/**
 * OpenAPI仕様を生成するエンドポイント
 */
export async function GET() {
  try {
    // Mastraインスタンスからエージェントとワークフローの情報を取得
    const agents = Object.keys(mastra.agents || {}).map(name => ({
      name,
      description: mastra.agents[name].instructions?.substring(0, 100) + '...' || '説明なし'
    }));
    
    const workflows = Object.keys(mastra.workflows || {}).map(name => ({
      name,
      description: mastra.workflows[name].description || '説明なし',
      steps: mastra.workflows[name].steps?.length || 0
    }));
    
    // OpenAPI仕様を生成
    const oas = {
      openapi: '3.0.0',
      info: {
        title: 'Mastra API',
        version: '1.0.0',
        description: 'Mastraフレームワークで生成されたAPIエンドポイント'
      },
      paths: {
        '/api/chat': {
          post: {
            summary: 'チャットエンドポイント',
            description: 'AIエージェントとチャットするためのエンドポイント',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        description: 'ユーザーメッセージ'
                      },
                      model: {
                        type: 'string',
                        description: 'モデル名（openai, claude）',
                        default: 'openai'
                      }
                    },
                    required: ['message']
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'AIからの応答',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        response: {
                          type: 'string',
                          description: 'AIからの応答メッセージ'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/api/workflow': {
          post: {
            summary: 'ワークフロー実行エンドポイント',
            description: '定義済みワークフローを実行するためのエンドポイント',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        description: 'ユーザーメッセージ'
                      },
                      model: {
                        type: 'string',
                        description: 'モデル名（openai, claude）',
                        default: 'openai'
                      }
                    },
                    required: ['message']
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'ワークフロー実行結果',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        response: {
                          type: 'string',
                          description: 'ワークフロー実行結果'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        '/api/dynamic-workflow': {
          post: {
            summary: '動的ワークフロー作成エンドポイント',
            description: 'ユーザー入力から動的にワークフローとエージェントを作成するエンドポイント',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      tools: {
                        type: 'array',
                        description: 'ツール定義の配列',
                        items: {
                          type: 'object'
                        }
                      },
                      agents: {
                        type: 'array',
                        description: 'エージェント定義の配列',
                        items: {
                          type: 'object'
                        }
                      },
                      workflows: {
                        type: 'array',
                        description: 'ワークフロー定義の配列',
                        items: {
                          type: 'object'
                        }
                      }
                    },
                    required: ['tools', 'agents', 'workflows']
                  }
                }
              }
            },
            responses: {
              '201': {
                description: '動的ワークフロー作成結果',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          description: '成功メッセージ'
                        },
                        components: {
                          type: 'object',
                          properties: {
                            tools: {
                              type: 'array',
                              items: {
                                type: 'string'
                              }
                            },
                            agents: {
                              type: 'array',
                              items: {
                                type: 'string'
                              }
                            },
                            workflows: {
                              type: 'array',
                              items: {
                                type: 'string'
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        schemas: {
          Agent: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'エージェント名'
              },
              description: {
                type: 'string',
                description: 'エージェントの説明'
              }
            }
          },
          Workflow: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'ワークフロー名'
              },
              description: {
                type: 'string',
                description: 'ワークフローの説明'
              },
              steps: {
                type: 'integer',
                description: 'ステップ数'
              }
            }
          }
        }
      }
    };
    
    // エージェントとワークフローの情報を追加
    return NextResponse.json({
      oas,
      agents,
      workflows
    });
  } catch (error: any) {
    console.error('OAS生成エラー:', error);
    return NextResponse.json(
      { error: 'OAS生成エラー' },
      { status: 500 }
    );
  }
}
`;
  
  fs.writeFileSync(oasRoutePath, oasRouteContent);
  console.log(`Generated OAS route at ${oasRoutePath}`);
}
