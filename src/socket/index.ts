import http from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { REDIS_HOST } from '@config';
import { createAdapter } from '@socket.io/redis-adapter';

class Socket {
  public io: Server;

  constructor(httpServer: http.Server) {
    this.io = new Server(httpServer, { cors: { origin: '*' } });
    this.io.on('connection', socket => {
      console.log(socket);
    });
    this.initializeAdapter();
  }

  initializeAdapter() {
    const pubClient = createClient({ url: `redis://${REDIS_HOST}:6379` });
    const subClient = pubClient.duplicate();
    this.io.adapter(createAdapter(pubClient, subClient));
  }
}

export default Socket;
