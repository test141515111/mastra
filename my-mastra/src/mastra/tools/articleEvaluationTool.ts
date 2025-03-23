import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const articleEvaluationTool = createTool({
  id: 'article-evaluation',
  description: '記事の品質を評価するツール',
  inputSchema: z.object({
    title: z.string().describe('記事のタイトル'),
    content: z.string().describe('記事の本文'),
    targetAudience: z.string().optional().describe('ターゲットオーディエンス（オプション）'),
  }),
  outputSchema: z.object({
    score: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    suggestions: z.array(z.string()),
    seoScore: z.number().min(0).max(100),
    readabilityScore: z.number().min(0).max(100),
  }),
  execute: async ({ context }) => {
    // 実際の実装では自然言語処理やSEO分析ツールと連携します
    // 現在はモック実装
    
    // タイトルと本文の長さチェック
    const titleLength = context.title.length;
    const contentLength = context.content.length;
    
    // 基本的な評価基準
    const hasIntroduction = context.content.includes('はじめに') || context.content.includes('序論');
    const hasConclusion = context.content.includes('まとめ') || context.content.includes('結論');
    const hasSubheadings = (context.content.match(/##/g) || []).length >= 2;
    
    // スコア計算（モック）
    const titleScore = Math.min(100, Math.max(0, titleLength > 20 ? 90 : 70));
    const contentScore = Math.min(100, Math.max(0, contentLength > 1000 ? 85 : 60));
    const structureScore = (hasIntroduction ? 30 : 0) + (hasConclusion ? 30 : 0) + (hasSubheadings ? 40 : 0);
    
    // 総合スコア
    const overallScore = Math.round((titleScore + contentScore + structureScore) / 3);
    
    // 強みと弱み
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    if (titleScore > 80) strengths.push('タイトルは魅力的で適切な長さです');
    else weaknesses.push('タイトルの改善が必要です');
    
    if (contentLength > 1000) strengths.push('記事の長さは十分です');
    else weaknesses.push('記事の内容をより充実させることを検討してください');
    
    if (hasIntroduction) strengths.push('適切な導入部があります');
    else weaknesses.push('明確な導入部が不足しています');
    
    if (hasConclusion) strengths.push('適切なまとめがあります');
    else weaknesses.push('明確な結論が不足しています');
    
    if (hasSubheadings) strengths.push('見出しを使って記事が構造化されています');
    else weaknesses.push('見出しを使って記事を構造化することを検討してください');
    
    // 改善提案
    const suggestions: string[] = [];
    
    if (titleScore < 80) {
      suggestions.push('タイトルをより具体的かつ魅力的にしてください');
    }
    
    if (!hasIntroduction) {
      suggestions.push('記事の冒頭に明確な導入部を追加してください');
    }
    
    if (!hasConclusion) {
      suggestions.push('記事の最後に明確なまとめや結論を追加してください');
    }
    
    if (!hasSubheadings) {
      suggestions.push('見出しを使って記事を構造化し、読みやすくしてください');
    }
    
    if (contentLength < 1000) {
      suggestions.push('記事の内容をより充実させ、詳細な情報を提供してください');
    }
    
    return {
      score: overallScore,
      strengths,
      weaknesses,
      suggestions,
      seoScore: Math.round(titleScore * 0.7 + contentScore * 0.3),
      readabilityScore: Math.round(structureScore * 0.6 + contentScore * 0.4),
    };
  },
});
