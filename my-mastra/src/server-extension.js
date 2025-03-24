import { setupLocalizationMiddleware } from './localization-middleware.js';

export default function extendServer(app) {
  // Apply the localization middleware
  setupLocalizationMiddleware(app);
  
  return app;
}
