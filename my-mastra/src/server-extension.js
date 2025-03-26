import { setupLocalizationMiddleware } from './localization-middleware.js';

export default function extendServer(app) {
  // Basic authentication completely removed for development
  // This ensures the API is accessible without credentials
  
  // Apply the localization middleware
  setupLocalizationMiddleware(app);
  
  return app;
}
