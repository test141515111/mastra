import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { weatherTool, noteApiTool, trendingTopicsTool, articleEvaluationTool, dalleImageTool } from '../tools';
import { imageGenerationAgent } from './imageGenerationAgent';

// Weather agent (existing)
export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: openai('gpt-4o'),
  tools: { weatherTool },
});

// Article generation agent (new)
export const articleAgent = new Agent({
  name: 'Article Generation Agent',
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
