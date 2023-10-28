const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 4479 });
console.log("[INFO] Websocket Server initialized!")

server.on('connection', function connection(ws) {
  console.log('[WEBSOCKET] client connected');

  ws.on('message', function incoming(message) {
    console.log('[WEBSOCKET] received: %s', message);
  });

  ws.on('error', function error(err) {
    console.error('[WEBSOCKET] WebSocket error:', err);
  });

  ws.on('close', function close() {
    console.log('[WEBSOCKET] client disconnected');
  });
});

module.export = server