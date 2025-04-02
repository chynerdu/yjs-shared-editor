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

function broadcastUserCount() {
  const userCount = wss.clients.size;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: "user_count", count: userCount }));
    }
  });
}

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
  console.log(`Client connected. Total clients: ${wss.clients.size}`);
  broadcastUserCount();
});

wss.on("close", () => {
  console.log(`Client disconnected. Total clients: ${wss.clients.size}`);
  broadcastUserCount(); // Notify all clients again
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () =>
  console.log(`WebSocket server running on port ${PORT}`)
);
