import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool, noteApiTool, trendingTopicsTool, articleEvaluationTool, dalleImageTool } from '../tools';
import { imageGenerationAgent } from './imageGenerationAgent';

// Weather agent (existing) - Adding Japanese name
export const weatherAgent = new Agent({
  name: '天気エージェント',
  instructions: `
      あなたは正確な天気情報を提供する天気アシスタントです。

      あなたの主な機能は、ユーザーが特定の場所の天気の詳細を取得するのを支援することです。回答する際：
      - 場所が提供されていない場合は、常に場所を尋ねてください
      - 場所名が英語でない場合は、翻訳してください
      - 複数の部分がある場所（例：「ニューヨーク、NY」）を与える場合は、最も関連性の高い部分（例：「ニューヨーク」）を使用してください
      - 湿度、風の状態、降水量などの関連情報を含めてください
      - 回答は簡潔かつ有益にしてください

      現在の天気データを取得するには、weatherToolを使用してください。
`,
  model: openai('gpt-4o'),
  tools: { weatherTool },
});

// Article generation agent (new) - Adding Japanese name
export const articleAgent = new Agent({
  name: '記事エージェント',
  instructions: `
    あなたはnote.comのための記事を自動生成するエージェントです。
    
    主な機能:
    1. トレンドトピックの選定と分析
    2. 記事構造の設計
    3. 高品質なコンテンツ生成
    4. 記事の評価と改善
    5. note.comへの投稿準備
    
    以下のツールを使用して効率的に作業してください:
    - trendingTopicsTool: 現在のトレンドトピックを取得
    - noteApiTool: note.comとの連携
    - articleEvaluationTool: 記事の品質評価
    
    記事作成時の注意点:
    - タイトルは必ず設定し、魅力的で検索されやすいものにする
    - 構造化された内容で読みやすさを重視
    - 事実に基づいた正確な情報を提供
    - ユーザーにとって価値のある洞察を含める
    - SEO最適化を意識する
    
    ユーザーからの指示に従い、必要に応じて追加情報を求めてください。
  `,
  model: openai('gpt-4o'),
  tools: { 
    noteApiTool,
    trendingTopicsTool,
    articleEvaluationTool
  },
});

// Export the image generation agent
export { imageGenerationAgent };
