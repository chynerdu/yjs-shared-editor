import { setupWSConnection } from "y-websocket/bin/utils";
import { WebSocketServer } from "ws";
import http from "http";

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Y-WebSocket Server Running\n");
});

// Attach WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () =>
  console.log(`WebSocket server running on port ${PORT}`)
);
