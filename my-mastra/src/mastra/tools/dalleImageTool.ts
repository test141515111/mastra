import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const dalleImageTool = createTool({
  id: 'dalle-image-generator',
  description: 'Generate images using OpenAI DALL-E 3 API',
  inputSchema: z.object({
    prompt: z.string().describe('Text prompt for image generation'),
    n: z.number().optional().describe('Number of images to generate (default: 1)'),
    size: z.enum(['256x256', '512x512', '1024x1024', '1792x1024', '1024x1792']).optional().describe('Image size'),
    response_format: z.enum(['url', 'b64_json']).optional().describe('Response format (default: url)'),
    user: z.string().optional().describe('User identifier for audit/rate limiting'),
  }),
  outputSchema: z.object({
    created: z.number(),
    data: z.array(z.object({
      url: z.string().optional(),
      b64_json: z.string().optional(),
    })),
  }),
  execute: async ({ context }) => {
    try {
      const apiKey = process.env.openaiAPI || process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        // Return a more user-friendly error for the public URL
        return {
          created: Date.now(),
          data: [{ url: 'https://placehold.co/600x400?text=APIキーが設定されていません&lang=ja' }]
        };
      }

      const url = 'https://api.openai.com/v1/images/generations';
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };

      const requestBody = {
        prompt: context.prompt,
        n: context.n || 1,
        size: context.size || '1024x1024',
        response_format: context.response_format || 'url',
        user: context.user
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error (${response.status}): ${
            errorData.error?.message || 'Unknown error'
          }`
        );
      }

      const data = await response.json();
      return {
        created: data.created,
        data: data.data
      };
    } catch (error) {
      console.error('DALL-E image generation error:', error);
      throw error;
    }
  },
});
