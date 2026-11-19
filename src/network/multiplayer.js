/* ================================================================
   LANTERN TALES — MULTIPLAYER SHADOW SYNC (src/network/multiplayer.ts)
   Real-time WebSocket client for guest shadow synchronization
================================================================ */

export const Multiplayer = {
  ws: null,
  connected: false,
  roomCode: null,
  role: 'guest',
  latencyMs: 0,
  remoteHand: {
    x: 0.85,
    y: 0.52,
    present: false,
    pose: 1,
    role: 'remote'
  }
};

let pingInterval = null;

export async function createRoom() {
  try {
    const res = await fetch('/api/rooms', { method: 'POST' });
    const data = await res.json();
    return data.roomCode;
  } catch (err) {
    console.warn('[Multiplayer] Failed to create room via API:', err);
    return 'LOCAL1';
  }
}

export function connectToRoom(roomCode, role = 'guest', onMessage = null) {
  if (Multiplayer.ws) {
    Multiplayer.ws.close();
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws/room`;

  try {
    const ws = new WebSocket(wsUrl);
    Multiplayer.ws = ws;
    Multiplayer.roomCode = roomCode;
    Multiplayer.role = role;

    ws.onopen = () => {
      Multiplayer.connected = true;
      ws.send(JSON.stringify({
        type: 'join',
        roomCode,
        role
      }));

      // Latency monitor
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping', time: performance.now() }));
        }
      }, 5000);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'remote-hand') {
          Multiplayer.remoteHand.x = msg.hand.x;
          Multiplayer.remoteHand.y = msg.hand.y;
          Multiplayer.remoteHand.pose = msg.hand.pose;
          Multiplayer.remoteHand.present = true;
        } else if (msg.type === 'peer-joined') {
          Multiplayer.remoteHand.present = true;
        } else if (msg.type === 'peer-left') {
          Multiplayer.remoteHand.present = false;
        } else if (msg.type === 'pong') {
          Multiplayer.latencyMs = Math.round(performance.now() - msg.time);
        }

        if (typeof onMessage === 'function') {
          onMessage(msg);
        }
      } catch (e) {}
    };

    ws.onclose = () => {
      Multiplayer.connected = false;
      Multiplayer.remoteHand.present = false;
      if (pingInterval) clearInterval(pingInterval);
    };
  } catch (err) {
    console.warn('[Multiplayer] WebSocket connection failed:', err);
  }
}

export function sendHandUpdate(hand) {
  if (!Multiplayer.connected || !Multiplayer.ws) return;
  if (Multiplayer.ws.readyState === WebSocket.OPEN) {
    Multiplayer.ws.send(JSON.stringify({
      type: 'hand-update',
      hand: {
        x: hand.x,
        y: hand.y,
        pose: hand.pose
      }
    }));
  }
}
