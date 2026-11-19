import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/room' });

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(rootDir, {
  extensions: ['html', 'js', 'css', 'json', 'svg', 'png']
}));

// Load static fable and ghost data
let fablesData = {};
let ghostsData = {};
try {
  fablesData = JSON.parse(readFileSync(join(__dirname, 'data', 'fables.json'), 'utf8'));
  ghostsData = JSON.parse(readFileSync(join(__dirname, 'data', 'ghosts.json'), 'utf8'));
} catch (err) {
  console.warn('[Server] Error reading data files:', err.message);
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Lantern Tales (Chhaya)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    activeRooms: rooms.size
  });
});

app.get('/api/fables', (req, res) => {
  res.json(fablesData);
});

app.get('/theatre', (req, res) => {
  res.sendFile(join(rootDir, 'site', 'theatre.html'));
});

app.get('/api/kathputli/acts', (req, res) => {
  const actIds = ['anarkali', 'ghodi', 'sapera', 'amarsingh', 'mela'];
  const acts = [];
  for (const id of actIds) {
    try {
      const data = JSON.parse(readFileSync(join(rootDir, 'src', 'story', 'acts', `${id}.json`), 'utf8'));
      acts.push(data);
    } catch (e) {}
  }
  res.json({ count: acts.length, acts });
});

// Multiplayer Room Management
const rooms = new Map(); // roomCode -> Set of WebSocket clients

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

app.get('/api/rooms', (req, res) => {
  const list = [];
  for (const [code, clients] of rooms.entries()) {
    list.push({ code, participantCount: clients.size });
  }
  res.json({ rooms: list });
});

app.post('/api/rooms', (req, res) => {
  let code = generateRoomCode();
  while (rooms.has(code)) {
    code = generateRoomCode();
  }
  rooms.set(code, new Set());
  res.json({ roomCode: code, created: true });
});

// WebSocket real-time shadow sync
wss.on('connection', (ws, req) => {
  let currentRoom = null;
  let clientRole = 'guest';

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === 'join') {
        const { roomCode, role } = data;
        if (!rooms.has(roomCode)) {
          rooms.set(roomCode, new Set());
        }
        currentRoom = roomCode;
        clientRole = role || 'guest';
        rooms.get(roomCode).add(ws);

        ws.send(JSON.stringify({
          type: 'joined',
          roomCode,
          role: clientRole,
          participantCount: rooms.get(roomCode).size
        }));

        // Broadcast presence
        broadcastToRoom(roomCode, ws, {
          type: 'peer-joined',
          role: clientRole,
          participantCount: rooms.get(roomCode).size
        });
      } else if (data.type === 'hand-update') {
        // Broadcast hand landmark and pose coordinates to peers in the room
        if (currentRoom && rooms.has(currentRoom)) {
          broadcastToRoom(currentRoom, ws, {
            type: 'remote-hand',
            role: clientRole,
            hand: data.hand,
            timestamp: Date.now()
          });
        }
      } else if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      }
    } catch (e) {
      console.warn('[WS] Error handling message:', e.message);
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms.has(currentRoom)) {
      const room = rooms.get(currentRoom);
      room.delete(ws);
      if (room.size === 0) {
        rooms.delete(currentRoom);
      } else {
        broadcastToRoom(currentRoom, null, {
          type: 'peer-left',
          role: clientRole,
          participantCount: room.size
        });
      }
    }
  });
});

function broadcastToRoom(roomCode, senderWs, payload) {
  if (!rooms.has(roomCode)) return;
  const msg = JSON.stringify(payload);
  for (const client of rooms.get(roomCode)) {
    if (client !== senderWs && client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}

const PORT = process.env.PORT || 3001;
const isDirectRun = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('server/server.js');
if (isDirectRun) {
  server.listen(PORT, () => {
    console.log(`🏮 [Lantern Tales] Full-stack Server listening at http://localhost:${PORT}`);
    console.log(`📡 WebSocket Shadow Theater sync active on ws://localhost:${PORT}/ws/room`);
  });
}

export function shutdownServer(callback) {
  wss.close(() => {
    server.close(callback);
  });
}

export { app, server, wss };
