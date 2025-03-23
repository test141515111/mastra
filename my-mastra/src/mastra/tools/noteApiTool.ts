import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const noteApiTool = createTool({
  id: 'note-api',
  description: 'note.comとの連携ツール。記事の下書き保存や公開を行います。',
  inputSchema: z.object({
    title: z.string().describe('記事のタイトル'),
    content: z.string().describe('記事の本文'),
    tags: z.array(z.string()).optional().describe('記事のタグ（オプション）'),
    isDraft: z.boolean().default(true).describe('下書きとして保存するか（デフォルトはtrue）'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    articleId: z.string().optional(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    // 実際の実装ではnote.comのAPIと連携します
    // 現在はモック実装
    
    // タイトルの検証（必須）
    if (!context.title || context.title.trim() === '') {
      return {
        success: false,
        message: 'タイトルは必須です。記事を保存する前に有効なタイトルを設定してください。',
      };
    }

    // 本文の検証
    if (!context.content || context.content.trim() === '') {
      return {
        success: false,
        message: '記事の本文は必須です。',
      };
    }

    // 成功レスポンス（モック）
    return {
      success: true,
      articleId: `article-${Date.now()}`,
      message: context.isDraft 
        ? '記事が下書きとして保存されました。' 
        : '記事が公開されました。',
    };
  },
});
