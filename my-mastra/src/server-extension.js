import { setupLocalizationMiddleware } from './localization-middleware.js';
import basicAuth from 'express-basic-auth';

export default function extendServer(app) {
  // Apply Basic Authentication only in production
  if (process.env.NODE_ENV === 'production') {
    app.use(basicAuth({
      users: { 
        [process.env.AUTH_USER || 'user']: process.env.AUTH_PASSWORD || 'default',
      },
      challenge: true,
      realm: 'Mastra プレイグラウンド'
    }));
  }
  
  // Apply the localization middleware
  setupLocalizationMiddleware(app);
  
  return app;
}
