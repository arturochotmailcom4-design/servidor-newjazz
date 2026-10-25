// Servidor de salas do New Jazz - Battle Rapper (WebSocket). Uso: npm install && node server.js
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });
const rooms = new Map(); // nome -> Map(id -> {ws, presence})
let nextId = 1;

function broadcastPeers(name) {
  const r = rooms.get(name); if (!r) return;
  const peers = [...r.entries()].map(([peer, c]) => ({ peer, presence: c.presence }));
  const msg = JSON.stringify({ t: 'peers', peers });
  for (const c of r.values()) if (c.ws.readyState === 1) c.ws.send(msg);
}

function leave(ws) {
  if (!ws.room) return;
  const r = rooms.get(ws.room);
  if (r) { r.delete(ws.id); if (!r.size) rooms.delete(ws.room); else broadcastPeers(ws.room); }
  ws.room = null;
}

let dirty = new Set();
setInterval(() => { for (const n of dirty) broadcastPeers(n); dirty.clear(); }, 66);

wss.on('connection', (ws) => {
  ws.id = 'p' + (nextId++).toString(36) + Math.random().toString(36).slice(2, 5);

  ws.on('message', (raw) => {
    if (raw.length > 20000) return;
    let m; try { m = JSON.parse(raw); } catch { return; }

    if (m.t === 'join') {
      leave(ws);
      const name = String(m.room || 'sala').slice(0, 40);
      if (!rooms.has(name)) rooms.set(name, new Map());
      const r = rooms.get(name);

      if (r.size >= 12) { ws.send(JSON.stringify({ t: 'err', code: 'full' })); return; }

      ws.room = name; r.set(ws.id, { ws, presence: {} });
      ws.send(JSON.stringify({ t: 'joined', id: ws.id }));
      broadcastPeers(name);

    } else if (m.t === 'presence' && ws.room) {
      const c = rooms.get(ws.room).get(ws.id);
      if (c && m.patch && typeof m.patch === 'object') {
        Object.assign(c.presence, m.patch);
        dirty.add(ws.room);
      }

    } else if (m.t === 'emit' && ws.room) {
      const out = JSON.stringify({ t: 'ev', topic: String(m.topic).slice(0, 20), peer: ws.id, data: m.data });
      for (const c of rooms.get(ws.room).values()) if (c.ws.readyState === 1) c.ws.send(out);
    }
  });

  ws.on('close', () => leave(ws));
  ws.on('error', () => leave(ws));
});

console.log('New Jazz rooms server na porta ' + PORT);
