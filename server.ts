// server.ts
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    path: '/api/socket.io',
    cors: { origin: '*' }, // tighten in prod (e.g. your domain)
    addTrailingSlash: false,
  });

  // Global map or use rooms for users
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Client sends userId after auth (via query param or auth token later)
    socket.on('join-user-room', (userId: string) => {
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  // Export io for use in adapters
  (global as any).socketIo = io; // simple global for now (or use a singleton module)

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});