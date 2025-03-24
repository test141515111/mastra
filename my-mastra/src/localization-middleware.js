import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function setupLocalizationMiddleware(app) {
  // JavaScript localization file
  const jsFilePath = path.resolve(__dirname, '../public/js/japanese-localization.js');
  const jsExists = fs.existsSync(jsFilePath);
  
  // CSS file
  const cssFilePath = path.resolve(__dirname, '../public/css/japanese-styles.css');
  const cssExists = fs.existsSync(cssFilePath);
  
  // Custom index.html file
  const indexFilePath = path.resolve(__dirname, '../public/index.html');
  const indexExists = fs.existsSync(indexFilePath);
  
  // Middleware to inject localization scripts
  app.use((req, res, next) => {
    // Store the original send method
    const originalSend = res.send;
    
    // Override the send method
    res.send = function(body) {
      // Only modify HTML responses
      if (typeof body === 'string' && res.get('Content-Type')?.includes('text/html')) {
        // Inject Japanese localization script
        if (jsExists) {
          const scriptTag = '<script src="/js/japanese-localization.js"></script>';
          body = body.replace('</body>', `${scriptTag}</body>`);
        }
        
        // Inject Japanese CSS
        if (cssExists) {
          const cssTag = '<link rel="stylesheet" href="/css/japanese-styles.css">';
          body = body.replace('</head>', `${cssTag}</head>`);
        }
        
        // Set language to Japanese
        body = body.replace('<html lang="en"', '<html lang="ja"');
        
        // Change title to Japanese
        body = body.replace('<title>Mastra Playground</title>', '<title>Mastra プレイグラウンド</title>');
      }
      
      // Call the original send method
      return originalSend.call(this, body);
    };
    
    next();
  });
  
  // Serve static files from public directory
  app.use('/js', (req, res, next) => {
    const filePath = path.join(__dirname, '../public/js', req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });
  
  app.use('/css', (req, res, next) => {
    const filePath = path.join(__dirname, '../public/css', req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      next();
    }
  });
  
  // Use custom index.html if it exists
  if (indexExists) {
    app.get('/', (req, res) => {
      res.sendFile(indexFilePath);
    });
  }
  
  return app;
}
