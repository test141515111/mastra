# Dynamic Workflow & Agent API for Mastra

このプロジェクトは、ユーザー入力に基づいてワークフローとエージェントを動的に作成するAPIを実装しています。

## 概要

このAPIは以下の機能を提供します：
- 入力/出力スキーマと実行ロジックを持つカスタムツールの作成
- 指示とツールを持つカスタムエージェントの作成
- ステップと接続を持つカスタムワークフローの作成
- 作成されたワークフロー用のAPIエンドポイントの自動生成

## 始め方

### インストール

```bash
npm install
```

### サーバーの実行

```bash
npm start
```

サーバーは http://localhost:3001 で利用可能になります。

## API ドキュメント

### 動的ワークフローの作成

**エンドポイント:** POST `/api/dynamic-workflow`

**リクエスト本文の例：**

```json
{
  "tools": [
    {
      "id": "custom-calculator",
      "description": "算術演算を実行する",
      "inputSchema": {
        "operation": { "type": "string" },
        "a": { "type": "number" },
        "b": { "type": "number" }
      },
      "outputSchema": {
        "result": { "type": "number" }
      },
      "executeLogic": "const op = context.operation; let result; if (op === 'add') result = context.a + context.b; else if (op === 'subtract') result = context.a - context.b; else if (op === 'multiply') result = context.a * context.b; else if (op === 'divide') result = context.a / context.b; return { result };"
    }
  ],
  "agents": [
    {
      "name": "Calculator Agent",
      "instructions": "あなたは役立つ計算アシスタントです。ユーザーのために計算ツールを使用して演算を実行してください。",
      "model": "gpt-4o",
      "tools": ["custom-calculator"]
    }
  ],
  "workflows": [
    {
      "name": "Calculate Workflow",
      "triggerSchema": {
        "operation": { "type": "string" },
        "a": { "type": "number" },
        "b": { "type": "number" }
      },
      "steps": [
        {
          "id": "calculate",
          "description": "計算を実行する",
          "inputSchema": {
            "operation": { "type": "string" },
            "a": { "type": "number" },
            "b": { "type": "number" }
          },
          "outputSchema": {
            "result": { "type": "number" }
          },
          "executeLogic": "return { result: context.triggerData.a + context.triggerData.b };"
        }
      ],
      "connections": []
    }
  ]
}
```

### ワークフローの実行

**エンドポイント:** POST `/api/workflows/{workflowName}`

**リクエスト本文の例：**

```json
{
  "operation": "add",
  "a": 5,
  "b": 3
}
```

**レスポンスの例：**

```json
{
  "success": true,
  "workflowName": "Calculate Workflow",
  "result": {
    "result": 8
  }
}
```

## プレイブックの実装

このプロジェクトは以下のプレイブックに基づいて実装されています：

1. ユーザー入力解析
   - ユーザーの入力テキストから意図を抽出
   - 必要なツール・ステップ・エージェントを特定
   - 入力スキーマと出力スキーマを定義

2. ツール定義生成
   - ワークフローで必要となるツールを自動生成

3. エージェント定義生成
   - ユーザー要件に基づいたエージェントを自動生成

4. ワークフロー定義生成
   - ユーザー要件に基づいたワークフローを自動生成

5. Mastra設定更新
   - 生成したエージェントとワークフローをMastraインスタンスに登録

6. API エンドポイント作成
   - 生成したワークフローとエージェントを呼び出すAPIエンドポイントを作成
