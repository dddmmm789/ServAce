const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    ['/api/locksmith', '/health'],
    createProxyMiddleware({
      target: 'http://locksmith-service:3002',
      changeOrigin: true,
    })
  );
  
  app.use(
    ['/api/admin', '/health'],
    createProxyMiddleware({
      target: 'http://admin-service-new:3009',
      changeOrigin: true,
    })
  );
};