import http from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { REDIS_HOST, SECRET_KEY } from '@config';
import { createAdapter } from '@socket.io/redis-adapter';
import { EMIT_ERROR, EMIT_MESSAGE, ON_JOIN_ROOM, ON_MESSAGE } from '@/socket/socket.consts';
import { SocketError } from '@interfaces/sockets.interface';
import SocketException from '@exceptions/SocketException';
import { isEmpty } from '@utils/util';
import jwt from 'jwt-then';
import ChatRoomService from '@services/chat-room.service';
import { logger } from '@utils/logger';

class Socket {
  public io: Server;
  userService: ChatRoomService;

  constructor(httpServer: http.Server) {
    this.userService = new ChatRoomService();
    this.io = new Server(httpServer, { cors: { origin: '*' } });
    this.io.on('connection', socket => {
      console.log('SOCKET ID : ', socket.id);
      this.onJoinRoom(socket);
      this.onSendMessage(socket);
    });

    this.initializeAdapter();
    this.jwtMiddleWare();
  }

  private onJoinRoom(socket) {
    socket.on(ON_JOIN_ROOM, async roomName => {
      const exist = await this.userService.checkExistRoom(roomName);
      if (exist) {
        logger.log('ON JOIN ROOM', roomName);
        socket.join(roomName);
      } else {
        logger.log('NOT FOUND ROOM', roomName);
        this.emitError(socket, new SocketError(SocketException.NOT_FOUND_ROOM));
        return;
      }
    });
  }

  private onSendMessage(socket) {
    socket.on(ON_MESSAGE, messageObject => {
      const { roomName, msg } = messageObject;
      if (isEmpty(roomName)) {
        this.emitError(socket, new SocketError(SocketException.EMPTY_ROOM_ID));
      }
      this.io.to(roomName).emit(EMIT_MESSAGE, msg);
    });
  }

  private emitError(socket, error: SocketError) {
    socket.emit(EMIT_ERROR, error);
  }

  private onDisconnect(socket) {
    socket.on('DISCONNECT', () => {
      socket.disconnect();
    });
  }

  initializeAdapter() {
    const pubClient = createClient({ url: `redis://${REDIS_HOST || 'localhost'}:6379` });
    const subClient = pubClient.duplicate();
    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
      console.log('Redis Adapter Connected');
      this.io.adapter(createAdapter(pubClient, subClient));
    });
  }

  jwtMiddleWare() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        const payload = await jwt.verify(token, SECRET_KEY);
        (socket as any).userId = payload.id;
        next();
      } catch (err) {
        next(err);
      }
    });
  }
}

export default Socket;
