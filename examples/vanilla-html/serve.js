#!/usr/bin/env bun

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;
    
    // Default to index.html
    if (filePath === '/' || filePath === '') {
      filePath = '/index.html';
    }
    
    // Serve from examples/vanilla-html or go up to packages
    let fullPath;
    if (filePath.startsWith('/packages/')) {
      fullPath = `../../${filePath}`;
    } else {
      fullPath = `.${filePath}`;
    }
    
    try {
      const file = Bun.file(fullPath);
      
      // Set proper MIME types
      let contentType = 'text/plain';
      if (filePath.endsWith('.html')) contentType = 'text/html';
      else if (filePath.endsWith('.js')) contentType = 'application/javascript';
      else if (filePath.endsWith('.css')) contentType = 'text/css';
      
      return new Response(file, {
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response('404 Not Found', { status: 404 });
    }
  }
});

console.log(`Server running at http://localhost:${server.port}`);
console.log('Open: http://localhost:3000');