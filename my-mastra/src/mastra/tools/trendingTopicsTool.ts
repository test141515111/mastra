import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const trendingTopicsTool = createTool({
  id: 'trending-topics',
  description: '現在のトレンドトピックを取得するツール',
  inputSchema: z.object({
    category: z.string().optional().describe('特定のカテゴリ（オプション）'),
    limit: z.number().default(5).describe('取得するトピック数（デフォルトは5）'),
  }),
  outputSchema: z.object({
    topics: z.array(
      z.object({
        title: z.string(),
        category: z.string(),
        popularity: z.number(),
        description: z.string(),
      })
    ),
  }),
  execute: async ({ context }) => {
    // 実際の実装ではTwitter APIやGoogle Trendsなどと連携します
    // 現在はモック実装
    
    const mockTopics = [
      {
        title: 'AIと創造性',
        category: 'テクノロジー',
        popularity: 95,
        description: '人工知能が創造的な作業をどのように変革しているかについての議論',
      },
      {
        title: 'サステナブルファッション',
        category: 'ライフスタイル',
        popularity: 87,
        description: '環境に配慮したファッションの選択と持続可能なブランドの台頭',
      },
      {
        title: 'リモートワークの未来',
        category: 'ビジネス',
        popularity: 92,
        description: 'ハイブリッドワークモデルとオフィス文化の変化',
      },
      {
        title: 'メンタルヘルスとテクノロジー',
        category: '健康',
        popularity: 89,
        description: 'デジタルツールを活用したメンタルヘルスケアの進化',
      },
      {
        title: '次世代教育',
        category: '教育',
        popularity: 84,
        description: 'オンライン学習とAIを活用した個別化された教育アプローチ',
      },
      {
        title: 'クリプトカレンシーの規制',
        category: '金融',
        popularity: 91,
        description: '各国政府による暗号通貨規制の動向と市場への影響',
      },
      {
        title: 'スマートホームの進化',
        category: 'テクノロジー',
        popularity: 82,
        description: 'IoTデバイスとAIによる家庭の自動化の最新トレンド',
      },
    ];

    // カテゴリフィルタリング
    let filteredTopics = mockTopics;
    if (context.category) {
      filteredTopics = mockTopics.filter(
        topic => topic.category === context.category
      );
    }

    // 人気度でソートして上位を返す
    const sortedTopics = filteredTopics.sort(
      (a, b) => b.popularity - a.popularity
    );
    
    return {
      topics: sortedTopics.slice(0, context.limit),
    };
  },
});
